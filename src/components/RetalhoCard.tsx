import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Ruler, Scissors } from "lucide-react";
import { Retalho } from "@/types";
import { useRetalhosStore } from "@/store/useRetalhosStore";
import { useState } from "react";
import RetalhoDialog from "./RetalhoDialog";

interface RetalhoCardProps {
  retalho: Retalho;
}

const RetalhoCard = ({ retalho }: RetalhoCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const removeRetalho = useRetalhosStore((state) => state.removeRetalho);
  const area = (retalho.largura * retalho.altura) / 1000000;

  return (
    <>
      <Card className="group hover:shadow-lg hover:shadow-primary/10 transition-all hover:-translate-y-1">
        <CardHeader className="relative pb-3">
          <div
            className="absolute top-0 left-0 right-0 h-2 rounded-t-lg"
            style={{ backgroundColor: retalho.cor.toLowerCase() }}
          />
          <div className="flex items-start justify-between pt-2">
            <div>
              <h3 className="font-semibold text-lg capitalize">{retalho.cor}</h3>
              <p className="text-sm text-muted-foreground">
                {retalho.espessura}mm espessura
              </p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsEditOpen(true)}
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeRetalho(retalho.id)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Ruler className="h-4 w-4 text-muted-foreground" />
            <span>
              {retalho.largura}mm × {retalho.altura}mm
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Scissors className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">{area.toFixed(3)}m²</span>
          </div>
          {retalho.localizacao && (
            <div className="mt-2 px-3 py-1 bg-accent rounded-md text-sm">
              📍 {retalho.localizacao}
            </div>
          )}
        </CardContent>
      </Card>
      <RetalhoDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        retalho={retalho}
      />
    </>
  );
};

export default RetalhoCard;
