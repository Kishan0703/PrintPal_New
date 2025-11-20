import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText, Search, Shield } from "lucide-react";

export function Navbar() {
  const [location, setLocation] = useLocation();
  
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <button 
          onClick={() => setLocation("/")}
          data-testid="link-home"
          className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-3 py-2 -ml-3 cursor-pointer"
        >
          <FileText className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold text-foreground">Campus Print</span>
        </button>
        
        <div className="flex items-center gap-2">
          <Button
            variant={location === "/track" ? "secondary" : "ghost"}
            size="default"
            className="gap-2"
            onClick={() => setLocation("/track")}
            data-testid="link-track"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Track Order</span>
          </Button>
          
          <Button
            variant={location === "/admin" ? "secondary" : "ghost"}
            size="default"
            className="gap-2"
            onClick={() => setLocation("/admin")}
            data-testid="link-admin"
          >
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Admin</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
