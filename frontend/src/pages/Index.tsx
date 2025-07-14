import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bug,
  Zap,
  Eye,
  Code,
  FileText,
  Link,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Bot,
  BookOpen,
  PencilLine,
} from "lucide-react";
import Hero3D from "@/components/Hero3D";
import TestCaseGenerator from "@/components/TestCaseGenerator";
import BugAnalyzer from "@/components/BugAnalyzer";
import ApiTester from "@/components/ApiTester";
import VisualTester from "@/components/VisualTester";
import AutomationScripts from "@/components/AutomationScripts";
import Integrations from "@/components/Integrations";
import { ThemeToggle } from "@/components/ThemeToggle";
import ReleaseNotesGenerator from "@/components/ReleaseNotesGenerator";
import BugReportWriter from "@/components/BugReportWriter";

const Index = () => {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("test-generator");
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const tabs = [
    { id: "test-generator", label: "Test Cases", icon: FileText },
    { id: "bug-analyzer", label: "Bug Analysis", icon: Bug },
    { id: "visual-testing", label: "Visual Testing", icon: Eye },
    { id: "api-testing", label: "API Testing", icon: Zap },
    { id: "automation-scripts", label: "Automation", icon: Code },
    { id: "release-notes", label: "Release Notes", icon: BookOpen },
    { id: "bug-report", label: "Bug Report", icon: PencilLine },
    { id: "integrations", label: "Integrations", icon: Link },
  ];

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background overflow-hidden"
    >
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section with 3D Elements */}
      <motion.section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Hero3D />
        </div>

        <motion.div
          style={{ y, opacity }}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Badge
              variant="secondary"
              className="mb-4 bg-primary/20 text-primary border-primary/30"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered QA Platform
            </Badge>

            <h1 className="text-6xl md:text-8xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              bugs.qa
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Automated QA Tools Hub with AI
            </p>

            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Streamline your quality assurance workflows with intelligent test
              automation, bug analysis, and seamless integrations - all in your
              browser.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
            >
              Start Testing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 opacity-30"
        >
          <CheckCircle className="w-8 h-8 text-primary" />
        </motion.div>

        <motion.div
          animate={{ y: [20, -20, 20] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 opacity-30"
        >
          <Bot className="w-10 h-10 text-primary" />
        </motion.div>
      </motion.section>

      {/* Interactive Tools Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              All QA Tools in One Place
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              No registration required. Access all our AI-powered QA tools
              directly in your browser
            </p>
          </motion.div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="relative mb-8">
              <TabsList className="grid w-full grid-cols-8 bg-muted/50 p-1 rounded-lg relative overflow-hidden">
                {/* Animated background indicator */}
                <motion.div
                  className="absolute inset-y-1 bg-background rounded-md"
                  initial={false}
                  animate={{
                    x: `${
                      tabs.findIndex((tab) => tab.id === activeTab) *
                      (100 / tabs.length)
                    }%`,
                    width: `${100 / tabs.length}%`,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />

                {tabs.map((tab, index) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className={`flex items-center gap-2 relative z-10 transition-all duration-200 ${
                        activeTab === tab.id ? "shadow-sm" : ""
                      }`}
                      asChild
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </motion.button>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="test-generator">
                <TestCaseGenerator />
              </TabsContent>

              <TabsContent value="bug-analyzer">
                <BugAnalyzer />
              </TabsContent>

              <TabsContent value="visual-testing">
                <VisualTester />
              </TabsContent>

              <TabsContent value="api-testing">
                <ApiTester />
              </TabsContent>

              <TabsContent value="automation-scripts">
                <AutomationScripts />
              </TabsContent>

              <TabsContent value="release-notes">
                <ReleaseNotesGenerator />
              </TabsContent>
              <TabsContent value="bug-report">
                <BugReportWriter />
              </TabsContent>

              <TabsContent value="integrations">
                <Integrations />
              </TabsContent>
            </motion.div>
          </Tabs>
        </div>
      </section>
      <footer className="w-full py-6 bg-background/80 border-t border-border text-center text-muted-foreground text-sm mt-8">
        © {new Date().getFullYear()} bugs.qa &mdash; All rights reserved. |
        Developed by
        <a
          href="https://www.linkedin.com/in/shaikabdulkhadar1/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline ml-1 hover:text-primary/80"
        >
          Abdul Khadar Shaik
        </a>
      </footer>
    </div>
  );
};

export default Index;
