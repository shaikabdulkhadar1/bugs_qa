import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PencilLine, Copy, Download, Settings, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
// If you have a markdown renderer, import it here. Example:
// import ReactMarkdown from 'react-markdown';

// Utility to strip markdown formatting
function stripMarkdown(md: string): string {
  return md
    .replace(/^#\s+/gm, "") // Remove headings
    .replace(/^##\s+/gm, "")
    .replace(/^\*\s+/gm, "- ") // Convert bullet points
    .replace(/^[-*+]\s+/gm, "- ")
    .replace(/`{1,3}([^`]+)`{1,3}/g, "$1") // Inline code
    .replace(/\*\*([^*]+)\*\*/g, "$1") // Bold
    .replace(/\*([^*]+)\*/g, "$1") // Italic
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Links
    .replace(/\!\[(.*?)\]\(.*?\)/g, "") // Images
    .replace(/\n{2,}/g, "\n\n") // Normalize newlines
    .replace(/^>\s+/gm, "") // Blockquotes
    .replace(/^-{3,}$/gm, "") // Horizontal rules
    .replace(/\r/g, "") // Remove carriage returns
    .trim();
}

// Utility to parse markdown bug report into sections
function parseBugReport(md: string) {
  const sections = {
    title: "",
    severity: "",
    description: "",
    steps: [] as string[],
    expected: "",
    actual: "",
    environment: "",
    suggestions: [] as string[],
  };
  let current = "";
  md.split(/\r?\n/).forEach((line) => {
    if (/^#\s*Title[:：]?/i.test(line)) {
      current = "title";
      sections.title = line.replace(/^#\s*Title[:：]?/i, "").trim();
    } else if (/^##?\s*Severity[:：]?/i.test(line)) {
      current = "severity";
      sections.severity = line.replace(/^##?\s*Severity[:：]?/i, "").trim();
    } else if (/^##?\s*Description[:：]?/i.test(line)) {
      current = "description";
      sections.description = "";
    } else if (/^##?\s*Steps to Reproduce[:：]?/i.test(line)) {
      current = "steps";
      sections.steps = [];
    } else if (/^##?\s*Expected Behavior[:：]?/i.test(line)) {
      current = "expected";
      sections.expected = "";
    } else if (/^##?\s*Actual Behavior[:：]?/i.test(line)) {
      current = "actual";
      sections.actual = "";
    } else if (/^##?\s*Environment[:：]?/i.test(line)) {
      current = "environment";
      sections.environment = "";
    } else if (/^##?\s*Suggestions[:：]?/i.test(line)) {
      current = "suggestions";
      sections.suggestions = [];
    } else if (/^[-*]\s+/.test(line) && current === "steps") {
      sections.steps.push(line.replace(/^[-*]\s+/, "").trim());
    } else if (/^[-*]\s+/.test(line) && current === "suggestions") {
      sections.suggestions.push(line.replace(/^[-*]\s+/, "").trim());
    } else if (current === "description" && line.trim()) {
      sections.description += (sections.description ? "\n" : "") + line.trim();
    } else if (current === "expected" && line.trim()) {
      sections.expected += (sections.expected ? "\n" : "") + line.trim();
    } else if (current === "actual" && line.trim()) {
      sections.actual += (sections.actual ? "\n" : "") + line.trim();
    } else if (current === "environment" && line.trim()) {
      sections.environment += (sections.environment ? "\n" : "") + line.trim();
    }
  });
  return sections;
}

export default function BugReportWriter() {
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("");
  const [bugReport, setBugReport] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const MAX_LENGTH = 2000;

  const generateReport = async () => {
    if (!description || !severity) return;
    setIsLoading(true);
    setBugReport("");
    try {
      const res = await fetch("/api/generate-bug-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, severity }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate bug report");
      }
      const data = await res.json();
      setBugReport(data.bugReport || "No bug report generated.");
      toast({
        title: "Bug Report Generated",
        description: "AI-powered bug report is ready!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to generate bug report",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (e.target.value.length <= MAX_LENGTH) {
      setDescription(e.target.value);
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
          <PencilLine className="w-5 h-5 mr-2 text-primary" />
          Bug Report Writer
        </CardTitle>
        <CardDescription>
          Write and format detailed bug reports with AI assistance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Bug Description
              </label>
              <Textarea
                placeholder={"Describe the bug in detail..."}
                value={description}
                onChange={handleDescriptionChange}
                className="min-h-32"
                disabled={isLoading}
                maxLength={MAX_LENGTH}
              />
              <div
                className={`text-xs text-right mt-1 ${
                  description.length >= MAX_LENGTH
                    ? "text-red-500"
                    : "text-muted-foreground"
                }`}
              >
                {description.length}/{MAX_LENGTH} characters
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Severity</label>
              <Select
                value={severity}
                onValueChange={setSeverity}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={generateReport}
              className="w-full"
              disabled={
                !description ||
                !severity ||
                isLoading ||
                description.length > MAX_LENGTH
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Settings className="w-4 h-4 mr-2" />
                  Generate Bug Report
                </>
              )}
            </Button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Generated Bug Report
              </label>
              {bugReport && (
                <div className="flex gap-2">
                  <Badge variant="secondary">{severity}</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(bugReport);
                      toast({
                        title: "Copied",
                        description: "Bug report copied to clipboard",
                      });
                    }}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const blob = new Blob([bugReport], {
                        type: "text/markdown",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "bug-report.md";
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              )}
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin mr-2" />
                Generating bug report...
              </div>
            ) : bugReport ? (
              (() => {
                const parsed = parseBugReport(bugReport);
                return (
                  <div
                    className="bg-muted p-6 rounded-lg overflow-auto flex-1 space-y-6"
                    style={{
                      height: "50vh",
                      minHeight: "50vh",
                      maxHeight: "50vh",
                    }}
                  >
                    {parsed.title && (
                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
                          📝 Title
                        </h3>
                        <p className="text-base">{parsed.title}</p>
                      </div>
                    )}
                    {parsed.severity && (
                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
                          🚦 Severity
                        </h3>
                        <Badge variant="outline">{parsed.severity}</Badge>
                      </div>
                    )}
                    {parsed.description && (
                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
                          📄 Description
                        </h3>
                        <p className="text-base whitespace-pre-line">
                          {parsed.description}
                        </p>
                      </div>
                    )}
                    {parsed.steps.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-3 flex items-center">
                          🛠️ Steps to Reproduce
                        </h3>
                        <ol className="space-y-3">
                          {parsed.steps.map((step, index) => (
                            <li key={index} className="flex items-start">
                              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                                {index + 1}
                              </span>
                              <p className="text-base leading-relaxed">
                                {step.replace(/\*\*(.*?)\*\*/g, "$1")}
                              </p>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                    {parsed.expected && (
                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
                          ✅ Expected Behavior
                        </h3>
                        <p className="text-base whitespace-pre-line">
                          {parsed.expected}
                        </p>
                      </div>
                    )}
                    {parsed.actual && (
                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
                          ❌ Actual Behavior
                        </h3>
                        <p className="text-base whitespace-pre-line">
                          {parsed.actual}
                        </p>
                      </div>
                    )}
                    {parsed.environment && (
                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
                          🖥️ Environment
                        </h3>
                        <p className="text-base whitespace-pre-line">
                          {parsed.environment}
                        </p>
                      </div>
                    )}
                    {parsed.suggestions.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-3 flex items-center">
                          💡 Suggestions
                        </h3>
                        <ul className="space-y-3">
                          {parsed.suggestions.map((suggestion, index) => (
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
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="bg-muted/30 p-8 rounded-lg text-center">
                <PencilLine className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Describe the bug and select severity to generate a formatted
                  report
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="bg-accent/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Tips for Effective Bug Reports:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Include steps to reproduce</li>
            <li>• Mention expected vs actual behavior</li>
            <li>• Attach screenshots or logs if possible</li>
            <li>• Specify environment details (browser, OS, etc.)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
