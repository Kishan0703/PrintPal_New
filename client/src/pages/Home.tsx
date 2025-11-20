import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Upload, Printer, Truck, Check, FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  Upload. Print. Deliver.
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Students upload PDFs → we send them to a less-crowded Xerox shop → 
                  we print → we deliver inside college based on USN, class, semester.
                </p>
                <div className="pt-4">
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-6"
                    onClick={() => window.location.href = "/upload"}
                    data-testid="link-upload-hero"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Printout
                  </Button>
                </div>
              </div>
              
              <div className="hidden md:flex items-center justify-center">
                <div className="relative w-full max-w-md aspect-square">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl"></div>
                  <div className="relative flex items-center justify-center h-full">
                    <div className="text-center space-y-4 p-8">
                      <div className="w-32 h-32 mx-auto bg-primary/20 rounded-2xl flex items-center justify-center">
                        <FileText className="w-16 h-16 text-primary" />
                      </div>
                      <p className="text-xl font-semibold text-foreground">Fast & Convenient</p>
                      <p className="text-muted-foreground">Print delivery made easy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 md:py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold text-center text-foreground mb-12">
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover-elevate">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
                    <Upload className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      1
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Upload PDFs</h3>
                    <p className="text-muted-foreground">
                      Upload your documents with student details and print preferences
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover-elevate">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
                    <Printer className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      2
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">We Print</h3>
                    <p className="text-muted-foreground">
                      Sent to less-crowded shops for faster processing and quality prints
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover-elevate">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
                    <Truck className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      3
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Deliver to You</h3>
                    <p className="text-muted-foreground">
                      Delivered inside college based on your USN, class, and semester
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Comparison */}
        <section className="py-12 md:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold text-center text-foreground mb-12">
              Simple, Transparent Pricing
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="hover-elevate">
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-foreground">Black & White</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-foreground">₹3</span>
                      <span className="text-muted-foreground">per page</span>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">High quality B&W prints</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">Single or double-sided</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">Multiple copies available</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="hover-elevate border-primary">
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-foreground">Color</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-foreground">₹11</span>
                      <span className="text-muted-foreground">per page</span>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">Vibrant color prints</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">Perfect for presentations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">Professional quality</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Additional services: Stapling (₹2) • Spiral Binding (₹20) • Fast Delivery (₹5) • Express Delivery (₹10)
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Ready to Get Started?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload your documents now and experience hassle-free print delivery to your campus.
            </p>
            <div className="pt-4">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => window.location.href = "/upload"}
                data-testid="link-upload-cta"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Your Files
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-border">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold text-foreground mb-3">Services</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>PDF Printing</li>
                  <li>Binding & Stapling</li>
                  <li>Campus Delivery</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-3">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <button 
                      onClick={() => window.location.href = "/upload"}
                      data-testid="link-upload-footer"
                      className="text-muted-foreground hover:text-foreground transition-colors text-left"
                    >
                      Upload Files
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => window.location.href = "/track"}
                      data-testid="link-track-footer"
                      className="text-muted-foreground hover:text-foreground transition-colors text-left"
                    >
                      Track Order
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => window.location.href = "/admin"}
                      data-testid="link-admin-footer"
                      className="text-muted-foreground hover:text-foreground transition-colors text-left"
                    >
                      Admin Dashboard
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-3">Contact</h4>
                <p className="text-sm text-muted-foreground">
                  Email: support@campusprint.in<br />
                  Phone: +91 1234567890
                </p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
              © 2024 Campus Print Delivery. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
