import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import RetalhoCard from "@/components/RetalhoCard";
import RetalhoDialog from "@/components/RetalhoDialog";
import { useRetalhosStore } from "@/store/useRetalhosStore";

const RetalhosTab = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const retalhos = useRetalhosStore((state) => state.retalhos);

  const filteredRetalhos = retalhos.filter(
    (retalho) =>
      retalho.cor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retalho.localizacao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Retalhos</h2>
          <p className="text-muted-foreground mt-1">
            {retalhos.length} retalhos disponíveis
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Retalho
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por cor ou localização..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRetalhos.map((retalho) => (
          <RetalhoCard key={retalho.id} retalho={retalho} />
        ))}
      </div>

      {filteredRetalhos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm
              ? "Nenhum retalho encontrado"
              : "Adicione seu primeiro retalho"}
          </p>
        </div>
      )}

      <RetalhoDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default RetalhosTab;
