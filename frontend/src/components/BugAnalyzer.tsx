import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Bug, Upload, Loader2, AlertTriangle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BugAnalysis {
  severity: "Critical" | "High" | "Medium" | "Low";
  category: string;
  summary: string;
  steps: string[];
  suggestions: string[];
}

const BugAnalyzer = () => {
  const [bugDescription, setBugDescription] = useState("");
  const [analysis, setAnalysis] = useState<BugAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeBug = async () => {
    if (!bugDescription.trim()) {
      toast({
        title: "Error",
        description: "Please describe the bug first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze-bug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: bugDescription }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze bug");
      }

      const data = await response.json();
      let analysis = data.analysis;

      // Handle markdown-wrapped JSON response from Gemini
      if (typeof analysis === "string") {
        // Remove markdown code blocks if present
        if (analysis.includes("```json")) {
          analysis = analysis.replace(/```json\n?/g, "").replace(/```\n?/g, "");
        }

        try {
          // Try to parse as JSON
          analysis = JSON.parse(analysis);
        } catch (e) {
          // If JSON parsing fails, create a simple analysis
          analysis = {
            severity: "Medium",
            category: "General",
            summary: analysis,
            steps: [analysis],
            suggestions: ["Review the bug description for more details"],
          };
        }
      }

      // Map the new response format to the expected interface
      const mappedAnalysis: BugAnalysis = {
        severity: analysis.severity || "Medium",
        category:
          analysis.category ||
          analysis["type_of_bug_error"] ||
          analysis["type of bug/error"] ||
          "General",
        summary:
          analysis.summary ||
          analysis["possible_cause"] ||
          "Bug analysis completed",
        steps: Array.isArray(analysis["steps_to_fix"])
          ? analysis["steps_to_fix"]
          : Array.isArray(analysis["steps to fix"])
          ? analysis["steps to fix"]
          : Array.isArray(analysis.steps)
          ? analysis.steps
          : [],
        suggestions: Array.isArray(analysis.suggestions)
          ? analysis.suggestions
          : [],
      };

      // If possible_cause is an array, format it as a summary
      if (Array.isArray(analysis["possible_cause"])) {
        mappedAnalysis.summary = analysis["possible_cause"].join(". ");
      } else if (Array.isArray(analysis["possible cause"])) {
        mappedAnalysis.summary = analysis["possible cause"].join(". ");
      }

      setAnalysis(mappedAnalysis);
      toast({
        title: "Analysis Complete",
        description: "Bug has been analyzed and categorized",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to analyze bug",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "destructive";
      case "High":
        return "destructive";
      case "Medium":
        return "default";
      case "Low":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bug className="w-5 h-5 mr-2 text-primary" />
          Bug Report Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="flex flex-col h-[50vh]">
            <label className="text-sm font-medium mb-2 block">
              Bug Description
            </label>
            <Textarea
              placeholder="Describe the bug you encountered, including steps to reproduce, expected vs actual behavior, environment details..."
              value={bugDescription}
              onChange={(e) => setBugDescription(e.target.value)}
              className="min-h-24 mb-4 flex-1 resize-none"
            />

            <div className="flex gap-2">
              <Button
                onClick={analyzeBug}
                disabled={isAnalyzing}
                className="flex-1"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Bug...
                  </>
                ) : (
                  <>
                    <Bug className="w-4 h-4 mr-2" />
                    Analyze Bug
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Output Section */}
          <div className="flex flex-col h-[50vh]">
            {analysis ? (
              <div className="space-y-4 overflow-y-auto flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{analysis.category}</Badge>
                </div>

                <div className="bg-muted p-6 rounded-lg overflow-auto flex-1">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
                        📋 Type of Bug/Error
                      </h3>
                      <p className="text-base">{analysis.category}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
                        🔍 Possible Cause
                      </h3>
                      <p className="text-base leading-relaxed">
                        {analysis.summary}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-3 flex items-center">
                        🛠️ Steps to Fix
                      </h3>
                      <ol className="space-y-3">
                        {analysis.steps.map((step, index) => (
                          <li key={index} className="flex items-start">
                            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                              {index + 1}
                            </span>
                            <p className="text-base leading-relaxed">
                              {step
                                .replace(/^\s*\d+\.\s*/, "")
                                .replace(/\*\*(.*?)\*\*/g, "$1")}
                            </p>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-3 flex items-center">
                        💡 Suggestions
                      </h3>
                      <ul className="space-y-3">
                        {analysis.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary mr-3 mt-1.5 flex-shrink-0">
                              •
                            </span>
                            <p className="text-base leading-relaxed">
                              {suggestion.replace(/\*\*(.*?)\*\*/g, "$1")}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-8 border border-dashed border-border rounded-lg">
                <Bug className="w-8 h-8 mb-2 text-primary" />
                <span>Bug analysis will appear here.</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BugAnalyzer;
