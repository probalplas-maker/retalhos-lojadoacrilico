import { Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSobrasStore } from "@/store/useSobrasStore";
import { Sobra } from "@/types";

interface SobraCardProps {
  sobra: Sobra;
}

export const SobraCard = ({ sobra }: SobraCardProps) => {
  const removeSobra = useSobrasStore((state) => state.removeSobra);

  const area = (sobra.largura * sobra.altura) / 1000000;
  const areaDisponivel = area - sobra.areaCortada;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-lg">{sobra.cor}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Espessura: {sobra.espessura}mm
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-medium">Dimensões</p>
          <p className="text-2xl font-bold">
            {sobra.largura} × {sobra.altura}mm
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">Área Total</p>
          <p className="text-lg">{area.toFixed(2)} m²</p>
        </div>
        <div>
          <p className="text-sm font-medium">Área Cortada</p>
          <p className="text-lg text-destructive">{sobra.areaCortada.toFixed(2)} m²</p>
        </div>
        <div>
          <p className="text-sm font-medium">Área Disponível</p>
          <p className="text-lg font-semibold text-primary">{areaDisponivel.toFixed(2)} m²</p>
        </div>
        {sobra.chapaOrigem && (
          <div>
            <p className="text-sm font-medium">Origem</p>
            <p className="text-sm text-muted-foreground">{sobra.chapaOrigem}</p>
          </div>
        )}
        {sobra.localizacao && (
          <div>
            <p className="text-sm font-medium">Localização</p>
            <p className="text-sm text-muted-foreground">{sobra.localizacao}</p>
          </div>
        )}
        <div className="flex gap-2 pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-destructive hover:text-destructive"
            onClick={() => removeSobra(sobra.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
