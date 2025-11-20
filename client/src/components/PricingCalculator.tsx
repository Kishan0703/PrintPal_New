import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PRICING } from "@shared/schema";

interface PricingCalculatorProps {
  pageCount: number;
  printType: "bw" | "color";
  copies: number;
  sides: "single" | "double";
  stapling: boolean;
  spiralBinding: boolean;
  graphSheet: boolean;
  recordSheet: boolean;
  deliverySpeed: "normal" | "fast" | "express";
}

export function PricingCalculator({
  pageCount,
  printType,
  copies,
  sides,
  stapling,
  spiralBinding,
  graphSheet,
  recordSheet,
  deliverySpeed,
}: PricingCalculatorProps) {
  const effectivePages = sides === "double" ? Math.ceil(pageCount / 2) : pageCount;
  const pricePerPage = printType === "color" ? PRICING.COLOR_PER_PAGE : PRICING.BW_PER_PAGE;
  const printCost = effectivePages * pricePerPage * copies;
  
  let extras = 0;
  const extraItems: { label: string; amount: number }[] = [];
  
  if (graphSheet) {
    extras += PRICING.GRAPH_SHEET;
    extraItems.push({ label: "Graph Sheet", amount: PRICING.GRAPH_SHEET });
  }
  
  if (recordSheet) {
    extras += PRICING.RECORD_SHEET;
    extraItems.push({ label: "Record Sheet", amount: PRICING.RECORD_SHEET });
  }
  
  if (stapling) {
    extras += PRICING.STAPLING;
    extraItems.push({ label: "Stapling", amount: PRICING.STAPLING });
  }
  
  if (spiralBinding) {
    extras += PRICING.SPIRAL_BINDING;
    extraItems.push({ label: "Spiral Binding", amount: PRICING.SPIRAL_BINDING });
  }
  
  if (deliverySpeed === "fast") {
    extras += PRICING.FAST_DELIVERY;
    extraItems.push({ label: "Fast Delivery", amount: PRICING.FAST_DELIVERY });
  } else if (deliverySpeed === "express") {
    extras += PRICING.EXPRESS_DELIVERY;
    extraItems.push({ label: "Express Delivery", amount: PRICING.EXPRESS_DELIVERY });
  }
  
  const total = printCost + extras;
  
  return (
    <Card className="sticky top-20">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl">Price Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {effectivePages} {sides === "double" ? "sheets" : "pages"} × {copies} {copies > 1 ? "copies" : "copy"}
            </span>
            <span className="font-medium text-foreground">₹{pricePerPage}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-foreground">Print Cost</span>
            <span className="font-semibold text-foreground">₹{printCost.toFixed(2)}</span>
          </div>
          
          {extraItems.length > 0 && (
            <>
              <Separator />
              {extraItems.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium text-foreground">₹{item.amount.toFixed(2)}</span>
                </div>
              ))}
            </>
          )}
        </div>
        
        <Separator />
        
        <div className="flex justify-between items-baseline pt-2">
          <span className="text-lg font-semibold text-foreground">Total Amount</span>
          <span className="text-3xl font-bold text-primary" data-testid="text-total-amount">
            ₹{total.toFixed(2)}
          </span>
        </div>
        
        <div className="pt-2 text-xs text-muted-foreground space-y-1">
          <p>• B&W: ₹{PRICING.BW_PER_PAGE}/page</p>
          <p>• Color: ₹{PRICING.COLOR_PER_PAGE}/page</p>
          <p>• Double-sided counts as half pages</p>
        </div>
      </CardContent>
    </Card>
  );
}
