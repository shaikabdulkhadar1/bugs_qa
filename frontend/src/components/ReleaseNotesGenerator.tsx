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
import { BookOpen, Copy, Download, Settings, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Utility to parse markdown release notes into sections
function parseReleaseNotes(md: string) {
  const sections: Record<string, string[]> = {};
  let current = "";
  md.split(/\r?\n/).forEach((line) => {
    const heading = line.match(/^#+\s*(.+)/);
    if (heading) {
      current = heading[1].trim();
      if (!sections[current]) sections[current] = [];
    } else if (current && line.trim()) {
      sections[current].push(line.replace(/^[-*]\s+/, "").trim());
    }
  });
  // Remove any items that are just '---' or only dashes
  Object.keys(sections).forEach((section) => {
    sections[section] = sections[section].filter(
      (item) => !/^[-\s]{3,}$/.test(item)
    );
  });
  return sections;
}

export default function ReleaseNotesGenerator() {
  const [input, setInput] = useState("");
  const [releaseNotes, setReleaseNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const MAX_LENGTH = 2000;

  const generateNotes = async () => {
    if (!input) return;
    setIsLoading(true);
    setReleaseNotes("");
    try {
      const res = await fetch("/api/generate-release-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate release notes");
      }
      const data = await res.json();
      setReleaseNotes(data.releaseNotes || "No release notes generated.");
      toast({
        title: "Release Notes Generated",
        description: "AI-powered release notes are ready!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to generate release notes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_LENGTH) {
      setInput(e.target.value);
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
          <BookOpen className="w-5 h-5 mr-2 text-primary" />
          Release Notes Generator
        </CardTitle>
        <CardDescription>
          Generate professional release notes from your commit messages or
          changelogs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Commits / Changelog
              </label>
              <Textarea
                placeholder={"Paste your commit messages or changelog here..."}
                value={input}
                onChange={handleInputChange}
                className="min-h-32"
                disabled={isLoading}
                maxLength={MAX_LENGTH}
              />
              <div
                className={`text-xs text-right mt-1 ${
                  input.length >= MAX_LENGTH
                    ? "text-red-500"
                    : "text-muted-foreground"
                }`}
              >
                {input.length}/{MAX_LENGTH} characters
              </div>
            </div>
            <Button
              onClick={generateNotes}
              className="w-full"
              disabled={!input || isLoading || input.length > MAX_LENGTH}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Settings className="w-4 h-4 mr-2" />
                  Generate Release Notes
                </>
              )}
            </Button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Generated Release Notes
              </label>
              {releaseNotes && (
                <div className="flex gap-2">
                  <Badge variant="secondary">Release</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(releaseNotes);
                      toast({
                        title: "Copied",
                        description: "Release notes copied to clipboard",
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
                      const blob = new Blob([releaseNotes], {
                        type: "text/markdown",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "release-notes.md";
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
                Generating release notes...
              </div>
            ) : releaseNotes ? (
              (() => {
                const sections = parseReleaseNotes(releaseNotes);
                return (
                  <div
                    className="bg-muted p-6 rounded-lg overflow-auto flex-1 space-y-6"
                    style={{
                      height: "50vh",
                      minHeight: "50vh",
                      maxHeight: "50vh",
                    }}
                  >
                    {Object.entries(sections).map(([section, items]) => (
                      <div key={section}>
                        <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
                          {section}
                        </h3>
                        <ul className="space-y-2">
                          {items.map((item, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-primary mr-3 mt-1.5 flex-shrink-0">
                                •
                              </span>
                              <p className="text-base leading-relaxed">
                                {item.replace(/\*\*(.*?)\*\*/g, "$1")}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                );
              })()
            ) : (
              <div className="bg-muted/30 p-8 rounded-lg text-center">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Paste your commits or changelog and generate release notes
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="bg-accent/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Tips for Best Results:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Use clear, descriptive commit messages</li>
            <li>• Group related changes together</li>
            <li>• Include ticket/issue references if possible</li>
            <li>• Separate features, fixes, and chores</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
