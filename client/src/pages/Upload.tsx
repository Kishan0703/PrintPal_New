import { useState } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PricingCalculator } from "@/components/PricingCalculator";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Upload as UploadIcon, CheckCircle2 } from "lucide-react";

const steps = ["Student Info", "Upload Files", "Print Options", "Review & Submit"];

export default function Upload() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  
  const [studentName, setStudentName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [usn, setUsn] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [classSection, setClassSection] = useState("");
  const [year, setYear] = useState("");
  
  const [files, setFiles] = useState<File[]>([]);
  const [printType, setPrintType] = useState<"bw" | "color">("bw");
  const [copies, setCopies] = useState(1);
  const [sides, setSides] = useState<"single" | "double">("single");
  const [pageCount, setPageCount] = useState(10);
  
  const [stapling, setStapling] = useState(false);
  const [spiralBinding, setSpiralBinding] = useState(false);
  const [graphSheet, setGraphSheet] = useState(false);
  const [recordSheet, setRecordSheet] = useState(false);
  const [deliverySpeed, setDeliverySpeed] = useState<"normal" | "fast" | "express">("normal");
  
  const createOrderMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/orders", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Order placed successfully!",
        description: `Your order ID is ${data.id}`,
      });
      setLocation(`/confirmation/${data.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating order",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };
  
  const handleSubmit = async () => {
    const formData = new FormData();
    
    formData.append("studentName", studentName);
    formData.append("collegeName", collegeName);
    formData.append("usn", usn);
    formData.append("department", department);
    formData.append("semester", semester);
    formData.append("class", classSection);
    formData.append("year", year);
    
    files.forEach((file) => {
      formData.append("files", file);
    });
    
    formData.append("printType", printType);
    formData.append("copies", copies.toString());
    formData.append("sides", sides);
    formData.append("pageCount", pageCount.toString());
    formData.append("stapling", stapling.toString());
    formData.append("spiralBinding", spiralBinding.toString());
    formData.append("graphSheet", graphSheet.toString());
    formData.append("recordSheet", recordSheet.toString());
    formData.append("deliverySpeed", deliverySpeed);
    
    createOrderMutation.mutate(formData);
  };
  
  const canProceed = () => {
    if (currentStep === 0) {
      return studentName && collegeName && usn && department && semester && classSection && year;
    }
    if (currentStep === 1) {
      return files.length > 0;
    }
    return true;
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 md:gap-4 mb-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                        index <= currentStep
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                      data-testid={`step-indicator-${index}`}
                    >
                      {index < currentStep ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                    </div>
                    <span className="text-xs md:text-sm font-medium text-center hidden md:block">
                      {step}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 md:w-16 h-1 mx-1 md:mx-2 transition-colors ${
                        index < currentStep ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground md:hidden">
              {steps[currentStep]}
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {currentStep === 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Student Information</CardTitle>
                    <CardDescription>Please provide your details for delivery</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="studentName">Student Name *</Label>
                        <Input
                          id="studentName"
                          data-testid="input-student-name"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="collegeName">College Name *</Label>
                        <Input
                          id="collegeName"
                          data-testid="input-college-name"
                          value={collegeName}
                          onChange={(e) => setCollegeName(e.target.value)}
                          placeholder="Enter college name"
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="usn">USN *</Label>
                        <Input
                          id="usn"
                          data-testid="input-usn"
                          value={usn}
                          onChange={(e) => setUsn(e.target.value.toUpperCase())}
                          placeholder="e.g., 1AB21CS001"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="department">Department / Branch *</Label>
                        <Input
                          id="department"
                          data-testid="input-department"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          placeholder="e.g., Computer Science"
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="semester">Semester *</Label>
                        <Select value={semester} onValueChange={setSemester}>
                          <SelectTrigger id="semester" data-testid="select-semester">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                              <SelectItem key={sem} value={sem.toString()}>
                                Semester {sem}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="class">Class / Section *</Label>
                        <Select value={classSection} onValueChange={setClassSection}>
                          <SelectTrigger id="class" data-testid="select-class">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {["A", "B", "C", "D", "E"].map((cls) => (
                              <SelectItem key={cls} value={cls}>
                                Section {cls}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="year">Year *</Label>
                        <Select value={year} onValueChange={setYear}>
                          <SelectTrigger id="year" data-testid="select-year">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((yr) => (
                              <SelectItem key={yr} value={yr}>
                                {yr}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Upload PDF Files</CardTitle>
                    <CardDescription>Select one or more PDF files to print</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="files">PDF Files *</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                        <input
                          type="file"
                          id="files"
                          data-testid="input-files"
                          multiple
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="files"
                          className="cursor-pointer flex flex-col items-center gap-3"
                        >
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <UploadIcon className="w-8 h-8 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Click to upload PDF files</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              or drag and drop (multiple files supported)
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    {files.length > 0 && (
                      <div className="space-y-2">
                        <Label>Selected Files ({files.length})</Label>
                        <div className="space-y-2">
                          {files.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-muted rounded-lg"
                              data-testid={`file-item-${index}`}
                            >
                              <span className="text-sm font-medium text-foreground truncate">
                                {file.name}
                              </span>
                              <span className="text-xs text-muted-foreground ml-2">
                                {(file.size / 1024).toFixed(1)} KB
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="pageCount">Approximate Page Count *</Label>
                      <Input
                        id="pageCount"
                        type="number"
                        min="1"
                        data-testid="input-page-count"
                        value={pageCount}
                        onChange={(e) => setPageCount(parseInt(e.target.value) || 1)}
                        placeholder="Enter total number of pages"
                      />
                      <p className="text-xs text-muted-foreground">
                        This helps us calculate pricing. We'll verify the actual page count.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Print Options</CardTitle>
                    <CardDescription>Customize your print preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="printType">Print Type *</Label>
                        <Select value={printType} onValueChange={(v) => setPrintType(v as "bw" | "color")}>
                          <SelectTrigger id="printType" data-testid="select-print-type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bw">Black & White (₹3/page)</SelectItem>
                            <SelectItem value="color">Color (₹11/page)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="copies">Number of Copies *</Label>
                        <Input
                          id="copies"
                          type="number"
                          min="1"
                          data-testid="input-copies"
                          value={copies}
                          onChange={(e) => setCopies(parseInt(e.target.value) || 1)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sides">Print Sides *</Label>
                      <Select value={sides} onValueChange={(v) => setSides(v as "single" | "double")}>
                        <SelectTrigger id="sides" data-testid="select-sides">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single Sided</SelectItem>
                          <SelectItem value="double">Double Sided (saves paper)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Additional Services</Label>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="stapling"
                          data-testid="checkbox-stapling"
                          checked={stapling}
                          onCheckedChange={(checked) => setStapling(checked as boolean)}
                        />
                        <label
                          htmlFor="stapling"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          Stapling (₹2)
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="spiralBinding"
                          data-testid="checkbox-spiral-binding"
                          checked={spiralBinding}
                          onCheckedChange={(checked) => setSpiralBinding(checked as boolean)}
                        />
                        <label
                          htmlFor="spiralBinding"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          Spiral Binding (₹20)
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="graphSheet"
                          data-testid="checkbox-graph-sheet"
                          checked={graphSheet}
                          onCheckedChange={(checked) => setGraphSheet(checked as boolean)}
                        />
                        <label
                          htmlFor="graphSheet"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          Graph Sheet Printing
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="recordSheet"
                          data-testid="checkbox-record-sheet"
                          checked={recordSheet}
                          onCheckedChange={(checked) => setRecordSheet(checked as boolean)}
                        />
                        <label
                          htmlFor="recordSheet"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          Record Sheet Printing
                        </label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deliverySpeed">Delivery Speed *</Label>
                      <Select
                        value={deliverySpeed}
                        onValueChange={(v) => setDeliverySpeed(v as "normal" | "fast" | "express")}
                      >
                        <SelectTrigger id="deliverySpeed" data-testid="select-delivery-speed">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal (2 hours) - Free</SelectItem>
                          <SelectItem value="fast">Fast (1 hour) - ₹5</SelectItem>
                          <SelectItem value="express">Express (30 min) - ₹10</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review Your Order</CardTitle>
                    <CardDescription>Please verify all details before submitting</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Student Information</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Name</p>
                          <p className="font-medium text-foreground">{studentName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">USN</p>
                          <p className="font-medium text-foreground">{usn}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">College</p>
                          <p className="font-medium text-foreground">{collegeName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Department</p>
                          <p className="font-medium text-foreground">{department}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Semester & Class</p>
                          <p className="font-medium text-foreground">
                            Sem {semester}, Section {classSection}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Year</p>
                          <p className="font-medium text-foreground">{year}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Files & Print Options</h4>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {files.length} file(s) • {pageCount} pages • {printType === "bw" ? "B&W" : "Color"} • 
                          {copies} {copies > 1 ? "copies" : "copy"} • {sides === "single" ? "Single" : "Double"} sided
                        </p>
                        {(stapling || spiralBinding || graphSheet || recordSheet) && (
                          <p className="text-sm text-muted-foreground">
                            Extras: {[
                              stapling && "Stapling",
                              spiralBinding && "Spiral Binding",
                              graphSheet && "Graph Sheets",
                              recordSheet && "Record Sheets",
                            ].filter(Boolean).join(", ")}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Delivery: {deliverySpeed === "normal" ? "Normal (2 hours)" : deliverySpeed === "fast" ? "Fast (1 hour)" : "Express (30 min)"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={currentStep === 0 || createOrderMutation.isPending}
                  data-testid="button-back"
                >
                  Back
                </Button>
                
                {currentStep < 3 ? (
                  <Button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!canProceed()}
                    data-testid="button-next"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={createOrderMutation.isPending}
                    data-testid="button-submit"
                  >
                    {createOrderMutation.isPending && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    Submit Order
                  </Button>
                )}
              </div>
            </div>
            
            {/* Pricing Calculator Sidebar */}
            <div className="lg:col-span-1">
              <PricingCalculator
                pageCount={pageCount}
                printType={printType}
                copies={copies}
                sides={sides}
                stapling={stapling}
                spiralBinding={spiralBinding}
                graphSheet={graphSheet}
                recordSheet={recordSheet}
                deliverySpeed={deliverySpeed}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
