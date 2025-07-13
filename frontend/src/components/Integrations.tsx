
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Link, 
  Github, 
  Settings, 
  Zap,
  FileText,
  MessageSquare,
  GitBranch,
  Webhook
} from 'lucide-react';

const integrations = [
  {
    id: 'jira',
    name: 'Jira',
    description: 'Sync test results and bug reports with Jira tickets',
    icon: FileText,
    status: 'available',
    features: ['Auto-create tickets', 'Status sync', 'Test execution tracking']
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Connect with GitHub Actions and pull requests',
    icon: Github,
    status: 'available',
    features: ['PR testing', 'Action triggers', 'Issue linking']
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get test notifications and reports in Slack channels',
    icon: MessageSquare,
    status: 'available',
    features: ['Test alerts', 'Daily reports', 'Team notifications']
  },
  {
    id: 'jenkins',
    name: 'Jenkins',
    description: 'Trigger tests from Jenkins pipelines',
    icon: GitBranch,
    status: 'coming-soon',
    features: ['Pipeline integration', 'Build triggers', 'Result reporting']
  },
  {
    id: 'webhook',
    name: 'Webhooks',
    description: 'Custom webhook integrations for any platform',
    icon: Webhook,
    status: 'available',
    features: ['Custom endpoints', 'Event triggers', 'Payload customization']
  }
];

export default function Integrations() {
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>([]);

  const handleConfigure = (id: string) => {
    setConnectedIntegrations(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Link className="w-5 h-5 mr-2 text-primary" />
          Platform Integrations
        </CardTitle>
        <CardDescription>
          Connect bugs.qa with your favorite development and project management tools
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            const isConnected = connectedIntegrations.includes(integration.id);
            const isAvailable = integration.status === 'available';
            
            return (
              <Card key={integration.id} className={`relative transition-all duration-200 ${
                isConnected ? 'ring-2 ring-primary/50 bg-primary/5' : ''
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isConnected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <Badge variant={isConnected ? 'default' : (isAvailable ? 'secondary' : 'secondary')} className="mt-1">
                        {isConnected ? 'Connected' : (isAvailable ? 'Available' : 'Coming Soon')}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3">
                    {integration.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <h5 className="text-sm font-medium">Key Features:</h5>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {integration.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-primary rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {isAvailable && (
                    <Button 
                      variant={isConnected ? "outline" : "default"} 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleConfigure(integration.id)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      {isConnected ? 'Reconfigure' : 'Configure'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-accent/50 p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-primary" />
            <h4 className="font-medium">Integration Benefits</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium mb-2">Automated Workflows</h5>
              <p className="text-muted-foreground">
                Streamline your QA process with automatic ticket creation, status updates, and team notifications.
              </p>
            </div>
            <div>
              <h5 className="font-medium mb-2">Centralized Reporting</h5>
              <p className="text-muted-foreground">
                Get unified dashboards and reports across all your connected platforms and tools.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-3">
            Need a custom integration? Let us know!
          </p>
          <Button variant="outline">
            Request Integration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
