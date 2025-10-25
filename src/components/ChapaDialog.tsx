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
import { Chapa } from "@/types";
import { useChapasStore } from "@/store/useChapasStore";
import { toast } from "sonner";

interface ChapaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapa?: Chapa;
}

const ChapaDialog = ({ open, onOpenChange, chapa }: ChapaDialogProps) => {
  const [formData, setFormData] = useState({
    largura: "",
    altura: "",
    espessura: "",
    cor: "",
    quantidade: "",
    localizacao: "",
  });

  const addChapa = useChapasStore((state) => state.addChapa);
  const updateChapa = useChapasStore((state) => state.updateChapa);

  useEffect(() => {
    if (chapa) {
      setFormData({
        largura: chapa.largura.toString(),
        altura: chapa.altura.toString(),
        espessura: chapa.espessura.toString(),
        cor: chapa.cor,
        quantidade: chapa.quantidade.toString(),
        localizacao: chapa.localizacao || "",
      });
    } else {
      setFormData({
        largura: "",
        altura: "",
        espessura: "",
        cor: "",
        quantidade: "",
        localizacao: "",
      });
    }
  }, [chapa, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const chapaData = {
      largura: Number(formData.largura),
      altura: Number(formData.altura),
      espessura: Number(formData.espessura),
      cor: formData.cor,
      quantidade: Number(formData.quantidade),
      localizacao: formData.localizacao || undefined,
    };

    if (chapa) {
      updateChapa(chapa.id, chapaData);
      toast.success("Chapa atualizada com sucesso!");
    } else {
      addChapa(chapaData);
      toast.success("Chapa adicionada com sucesso!");
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {chapa ? "Editar Chapa" : "Nova Chapa"}
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

          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                type="number"
                required
                value={formData.quantidade}
                onChange={(e) =>
                  setFormData({ ...formData, quantidade: e.target.value })
                }
              />
            </div>
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
              placeholder="Prateleira A1, Armazém 2..."
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
              {chapa ? "Atualizar" : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChapaDialog;
