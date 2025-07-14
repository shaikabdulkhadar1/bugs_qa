import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Code, Copy, Download, Play, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AutomationScripts() {
  const [framework, setFramework] = useState("");
  const [testScenario, setTestScenario] = useState("");
  const [generatedScript, setGeneratedScript] = useState("");
  const MAX_LENGTH = 2000;
  const { toast } = useToast();

  const generateScript = () => {
    const sampleScript = `// ${framework} Test Script
describe('Sample Test', () => {
  it('should perform automated testing', async () => {
    // Generated based on your scenario
    await page.goto('https://example.com');
    await page.click('button[data-testid="submit"]');
    await expect(page).toHaveTitle('Success');
  });
});`;
    setGeneratedScript(sampleScript);
  };

  const handleScenarioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_LENGTH) {
      setTestScenario(e.target.value);
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
          <Code className="w-5 h-5 mr-2 text-primary" />
          Automation Script Generator
        </CardTitle>
        <CardDescription>
          Generate Selenium, Playwright, and Cypress scripts from your test
          scenarios
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Framework
              </label>
              <Select value={framework} onValueChange={setFramework}>
                <SelectTrigger>
                  <SelectValue placeholder="Select automation framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="playwright">Playwright</SelectItem>
                  <SelectItem value="selenium">Selenium WebDriver</SelectItem>
                  <SelectItem value="cypress">Cypress</SelectItem>
                  <SelectItem value="puppeteer">Puppeteer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Test Scenario
              </label>
              <Textarea
                placeholder="Describe your test scenario in plain English...\nExample: Login to the application, navigate to dashboard, click on profile settings, update email address, and verify the change"
                value={testScenario}
                onChange={handleScenarioChange}
                className="min-h-32"
                maxLength={MAX_LENGTH}
              />
              <div
                className={`text-xs text-right mt-1 ${
                  testScenario.length >= MAX_LENGTH
                    ? "text-red-500"
                    : "text-muted-foreground"
                }`}
              >
                {testScenario.length}/{MAX_LENGTH} characters
              </div>
            </div>

            <Button
              onClick={generateScript}
              className="w-full"
              disabled={
                !framework || !testScenario || testScenario.length > MAX_LENGTH
              }
            >
              <Settings className="w-4 h-4 mr-2" />
              Generate Script
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Generated Script</label>
              {generatedScript && (
                <div className="flex gap-2">
                  <Badge variant="secondary">{framework}</Badge>
                  <Button variant="outline" size="sm">
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              )}
            </div>

            {generatedScript ? (
              <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-auto max-h-64">
                <pre>{generatedScript}</pre>
              </div>
            ) : (
              <div className="bg-muted/30 p-8 rounded-lg text-center">
                <Code className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Select a framework and describe your test scenario to generate
                  automation scripts
                </p>
              </div>
            )}

            {generatedScript && (
              <Button variant="outline" className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Run Script (Demo)
              </Button>
            )}
          </div>
        </div>

        <div className="bg-accent/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Supported Features:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Cross-browser testing scripts</li>
            <li>• Page Object Model patterns</li>
            <li>• Data-driven test scenarios</li>
            <li>• Custom assertions and validations</li>
            <li>• Parallel execution setup</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
