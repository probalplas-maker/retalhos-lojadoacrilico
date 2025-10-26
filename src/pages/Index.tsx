import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Scissors } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import ChapasTab from "@/components/ChapasTab";
import RetalhosTab from "@/components/RetalhosTab";
import SobrasTab from "@/components/SobrasTab";
import CorteDialog from "@/components/CorteDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [corteDialogOpen, setCorteDialogOpen] = useState(false);

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
            <Button
              onClick={() => setCorteDialogOpen(true)}
              className="gap-2"
            >
              <Scissors className="h-4 w-4" />
              Registar Cortes
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-card">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="chapas">Chapas</TabsTrigger>
            <TabsTrigger value="retalhos">Retalhos</TabsTrigger>
            <TabsTrigger value="sobras">Sobras</TabsTrigger>
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

          <TabsContent value="sobras">
            <SobrasTab />
          </TabsContent>
        </Tabs>
      </main>

      <CorteDialog open={corteDialogOpen} onOpenChange={setCorteDialogOpen} />
    </div>
  );
};

export default Index;
