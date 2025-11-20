import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Printer, Truck, Package, Download, Loader2 } from "lucide-react";
import type { Order } from "@shared/schema";
import { DELIVERY_TIMES } from "@shared/schema";

export default function Confirmation() {
  const [, params] = useRoute("/confirmation/:id");
  const orderId = params?.id;
  
  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ["/api/orders", orderId],
    enabled: !!orderId,
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground">Order not found</h1>
          </div>
        </div>
      </div>
    );
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "printing": return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "delivered": return "bg-green-500/10 text-green-700 dark:text-green-400";
      default: return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };
  
  const handleDownloadReceipt = () => {
    const receiptContent = `
CAMPUS PRINT DELIVERY - ORDER RECEIPT
=====================================

Order ID: ${order.id}
Date: ${new Date(order.createdAt).toLocaleString()}

STUDENT INFORMATION
-------------------
Name: ${order.studentName}
USN: ${order.usn}
College: ${order.collegeName}
Department: ${order.department}
Semester: ${order.semester} | Class: ${order.class} | Year: ${order.year}

ORDER DETAILS
-------------
Files: ${order.fileNames.join(", ")}
Pages: ${order.pageCount}
Print Type: ${order.printType === "bw" ? "Black & White" : "Color"}
Copies: ${order.copies}
Sides: ${order.sides === "single" ? "Single Sided" : "Double Sided"}

ADDITIONAL SERVICES
-------------------
${order.stapling ? "✓ Stapling\n" : ""}${order.spiralBinding ? "✓ Spiral Binding\n" : ""}${order.graphSheet ? "✓ Graph Sheet\n" : ""}${order.recordSheet ? "✓ Record Sheet\n" : ""}
Delivery Speed: ${order.deliverySpeed.charAt(0).toUpperCase() + order.deliverySpeed.slice(1)}

PRICING
-------
Subtotal: ₹${order.subtotal.toFixed(2)}
Extras: ₹${order.extras.toFixed(2)}
Total Amount: ₹${order.total.toFixed(2)}

DELIVERY INFORMATION
--------------------
Assigned Shop: ${order.assignedShop}
Expected Delivery: ${order.expectedDeliveryTime}
Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}

Thank you for using Campus Print Delivery!
For support, contact: support@campusprint.in
    `.trim();
    
    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `order-receipt-${order.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Success Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Order Placed Successfully!
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Your order ID: <span className="font-mono font-semibold text-foreground" data-testid="text-order-id">{order.id}</span>
              </p>
            </div>
          </div>
          
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    order.status === "pending" || order.status === "printing" || order.status === "delivered"
                      ? "bg-green-500/10" : "bg-muted"
                  }`}>
                    <Package className={`w-6 h-6 ${
                      order.status === "pending" || order.status === "printing" || order.status === "delivered"
                        ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Order Placed</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {(order.status === "pending" || order.status === "printing" || order.status === "delivered") && (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  )}
                </div>
                
                <div className="ml-6 border-l-2 border-muted h-8"></div>
                
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    order.status === "printing" || order.status === "delivered"
                      ? "bg-blue-500/10" : "bg-muted"
                  }`}>
                    <Printer className={`w-6 h-6 ${
                      order.status === "printing" || order.status === "delivered"
                        ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Printing</p>
                    <p className="text-sm text-muted-foreground">
                      At {order.assignedShop}
                    </p>
                  </div>
                  {(order.status === "printing" || order.status === "delivered") && (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                
                <div className="ml-6 border-l-2 border-muted h-8"></div>
                
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    order.status === "delivered" ? "bg-primary/10" : "bg-muted"
                  }`}>
                    <Truck className={`w-6 h-6 ${
                      order.status === "delivered" ? "text-primary" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Delivered</p>
                    <p className="text-sm text-muted-foreground">
                      Expected: {order.expectedDeliveryTime}
                    </p>
                  </div>
                  {order.status === "delivered" && (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order Summary</CardTitle>
                <Badge className={getStatusColor(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Student Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium text-foreground">{order.studentName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">USN</p>
                    <p className="font-medium text-foreground">{order.usn}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">College</p>
                    <p className="font-medium text-foreground">{order.collegeName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Department</p>
                    <p className="font-medium text-foreground">{order.department}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Print Details</h4>
                <div className="text-sm space-y-2">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">{order.fileNames.length}</span> file(s): {order.fileNames.join(", ")}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">{order.pageCount}</span> pages • 
                    <span className="font-medium text-foreground"> {order.printType === "bw" ? "Black & White" : "Color"}</span> • 
                    <span className="font-medium text-foreground"> {order.copies}</span> {order.copies > 1 ? "copies" : "copy"} • 
                    <span className="font-medium text-foreground"> {order.sides === "single" ? "Single" : "Double"}</span> sided
                  </p>
                  {(order.stapling || order.spiralBinding || order.graphSheet || order.recordSheet) && (
                    <p className="text-muted-foreground">
                      Extras: {[
                        order.stapling && "Stapling",
                        order.spiralBinding && "Spiral Binding",
                        order.graphSheet && "Graph Sheets",
                        order.recordSheet && "Record Sheets",
                      ].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Shop & Delivery</h4>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold text-foreground">{order.assignedShop}</p>
                    <Badge variant="outline" className="text-xs">
                      Less Crowded
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Queue: {order.shopQueue} orders ahead
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Expected delivery: <span className="font-medium text-foreground">{order.expectedDeliveryTime}</span>
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">₹{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Extras</span>
                  <span className="font-medium text-foreground">₹{order.extras.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-lg font-semibold text-foreground">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleDownloadReceipt}
              data-testid="button-download-receipt"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
            <Button
              className="flex-1"
              onClick={() => window.location.href = `/track?usn=${order.usn}`}
              data-testid="button-track-order"
            >
              Track Your Orders
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
