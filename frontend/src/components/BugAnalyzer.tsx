
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Bug, Upload, Loader2, AlertTriangle, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface BugAnalysis {
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  category: string;
  summary: string;
  steps: string[];
  suggestions: string[];
}

const BugAnalyzer = () => {
  const [bugDescription, setBugDescription] = useState('');
  const [analysis, setAnalysis] = useState<BugAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeBug = async () => {
    if (!bugDescription.trim()) {
      toast({
        title: "Error",
        description: "Please describe the bug first",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockAnalysis: BugAnalysis = {
      severity: 'High',
      category: 'Authentication',
      summary: 'User authentication fails intermittently causing login issues',
      steps: [
        'Navigate to login page',
        'Enter valid credentials',
        'Click login button',
        'Observe intermittent failure',
        'Check browser console for errors'
      ],
      suggestions: [
        'Check server logs for authentication service errors',
        'Verify database connection stability',
        'Review session management implementation',
        'Test with different user accounts',
        'Monitor network requests during login attempts'
      ]
    };

    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
    
    toast({
      title: "Analysis Complete",
      description: "Bug has been analyzed and categorized",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'destructive';
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'default';
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
        <div>
          <label className="text-sm font-medium mb-2 block">Bug Description</label>
          <Textarea
            placeholder="Describe the bug you encountered, including steps to reproduce, expected vs actual behavior, environment details..."
            value={bugDescription}
            onChange={(e) => setBugDescription(e.target.value)}
            className="min-h-32"
          />
        </div>

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
          
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Upload Screenshot
          </Button>
        </div>

        {analysis && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={getSeverityColor(analysis.severity)}>
                {analysis.severity} Severity
              </Badge>
              <Badge variant="outline">{analysis.category}</Badge>
            </div>

            <Card className="p-4">
              <h3 className="font-semibold mb-2 flex items-center">
                <Info className="w-4 h-4 mr-2" />
                Summary
              </h3>
              <p className="text-sm text-muted-foreground">{analysis.summary}</p>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-2">Steps to Reproduce</h3>
              <ol className="list-decimal list-inside space-y-1">
                {analysis.steps.map((step, index) => (
                  <li key={index} className="text-sm text-muted-foreground">{step}</li>
                ))}
              </ol>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Investigation Suggestions
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-muted-foreground">{suggestion}</li>
                ))}
              </ul>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BugAnalyzer;
