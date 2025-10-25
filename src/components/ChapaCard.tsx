import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Ruler, Package } from "lucide-react";
import { Chapa } from "@/types";
import { useChapasStore } from "@/store/useChapasStore";
import { useState } from "react";
import ChapaDialog from "./ChapaDialog";

interface ChapaCardProps {
  chapa: Chapa;
}

const ChapaCard = ({ chapa }: ChapaCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const removeChapa = useChapasStore((state) => state.removeChapa);

  return (
    <>
      <Card className="group hover:shadow-lg hover:shadow-primary/10 transition-all hover:-translate-y-1">
        <CardHeader className="relative pb-3">
          <div
            className="absolute top-0 left-0 right-0 h-2 rounded-t-lg"
            style={{ backgroundColor: chapa.cor.toLowerCase() }}
          />
          <div className="flex items-start justify-between pt-2">
            <div>
              <h3 className="font-semibold text-lg capitalize">{chapa.cor}</h3>
              <p className="text-sm text-muted-foreground">
                {chapa.espessura}mm espessura
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
                onClick={() => removeChapa(chapa.id)}
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
              {chapa.largura}mm × {chapa.altura}mm
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">{chapa.quantidade} unidades</span>
          </div>
          {chapa.localizacao && (
            <div className="mt-2 px-3 py-1 bg-accent rounded-md text-sm">
              📍 {chapa.localizacao}
            </div>
          )}
        </CardContent>
      </Card>
      <ChapaDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        chapa={chapa}
      />
    </>
  );
};

export default ChapaCard;
