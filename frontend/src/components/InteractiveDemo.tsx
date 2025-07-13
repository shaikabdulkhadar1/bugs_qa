
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Code, 
  Bug, 
  Eye,
  FileText,
  Zap
} from 'lucide-react';

const InteractiveDemo = () => {
  const [activeDemo, setActiveDemo] = useState<string>('test-generator');
  const [isPlaying, setIsPlaying] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0);
  const [userInput, setUserInput] = useState('User can login with email and password');
  
  const demos = [
    {
      id: 'test-generator',
      title: 'Test Case Generator',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      description: 'Generate comprehensive test cases from user stories'
    },
    {
      id: 'bug-analyzer',
      title: 'Bug Analyzer',
      icon: Bug,
      color: 'from-red-500 to-pink-500',
      description: 'Analyze and categorize bug reports automatically'
    },
    {
      id: 'visual-testing',
      title: 'Visual Testing',
      icon: Eye,
      color: 'from-purple-500 to-indigo-500',
      description: 'Compare UI screenshots for visual regressions'
    },
    {
      id: 'api-testing',
      title: 'API Testing',
      icon: Zap,
      color: 'from-green-500 to-emerald-500',
      description: 'Smart API testing with edge case suggestions'
    }
  ];

  const mockResults = {
    'test-generator': [
      'Verify login form accepts valid email format',
      'Test password field masking functionality',
      'Validate login with correct credentials',
      'Check error message for invalid credentials',
      'Verify remember me checkbox functionality',
      'Test forgot password link navigation'
    ],
    'bug-analyzer': [
      { severity: 'High', category: 'Authentication', issue: 'Login timeout after 30 seconds' },
      { severity: 'Medium', category: 'UI/UX', issue: 'Button alignment on mobile devices' },
      { severity: 'Low', category: 'Performance', issue: 'Page load time exceeds 3 seconds' }
    ],
    'visual-testing': [
      { component: 'Header', status: 'Pass', diff: '0%' },
      { component: 'Login Form', status: 'Fail', diff: '12%' },
      { component: 'Footer', status: 'Pass', diff: '2%' }
    ],
    'api-testing': [
      { endpoint: 'POST /api/login', status: 'Pass', response: '200 OK' },
      { endpoint: 'GET /api/user', status: 'Fail', response: '401 Unauthorized' },
      { endpoint: 'PUT /api/profile', status: 'Pass', response: '200 OK' }
    ]
  };

  const startDemo = () => {
    setIsPlaying(true);
    setDemoProgress(0);
    
    const interval = setInterval(() => {
      setDemoProgress(prev => {
        if (prev >= 100) {
          setIsPlaying(false);
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setDemoProgress(0);
  };

  const renderDemoResults = () => {
    const results = mockResults[activeDemo as keyof typeof mockResults];
    
    if (activeDemo === 'test-generator') {
      return (
        <div className="space-y-2">
          {(results as string[]).map((testCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: demoProgress > index * 15 ? 1 : 0.3, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
              <span className="text-sm text-gray-300">{testCase}</span>
            </motion.div>
          ))}
        </div>
      );
    }

    if (activeDemo === 'bug-analyzer') {
      return (
        <div className="space-y-2">
          {(results as any[]).map((bug, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: demoProgress > index * 25 ? 1 : 0.3, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700"
            >
              <div className="flex items-center">
                <Badge 
                  variant={bug.severity === 'High' ? 'destructive' : bug.severity === 'Medium' ? 'default' : 'secondary'}
                  className="mr-3"
                >
                  {bug.severity}
                </Badge>
                <span className="text-sm text-gray-300">{bug.issue}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {bug.category}
              </Badge>
            </motion.div>
          ))}
        </div>
      );
    }

    // Similar patterns for other demo types...
    return (
      <div className="space-y-2">
        {(results as any[]).map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: demoProgress > index * 20 ? 1 : 0.3, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700"
          >
            <span className="text-sm text-gray-300">
              {item.endpoint || item.component || 'Result'}
            </span>
            <Badge 
              variant={item.status === 'Pass' ? 'default' : 'destructive'}
              className="text-xs"
            >
              {item.status || item.response || item.diff}
            </Badge>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-white mb-4">Interactive Demo</CardTitle>
        
        {/* Demo selector */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
          {demos.map((demo) => {
            const Icon = demo.icon;
            return (
              <motion.button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id)}
                className={`p-3 rounded-lg border transition-all duration-300 ${
                  activeDemo === demo.id
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-slate-600 bg-slate-800/30 hover:bg-slate-700/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-5 h-5 text-white mx-auto mb-2" />
                <span className="text-xs text-gray-300 block">{demo.title}</span>
              </motion.button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Input</h3>
            <Textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Describe your feature, bug, or test scenario..."
              className="min-h-32 bg-slate-800/50 border-slate-600 text-gray-300 resize-none"
            />
            
            <div className="flex items-center gap-3 mt-4">
              <Button
                onClick={startDemo}
                disabled={isPlaying}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isPlaying ? 'Processing...' : 'Run Analysis'}
              </Button>
              
              <Button
                onClick={resetDemo}
                variant="outline"
                className="border-slate-600 text-gray-300 hover:bg-slate-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            {/* Progress bar */}
            {isPlaying && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                  <span>Processing...</span>
                  <span>{demoProgress}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    animate={{ width: `${demoProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Results section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              AI Results
              <Sparkles className="w-4 h-4 ml-2 text-purple-400" />
            </h3>
            
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 min-h-80">
              <AnimatePresence mode="wait">
                {demoProgress > 0 ? (
                  <motion.div
                    key={activeDemo}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderDemoResults()}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center h-full text-gray-500"
                  >
                    <div className="text-center">
                      <Code className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Click "Run Analysis" to see AI-generated results</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveDemo;
