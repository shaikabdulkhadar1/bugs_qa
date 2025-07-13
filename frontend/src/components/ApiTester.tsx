
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Zap, Send, Copy, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  responseTime: number;
}

const ApiTester = () => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState('');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  const testApi = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockResponse: ApiResponse = {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/json',
        'X-Response-Time': '45ms',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        data: {
          id: 1,
          name: "Test User",
          email: "test@example.com",
          created_at: "2024-01-15T10:30:00Z"
        },
        message: "Request successful"
      }, null, 2),
      responseTime: 245
    };

    setResponse(mockResponse);
    setIsTesting(false);
    
    toast({
      title: "Request Complete",
      description: `${mockResponse.status} ${mockResponse.statusText} (${mockResponse.responseTime}ms)`,
    });
  };

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(response.body);
      toast({
        title: "Copied",
        description: "Response copied to clipboard",
      });
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'default';
    if (status >= 300 && status < 400) return 'secondary';
    if (status >= 400 && status < 500) return 'destructive';
    return 'destructive';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="w-5 h-5 mr-2 text-primary" />
          API Testing Suite
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="PATCH">PATCH</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            placeholder="https://api.example.com/users"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Headers (JSON format)</label>
          <Textarea
            placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            className="min-h-20"
          />
        </div>

        {method !== 'GET' && (
          <div>
            <label className="text-sm font-medium mb-2 block">Request Body</label>
            <Textarea
              placeholder='{"name": "John Doe", "email": "john@example.com"}'
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-24"
            />
          </div>
        )}

        <Button 
          onClick={testApi} 
          disabled={isTesting}
          className="w-full"
        >
          {isTesting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending Request...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Request
            </>
          )}
        </Button>

        {response && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor(response.status)}>
                  {response.status} {response.statusText}
                </Badge>
                <Badge variant="outline">{response.responseTime}ms</Badge>
              </div>
              <Button variant="outline" size="sm" onClick={copyResponse}>
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
            </div>

            <Card className="p-4">
              <h3 className="font-semibold mb-2">Response Headers</h3>
              <div className="space-y-1">
                {Object.entries(response.headers).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="font-medium">{key}:</span> {value}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-2">Response Body</h3>
              <pre className="text-sm bg-muted p-3 rounded overflow-x-auto">
                {response.body}
              </pre>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiTester;
