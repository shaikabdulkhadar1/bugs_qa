
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const TestCaseGenerator = () => {
  const [userStory, setUserStory] = useState('');
  const [testCases, setTestCases] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateTestCases = async () => {
    if (!userStory.trim()) {
      toast({
        title: "Error",
        description: "Please enter a user story first",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockTestCases = [
      `Given a user is on the login page, when they enter valid credentials, then they should be redirected to the dashboard`,
      `Given a user is on the login page, when they enter invalid credentials, then they should see an error message`,
      `Given a user is on the login page, when they leave the email field empty, then they should see a validation error`,
      `Given a user is on the login page, when they leave the password field empty, then they should see a validation error`,
      `Given a user has entered credentials, when they click the "Remember Me" checkbox, then their credentials should be saved for future sessions`,
      `Given a user is logged in, when they click the logout button, then they should be redirected to the login page`
    ];

    setTestCases(mockTestCases);
    setIsGenerating(false);
    
    toast({
      title: "Success",
      description: `Generated ${mockTestCases.length} test cases`,
    });
  };

  const copyTestCases = () => {
    const text = testCases.join('\n\n');
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Test cases copied to clipboard",
    });
  };

  const downloadTestCases = () => {
    const text = testCases.join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test-cases.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Test cases downloaded as text file",
    });
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
        <div>
          <label className="text-sm font-medium mb-2 block">User Story / Feature Description</label>
          <Textarea
            placeholder="As a user, I want to be able to login to the application so that I can access my dashboard..."
            value={userStory}
            onChange={(e) => setUserStory(e.target.value)}
            className="min-h-24"
          />
        </div>

        <Button 
          onClick={generateTestCases} 
          disabled={isGenerating}
          className="w-full"
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

        {testCases.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">{testCases.length} Test Cases Generated</Badge>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyTestCases}>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadTestCases}>
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {testCases.map((testCase, index) => (
                <Card key={index} className="p-3">
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className="mb-2">TC{index + 1}</Badge>
                  </div>
                  <p className="text-sm">{testCase}</p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestCaseGenerator;
