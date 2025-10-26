import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChapasStore } from "@/store/useChapasStore";
import { useRetalhosStore } from "@/store/useRetalhosStore";
import { useCortesStore } from "@/store/useCortesStore";
import { useSobrasStore } from "@/store/useSobrasStore";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Scissors } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CorteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Corte {
  largura: number;
  altura: number;
  id: string;
}

const corteSchema = z.object({
  chapaId: z.string().min(1, "Selecione uma chapa"),
});

const CorteDialog = ({ open, onOpenChange }: CorteDialogProps) => {
  const chapas = useChapasStore((state) => state.chapas);
  const updateChapa = useChapasStore((state) => state.updateChapa);
  const addRetalho = useRetalhosStore((state) => state.addRetalho);
  const addCorte = useCortesStore((state) => state.addCorte);
  const addSobra = useSobrasStore((state) => state.addSobra);
  const [cortes, setCortes] = useState<Corte[]>([]);
  const [novoCorte, setNovoCorte] = useState({ largura: "", altura: "" });

  const form = useForm<z.infer<typeof corteSchema>>({
    resolver: zodResolver(corteSchema),
    defaultValues: {
      chapaId: "",
    },
  });

  const chapaSelecionada = chapas.find(
    (c) => c.id === form.watch("chapaId")
  );

  const adicionarCorte = () => {
    const largura = Number(novoCorte.largura);
    const altura = Number(novoCorte.altura);

    if (!largura || !altura) {
      toast({
        title: "Erro",
        description: "Preencha as dimensões do corte",
        variant: "destructive",
      });
      return;
    }

    if (!chapaSelecionada) {
      toast({
        title: "Erro",
        description: "Selecione uma chapa primeiro",
        variant: "destructive",
      });
      return;
    }

    if (largura > chapaSelecionada.largura || altura > chapaSelecionada.altura) {
      toast({
        title: "Erro",
        description: "Corte maior que a chapa disponível",
        variant: "destructive",
      });
      return;
    }

    setCortes([
      ...cortes,
      {
        largura,
        altura,
        id: crypto.randomUUID(),
      },
    ]);
    setNovoCorte({ largura: "", altura: "" });
  };

  const removerCorte = (id: string) => {
    setCortes(cortes.filter((c) => c.id !== id));
  };

  const onSubmit = (values: z.infer<typeof corteSchema>) => {
    if (cortes.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um corte",
        variant: "destructive",
      });
      return;
    }

    const chapa = chapas.find((c) => c.id === values.chapaId);
    if (!chapa) return;

    // Calcular área total cortada
    const areaCortada = cortes.reduce((total, corte) => {
      return total + (corte.largura * corte.altura) / 1000000; // converter para m²
    }, 0);

    // Registar cortes
    cortes.forEach((corte) => {
      addCorte({
        largura: corte.largura,
        altura: corte.altura,
        espessura: chapa.espessura,
        cor: chapa.cor,
        chapaOrigem: `Chapa ${chapa.cor} (${chapa.largura}x${chapa.altura}mm)`,
      });
    });

    // Criar sobra automaticamente com a área cortada
    addSobra({
      largura: chapa.largura,
      altura: chapa.altura,
      espessura: chapa.espessura,
      cor: chapa.cor,
      chapaOrigem: `Chapa ${chapa.cor} (${chapa.largura}x${chapa.altura}mm)`,
      localizacao: chapa.localizacao,
      areaCortada: areaCortada,
    });

    // Decrementar quantidade da chapa
    if (chapa.quantidade > 1) {
      updateChapa(values.chapaId, { quantidade: chapa.quantidade - 1 });
    } else {
      updateChapa(values.chapaId, { quantidade: 0 });
    }

    toast({
      title: "Cortes registados!",
      description: `${cortes.length} corte(s) registado(s) e sobra calculada automaticamente`,
    });

    // Reset
    form.reset();
    setCortes([]);
    setNovoCorte({ largura: "", altura: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scissors className="h-5 w-5" />
            Registar Cortes
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="chapaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selecionar Chapa</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha uma chapa..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {chapas
                        .filter((c) => c.quantidade > 0)
                        .map((chapa) => (
                          <SelectItem key={chapa.id} value={chapa.id}>
                            {chapa.cor} - {chapa.largura}x{chapa.altura}mm (
                            {chapa.espessura}mm) - {chapa.quantidade} unid.
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {chapaSelecionada && (
              <Card className="bg-accent/50">
                <CardContent className="pt-4">
                  <p className="text-sm font-medium">
                    Chapa selecionada: {chapaSelecionada.largura}x
                    {chapaSelecionada.altura}mm
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {chapaSelecionada.quantidade} unidade(s) disponível(is)
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Adicionar Cortes</h3>
              <div className="flex gap-3">
                <Input
                  type="number"
                  placeholder="Largura (mm)"
                  value={novoCorte.largura}
                  onChange={(e) =>
                    setNovoCorte({ ...novoCorte, largura: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      adicionarCorte();
                    }
                  }}
                />
                <Input
                  type="number"
                  placeholder="Altura (mm)"
                  value={novoCorte.altura}
                  onChange={(e) =>
                    setNovoCorte({ ...novoCorte, altura: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      adicionarCorte();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={adicionarCorte}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {cortes.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">
                  Cortes a registar ({cortes.length})
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {cortes.map((corte) => (
                    <Card key={corte.id}>
                      <CardContent className="flex items-center justify-between p-3">
                        <span className="text-sm">
                          {corte.largura}mm × {corte.altura}mm
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removerCorte(corte.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Registar Cortes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CorteDialog;
