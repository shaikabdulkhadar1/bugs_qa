import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Send,
  Copy,
  Loader2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  responseTime: number;
}

const ApiTester = () => {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState("");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [headersOpen, setHeadersOpen] = useState(false);
  const { toast } = useToast();

  const testApi = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    setResponse(null);

    let parsedHeaders = {};
    let parsedBody = undefined;
    try {
      parsedHeaders = headers ? JSON.parse(headers) : {};
    } catch (e) {
      toast({
        title: "Error",
        description: "Headers must be valid JSON",
        variant: "destructive",
      });
      setIsTesting(false);
      return;
    }
    if (method !== "GET" && body) {
      try {
        parsedBody = JSON.parse(body);
      } catch (e) {
        toast({
          title: "Error",
          description: "Body must be valid JSON",
          variant: "destructive",
        });
        setIsTesting(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/test-api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          url,
          headers: parsedHeaders,
          body: parsedBody,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to test API");
      }
      const data = await res.json();
      setResponse(data);
      toast({
        title: "Request Complete",
        description: `${data.status} ${data.statusText} (${data.responseTime}ms)`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to test API",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
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
    if (status >= 200 && status < 300) return "default";
    if (status >= 300 && status < 400) return "secondary";
    if (status >= 400 && status < 500) return "destructive";
    return "destructive";
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="flex flex-col h-[50vh]">
            <div className="flex gap-2 mb-4">
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

            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">
                Headers (JSON format)
              </label>
              <Textarea
                placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                className="min-h-20 resize-none"
              />
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">
                Request Body (JSON format)
              </label>
              <Textarea
                placeholder='{"name": "John Doe", "email": "john@example.com"}'
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-24 resize-none"
                disabled={method === "GET"}
              />
            </div>

            <Button
              onClick={testApi}
              disabled={isTesting}
              className="w-full mt-auto"
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
          </div>

          {/* Output Section */}
          <div className="flex flex-col h-[50vh]">
            {response ? (
              <div className="space-y-4 overflow-y-auto flex-1">
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
                  <div
                    className="flex items-center justify-between cursor-pointer select-none"
                    onClick={() => setHeadersOpen((v) => !v)}
                  >
                    <h3 className="font-semibold mb-2 flex items-center">
                      Response Headers
                    </h3>
                    {headersOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                  {headersOpen && (
                    <div className="space-y-1 mt-2">
                      {Object.entries(response.headers).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="font-medium">{key}:</span> {value}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Response Body</h3>
                  <pre className="text-sm bg-muted p-3 rounded min-h-[200px] max-h-[400px] overflow-y-auto whitespace-pre-wrap break-words">
                    {(() => {
                      try {
                        return JSON.stringify(
                          JSON.parse(response.body),
                          null,
                          2
                        );
                      } catch {
                        return response.body;
                      }
                    })()}
                  </pre>
                </Card>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-8 border border-dashed border-border rounded-lg">
                <Zap className="w-8 h-8 mb-2 text-primary" />
                <span>API response will appear here.</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiTester;
