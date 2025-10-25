import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Retalho } from "@/types";
import { useRetalhosStore } from "@/store/useRetalhosStore";
import { toast } from "sonner";

interface RetalhoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  retalho?: Retalho;
}

const RetalhoDialog = ({ open, onOpenChange, retalho }: RetalhoDialogProps) => {
  const [formData, setFormData] = useState({
    largura: "",
    altura: "",
    espessura: "",
    cor: "",
    localizacao: "",
    chapaOrigem: "",
  });

  const addRetalho = useRetalhosStore((state) => state.addRetalho);
  const updateRetalho = useRetalhosStore((state) => state.updateRetalho);

  useEffect(() => {
    if (retalho) {
      setFormData({
        largura: retalho.largura.toString(),
        altura: retalho.altura.toString(),
        espessura: retalho.espessura.toString(),
        cor: retalho.cor,
        localizacao: retalho.localizacao || "",
        chapaOrigem: retalho.chapaOrigem || "",
      });
    } else {
      setFormData({
        largura: "",
        altura: "",
        espessura: "",
        cor: "",
        localizacao: "",
        chapaOrigem: "",
      });
    }
  }, [retalho, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const retalhoData = {
      largura: Number(formData.largura),
      altura: Number(formData.altura),
      espessura: Number(formData.espessura),
      cor: formData.cor,
      localizacao: formData.localizacao || undefined,
      chapaOrigem: formData.chapaOrigem || undefined,
    };

    if (retalho) {
      updateRetalho(retalho.id, retalhoData);
      toast.success("Retalho atualizado com sucesso!");
    } else {
      addRetalho(retalhoData);
      toast.success("Retalho adicionado com sucesso!");
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {retalho ? "Editar Retalho" : "Novo Retalho"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="largura">Largura (mm)</Label>
              <Input
                id="largura"
                type="number"
                required
                value={formData.largura}
                onChange={(e) =>
                  setFormData({ ...formData, largura: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="altura">Altura (mm)</Label>
              <Input
                id="altura"
                type="number"
                required
                value={formData.altura}
                onChange={(e) =>
                  setFormData({ ...formData, altura: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="espessura">Espessura (mm)</Label>
            <Input
              id="espessura"
              type="number"
              step="0.1"
              required
              value={formData.espessura}
              onChange={(e) =>
                setFormData({ ...formData, espessura: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cor">Cor</Label>
            <Input
              id="cor"
              required
              value={formData.cor}
              onChange={(e) =>
                setFormData({ ...formData, cor: e.target.value })
              }
              placeholder="Transparente, Branco, Preto..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="localizacao">Localização (opcional)</Label>
            <Input
              id="localizacao"
              value={formData.localizacao}
              onChange={(e) =>
                setFormData({ ...formData, localizacao: e.target.value })
              }
              placeholder="Prateleira B2, Armazém 1..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chapaOrigem">Chapa Origem (opcional)</Label>
            <Input
              id="chapaOrigem"
              value={formData.chapaOrigem}
              onChange={(e) =>
                setFormData({ ...formData, chapaOrigem: e.target.value })
              }
              placeholder="Identificação da chapa original..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {retalho ? "Atualizar" : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RetalhoDialog;
