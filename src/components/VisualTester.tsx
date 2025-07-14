import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Upload,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ComparisonResult {
  similarity: number;
  differences: number;
  status: "pass" | "fail" | "warning";
  regions: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    type: "addition" | "deletion" | "modification";
  }>;
}

const VisualTester = () => {
  const [baselineImage, setBaselineImage] = useState<string>("");
  const [comparisonImage, setComparisonImage] = useState<string>("");
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const { toast } = useToast();

  const compareImages = async () => {
    if (!baselineImage || !comparisonImage) {
      toast({
        title: "Error",
        description: "Please upload both baseline and comparison images",
        variant: "destructive",
      });
      return;
    }

    setIsComparing(true);

    // Simulate image comparison
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockResult: ComparisonResult = {
      similarity: 94.7,
      differences: 23,
      status: "warning",
      regions: [
        { x: 120, y: 80, width: 200, height: 40, type: "modification" },
        { x: 350, y: 200, width: 100, height: 30, type: "addition" },
        { x: 50, y: 300, width: 150, height: 50, type: "deletion" },
      ],
    };

    setResult(mockResult);
    setIsComparing(false);

    toast({
      title: "Comparison Complete",
      description: `Found ${mockResult.differences} differences (${mockResult.similarity}% similar)`,
    });
  };

  const handleImageUpload = (type: "baseline" | "comparison") => {
    // Simulate image upload
    const mockImageUrl = `https://via.placeholder.com/400x300/333/fff?text=${
      type === "baseline" ? "Baseline" : "Comparison"
    }+Image`;

    if (type === "baseline") {
      setBaselineImage(mockImageUrl);
    } else {
      setComparisonImage(mockImageUrl);
    }

    toast({
      title: "Image Uploaded",
      description: `${
        type === "baseline" ? "Baseline" : "Comparison"
      } image uploaded successfully`,
    });
  };

  const getStatusIcon = (status: "pass" | "fail" | "warning") => {
    switch (status) {
      case "pass":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "fail":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: "pass" | "fail" | "warning") => {
    switch (status) {
      case "pass":
        return "default";
      case "fail":
        return "destructive";
      case "warning":
        return "secondary";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Eye className="w-5 h-5 mr-2 text-primary" />
          Visual Regression Testing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="flex flex-col h-[50vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Baseline Image
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  {baselineImage ? (
                    <img
                      src={baselineImage}
                      alt="Baseline"
                      className="max-w-full h-32 object-cover mx-auto rounded"
                    />
                  ) : (
                    <div className="py-8">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Upload baseline screenshot
                      </p>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleImageUpload("baseline")}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Comparison Image
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  {comparisonImage ? (
                    <img
                      src={comparisonImage}
                      alt="Comparison"
                      className="max-w-full h-32 object-cover mx-auto rounded"
                    />
                  ) : (
                    <div className="py-8">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Upload comparison screenshot
                      </p>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleImageUpload("comparison")}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            </div>

            <Button
              onClick={compareImages}
              disabled={isComparing}
              className="w-full mt-auto"
            >
              {isComparing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Comparing Images...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Compare Images
                </>
              )}
            </Button>
          </div>

          {/* Output Section */}
          <div className="flex flex-col h-[50vh]">
            {result ? (
              <div className="space-y-4 overflow-y-auto flex-1">
                <div className="flex items-center gap-2">
                  {getStatusIcon(result.status)}
                  <Badge variant={getStatusColor(result.status)}>
                    {result.status.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">{result.similarity}% Similar</Badge>
                  <Badge variant="outline">
                    {result.differences} Differences
                  </Badge>
                </div>

                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Difference Regions</h3>
                  <div className="space-y-2">
                    {result.regions.map((region, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="capitalize">{region.type}</span>
                        <span className="text-muted-foreground">
                          ({region.x}, {region.y}) {region.width}×
                          {region.height}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-8 border border-dashed border-border rounded-lg">
                <Eye className="w-8 h-8 mb-2 text-primary" />
                <span>Visual comparison results will appear here.</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualTester;
