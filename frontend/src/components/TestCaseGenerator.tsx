import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Download,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TestCase {
  id: string;
  title: string;
  description: string;
  preconditions?: string[];
  steps: string[];
  expected_result: string;
  priority: string;
  category: string;
  test_data?: any;
}

const TestCaseGenerator = () => {
  const [userStory, setUserStory] = useState("");
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedCases, setExpandedCases] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const MAX_LENGTH = 2000;

  const generateTestCases = async () => {
    if (!userStory.trim()) {
      toast({
        title: "Error",
        description: "Please enter a user story first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setTestCases([]);
    setExpandedCases(new Set());

    try {
      const response = await fetch("/api/generate-test-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: userStory }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate test cases");
      }

      const data = await response.json();
      let cases = data.testCases;

      // Handle markdown-wrapped JSON response from Gemini
      if (typeof cases === "string") {
        // Remove markdown code blocks if present
        if (cases.includes("```json")) {
          cases = cases.replace(/```json\n?/g, "").replace(/```\n?/g, "");
        }

        try {
          // Try to parse as JSON first
          const parsedCases = JSON.parse(cases);
          if (Array.isArray(parsedCases)) {
            cases = parsedCases;
          } else {
            cases = [parsedCases];
          }
        } catch (e) {
          // If JSON parsing fails, create a simple test case
          cases = [
            {
              id: "TC-001",
              title: "Generated Test Case",
              description: cases,
              steps: [cases],
              expected_result: "Test should pass",
              priority: "Medium",
              category: "Functional",
            },
          ];
        }
      }

      setTestCases(cases);
      toast({
        title: "Success",
        description: `Generated ${cases.length} test cases`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to generate test cases",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyTestCases = () => {
    const text = testCases
      .map(
        (tc) =>
          `${tc.title}\n${tc.description}\n\nSteps:\n${tc.steps
            .map((step, i) => `${i + 1}. ${step}`)
            .join("\n")}\n\nExpected Result: ${tc.expected_result}`
      )
      .join("\n\n---\n\n");
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Test cases copied to clipboard",
    });
  };

  const downloadTestCases = () => {
    const text = testCases
      .map(
        (tc) =>
          `${tc.title}\n${tc.description}\n\nSteps:\n${tc.steps
            .map((step, i) => `${i + 1}. ${step}`)
            .join("\n")}\n\nExpected Result: ${tc.expected_result}`
      )
      .join("\n\n---\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "test-cases.txt";
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Test cases downloaded as text file",
    });
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedCases);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCases(newExpanded);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "positive":
        return "default";
      case "negative":
        return "destructive";
      case "security":
        return "destructive";
      case "ui/ux":
        return "secondary";
      case "edge":
        return "outline";
      default:
        return "outline";
    }
  };

  const handleUserStoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_LENGTH) {
      setUserStory(e.target.value);
    } else {
      toast({
        title: "Character Limit Reached",
        description: `Maximum ${MAX_LENGTH} characters allowed.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-primary" />
          Test Case Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="flex flex-col h-[50vh]">
            <label className="text-sm font-medium mb-2 block">
              User Story / Feature Description
            </label>
            <Textarea
              placeholder="Describe your test scenario in plain English...\nExample: Login to the application, navigate to dashboard, click on profile settings, update email address, and verify the change"
              value={userStory}
              onChange={handleUserStoryChange}
              className="min-h-32"
              maxLength={MAX_LENGTH}
            />
            <div
              className={`text-xs text-right mt-1 ${
                userStory.length >= MAX_LENGTH
                  ? "text-red-500"
                  : "text-muted-foreground"
              }`}
            >
              {userStory.length}/{MAX_LENGTH} characters
            </div>
            <Button
              onClick={generateTestCases}
              disabled={
                isGenerating || !userStory || userStory.length > MAX_LENGTH
              }
              className="w-full mt-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Test Cases...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Test Cases
                </>
              )}
            </Button>
          </div>

          {/* Output Section */}
          <div className="flex flex-col h-[50vh]">
            {testCases.length > 0 ? (
              <div className="space-y-4 overflow-y-auto flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    {testCases.length} Test Cases Generated
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyTestCases}>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadTestCases}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 overflow-y-auto flex-1">
                  {testCases.map((testCase, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {testCase.id || `TC${index + 1}`}
                          </Badge>
                          <Badge variant={getPriorityColor(testCase.priority)}>
                            {testCase.priority}
                          </Badge>
                          <Badge variant={getCategoryColor(testCase.category)}>
                            {testCase.category}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            toggleExpanded(testCase.id || `TC${index + 1}`)
                          }
                        >
                          {expandedCases.has(
                            testCase.id || `TC${index + 1}`
                          ) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Button>
                      </div>

                      <div className="mb-2">
                        <h4 className="font-semibold text-sm">
                          {testCase.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {testCase.description}
                        </p>
                      </div>

                      {expandedCases.has(testCase.id || `TC${index + 1}`) && (
                        <div className="space-y-3 mt-3 pt-3 border-t">
                          {testCase.preconditions &&
                            testCase.preconditions.length > 0 && (
                              <div>
                                <h5 className="font-medium text-sm mb-1">
                                  Preconditions:
                                </h5>
                                <ul className="text-sm space-y-1">
                                  {testCase.preconditions.map(
                                    (precondition, i) => (
                                      <li key={i} className="flex items-start">
                                        <span className="text-muted-foreground mr-2">
                                          •
                                        </span>
                                        {precondition}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}

                          <div>
                            <h5 className="font-medium text-sm mb-1">Steps:</h5>
                            <ol className="text-sm space-y-1">
                              {testCase.steps.map((step, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-muted-foreground mr-2 min-w-[20px]">
                                    {i + 1}.
                                  </span>
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>

                          <div>
                            <h5 className="font-medium text-sm mb-1">
                              Expected Result:
                            </h5>
                            <p className="text-sm">
                              {testCase.expected_result}
                            </p>
                          </div>

                          {testCase.test_data &&
                            Object.keys(testCase.test_data).length > 0 && (
                              <div>
                                <h5 className="font-medium text-sm mb-1">
                                  Test Data:
                                </h5>
                                <div className="bg-muted p-2 rounded text-xs font-mono">
                                  <pre>
                                    {JSON.stringify(
                                      testCase.test_data,
                                      null,
                                      2
                                    )}
                                  </pre>
                                </div>
                              </div>
                            )}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-8 border border-dashed border-border rounded-lg">
                <Sparkles className="w-8 h-8 mb-2 text-primary" />
                <span>Generated test cases will appear here.</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestCaseGenerator;
