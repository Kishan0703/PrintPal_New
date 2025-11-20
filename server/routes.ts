import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { PRICING, SHOPS, DELIVERY_TIMES, type InsertOrder, insertOrderSchema } from "@shared/schema";

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
      cb(null, uniqueSuffix + "-" + sanitizedName);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024,
    files: 10,
  },
});

async function assignShop(): Promise<{ shop: string; queue: number }> {
  const allOrders = await storage.getAllOrders();
  const pendingOrders = allOrders.filter(o => o.status === "pending" || o.status === "printing");
  
  const currentOrders = new Map<string, number>();
  
  SHOPS.forEach((shop) => {
    currentOrders.set(shop.id, shop.baseQueue);
  });
  
  pendingOrders.forEach((order) => {
    const shopId = SHOPS.find(s => s.name === order.assignedShop)?.id;
    if (shopId) {
      currentOrders.set(shopId, (currentOrders.get(shopId) || 0) + 1);
    }
  });
  
  let leastCrowdedShop = SHOPS[0];
  let minQueue = currentOrders.get(SHOPS[0].id) || 0;
  
  for (const shop of SHOPS) {
    const queue = currentOrders.get(shop.id) || 0;
    if (queue < minQueue) {
      minQueue = queue;
      leastCrowdedShop = shop;
    }
  }
  
  return {
    shop: leastCrowdedShop.name,
    queue: minQueue,
  };
}

function calculatePricing(
  pageCount: number,
  printType: "bw" | "color",
  copies: number,
  sides: "single" | "double",
  stapling: boolean,
  spiralBinding: boolean,
  graphSheet: boolean,
  recordSheet: boolean,
  deliverySpeed: "normal" | "fast" | "express"
): { subtotal: number; extras: number; total: number } {
  const effectivePages = sides === "double" ? Math.ceil(pageCount / 2) : pageCount;
  const pricePerPage = printType === "color" ? PRICING.COLOR_PER_PAGE : PRICING.BW_PER_PAGE;
  const subtotal = effectivePages * pricePerPage * copies;
  
  let extras = 0;
  
  if (graphSheet) {
    extras += PRICING.GRAPH_SHEET;
  }
  
  if (recordSheet) {
    extras += PRICING.RECORD_SHEET;
  }
  
  if (stapling) {
    extras += PRICING.STAPLING;
  }
  
  if (spiralBinding) {
    extras += PRICING.SPIRAL_BINDING;
  }
  
  if (deliverySpeed === "fast") {
    extras += PRICING.FAST_DELIVERY;
  } else if (deliverySpeed === "express") {
    extras += PRICING.EXPRESS_DELIVERY;
  }
  
  const total = subtotal + extras;
  
  return { subtotal, extras, total };
}

function calculateExpectedDeliveryTime(deliverySpeed: "normal" | "fast" | "express"): string {
  const now = new Date();
  const deliveryTime = DELIVERY_TIMES[deliverySpeed];
  
  const minutes = deliverySpeed === "express" ? 30 : deliverySpeed === "fast" ? 60 : 120;
  now.setMinutes(now.getMinutes() + minutes);
  
  return `${deliveryTime} (by ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/orders", upload.array("files"), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).send("No files uploaded");
      }
      
      const rawData = {
        studentName: req.body.studentName,
        collegeName: req.body.collegeName,
        usn: req.body.usn?.toUpperCase(),
        department: req.body.department,
        semester: req.body.semester,
        class: req.body.class,
        year: req.body.year,
        printType: req.body.printType,
        copies: parseInt(req.body.copies) || 1,
        sides: req.body.sides,
        pageCount: parseInt(req.body.pageCount) || 1,
        stapling: req.body.stapling === "true",
        spiralBinding: req.body.spiralBinding === "true",
        graphSheet: req.body.graphSheet === "true",
        recordSheet: req.body.recordSheet === "true",
        deliverySpeed: req.body.deliverySpeed || "normal",
      };
      
      const fileNames = files.map((f) => f.originalname);
      const filePaths = files.map((f) => f.filename);
      
      const { shop, queue } = await assignShop();
      
      const pricing = calculatePricing(
        rawData.pageCount,
        rawData.printType as "bw" | "color",
        rawData.copies,
        rawData.sides as "single" | "double",
        rawData.stapling,
        rawData.spiralBinding,
        rawData.graphSheet,
        rawData.recordSheet,
        rawData.deliverySpeed as "normal" | "fast" | "express"
      );
      
      const expectedDeliveryTime = calculateExpectedDeliveryTime(
        rawData.deliverySpeed as "normal" | "fast" | "express"
      );
      
      const orderData: InsertOrder = {
        ...rawData,
        fileNames,
        filePaths,
        subtotal: pricing.subtotal,
        extras: pricing.extras,
        total: pricing.total,
        assignedShop: shop,
        shopQueue: queue,
        status: "pending",
        expectedDeliveryTime,
      };
      
      const order = await storage.createOrder(orderData);
      
      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).send("Error creating order");
    }
  });
  
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).send("Error fetching orders");
    }
  });
  
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      
      if (!order) {
        return res.status(404).send("Order not found");
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).send("Error fetching order");
    }
  });
  
  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      
      if (!status || !["pending", "printing", "delivered"].includes(status)) {
        return res.status(400).send("Invalid status");
      }
      
      const order = await storage.updateOrderStatus(req.params.id, status);
      
      if (!order) {
        return res.status(404).send("Order not found");
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).send("Error updating order status");
    }
  });
  
  app.get("/api/orders/track/:usn", async (req, res) => {
    try {
      const orders = await storage.getOrdersByUsn(req.params.usn);
      res.json(orders);
    } catch (error) {
      console.error("Error tracking orders:", error);
      res.status(500).send("Error tracking orders");
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
