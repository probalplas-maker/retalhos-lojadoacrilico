import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import ChapasTab from "@/components/ChapasTab";
import RetalhosTab from "@/components/RetalhosTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                AcrylStock
              </h1>
              <p className="text-sm text-muted-foreground">Gestão de Acrílico</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-card">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="chapas">Chapas</TabsTrigger>
            <TabsTrigger value="retalhos">Retalhos</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="chapas">
            <ChapasTab />
          </TabsContent>

          <TabsContent value="retalhos">
            <RetalhosTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
