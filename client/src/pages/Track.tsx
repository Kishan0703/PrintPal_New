import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Package, Loader2 } from "lucide-react";
import type { Order } from "@shared/schema";

export default function Track() {
  const [usn, setUsn] = useState("");
  const [searchUsn, setSearchUsn] = useState("");
  
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders/track", searchUsn],
    enabled: searchUsn.length > 0,
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchUsn(usn.toUpperCase());
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      case "printing": return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      case "delivered": return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      default: return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Track Your Orders</h1>
            <p className="text-lg text-muted-foreground">
              Enter your USN to see all your print orders
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Search Orders</CardTitle>
              <CardDescription>Enter your University Seat Number (USN)</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="usn">USN</Label>
                  <Input
                    id="usn"
                    data-testid="input-track-usn"
                    value={usn}
                    onChange={(e) => setUsn(e.target.value.toUpperCase())}
                    placeholder="e.g., 1AB21CS001"
                    className="text-lg"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={!usn || isLoading} data-testid="button-search">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Search Orders
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {searchUsn && !isLoading && (
            <div className="space-y-4">
              {orders && orders.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">
                      Found {orders.length} order{orders.length !== 1 ? "s" : ""}
                    </h2>
                  </div>
                  
                  {orders.map((order) => (
                    <Card key={order.id} className="hover-elevate" data-testid={`card-order-${order.id}`}>
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Package className="w-5 h-5 text-primary" />
                              <p className="font-semibold text-foreground">
                                Order #{order.id.slice(0, 8)}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()} at{" "}
                              {new Date(order.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <Separator />
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground mb-1">Files</p>
                            <p className="font-medium text-foreground">{order.fileNames.join(", ")}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Print Details</p>
                            <p className="font-medium text-foreground">
                              {order.pageCount} pages • {order.printType === "bw" ? "B&W" : "Color"} • 
                              {order.copies} {order.copies > 1 ? "copies" : "copy"}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Assigned Shop</p>
                            <p className="font-medium text-foreground">{order.assignedShop}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Expected Delivery</p>
                            <p className="font-medium text-foreground">{order.expectedDeliveryTime}</p>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">Total Amount</p>
                          <p className="text-2xl font-bold text-primary">₹{order.total.toFixed(2)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-foreground mb-1">
                      No orders found
                    </p>
                    <p className="text-sm text-muted-foreground">
                      No orders found for USN: {searchUsn}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
