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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
  tipo: z.enum(["chapa", "retalho", "sobra"]),
  itemId: z.string().min(1, "Selecione um item"),
});

const CorteDialog = ({ open, onOpenChange }: CorteDialogProps) => {
  const chapas = useChapasStore((state) => state.chapas);
  const updateChapa = useChapasStore((state) => state.updateChapa);
  const retalhos = useRetalhosStore((state) => state.retalhos);
  const removeRetalho = useRetalhosStore((state) => state.removeRetalho);
  const sobras = useSobrasStore((state) => state.sobras);
  const removeSobra = useSobrasStore((state) => state.removeSobra);
  const addCorte = useCortesStore((state) => state.addCorte);
  const addSobra = useSobrasStore((state) => state.addSobra);
  const [cortes, setCortes] = useState<Corte[]>([]);
  const [novoCorte, setNovoCorte] = useState({ largura: "", altura: "" });

  const form = useForm<z.infer<typeof corteSchema>>({
    resolver: zodResolver(corteSchema),
    defaultValues: {
      tipo: "chapa",
      itemId: "",
    },
  });

  const tipoSelecionado = form.watch("tipo");
  const itemIdSelecionado = form.watch("itemId");

  const itemSelecionado = 
    tipoSelecionado === "chapa" 
      ? chapas.find((c) => c.id === itemIdSelecionado)
      : tipoSelecionado === "retalho"
      ? retalhos.find((r) => r.id === itemIdSelecionado)
      : sobras.find((s) => s.id === itemIdSelecionado);

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

    if (!itemSelecionado) {
      toast({
        title: "Erro",
        description: "Selecione um item primeiro",
        variant: "destructive",
      });
      return;
    }

    if (largura > itemSelecionado.largura || altura > itemSelecionado.altura) {
      toast({
        title: "Erro",
        description: "Corte maior que o item disponível",
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

    if (!itemSelecionado) return;

    // Calcular área total e área dos cortes
    const areaTotal = (itemSelecionado.largura * itemSelecionado.altura) / 1_000_000; // em m²
    const areaCortes = cortes.reduce((acc, corte) => {
      return acc + (corte.largura * corte.altura) / 1_000_000;
    }, 0);
    const areaRestante = areaTotal - areaCortes;

    // Calcular dimensões da sobra mantendo proporção original
    const proporcao = itemSelecionado.largura / itemSelecionado.altura;
    const alturaSobra = Math.round(Math.sqrt((areaRestante * 1_000_000) / proporcao));
    const larguraSobra = Math.round(alturaSobra * proporcao);

    const origemNome = 
      values.tipo === "chapa" 
        ? `Chapa ${itemSelecionado.cor} (${itemSelecionado.largura}x${itemSelecionado.altura}mm)`
        : values.tipo === "retalho"
        ? `Retalho ${itemSelecionado.cor} (${itemSelecionado.largura}x${itemSelecionado.altura}mm)`
        : `Sobra ${itemSelecionado.cor} (${itemSelecionado.largura}x${itemSelecionado.altura}mm)`;

    // Registar cortes
    cortes.forEach((corte) => {
      addCorte({
        largura: corte.largura,
        altura: corte.altura,
        espessura: itemSelecionado.espessura,
        cor: itemSelecionado.cor,
        chapaOrigem: origemNome,
      });
    });

    // Criar sobra com dimensões especificadas manualmente
    addSobra({
      largura: larguraSobra,
      altura: alturaSobra,
      espessura: itemSelecionado.espessura,
      cor: itemSelecionado.cor,
      chapaOrigem: origemNome,
      localizacao: itemSelecionado.localizacao,
      areaCortada: 0, // Área cortada é 0 na nova sobra
    });

    // Remover/decrementar do store apropriado
    if (values.tipo === "chapa") {
      const chapa = itemSelecionado as any;
      if (chapa.quantidade > 1) {
        updateChapa(values.itemId, { quantidade: chapa.quantidade - 1 });
      } else {
        updateChapa(values.itemId, { quantidade: 0 });
      }
    } else if (values.tipo === "retalho") {
      removeRetalho(values.itemId);
    } else if (values.tipo === "sobra") {
      removeSobra(values.itemId);
    }

    toast({
      title: "Cortes registados!",
      description: `${cortes.length} corte(s) registado(s) e sobra de ${larguraSobra}×${alturaSobra}mm criada`,
    });

    // Reset
    form.reset({ tipo: "chapa", itemId: "" });
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
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Material</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("itemId", "");
                      }}
                      value={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="chapa" id="chapa" />
                        <Label htmlFor="chapa">Chapa</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="retalho" id="retalho" />
                        <Label htmlFor="retalho">Retalho</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sobra" id="sobra" />
                        <Label htmlFor="sobra">Sobra</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="itemId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selecionar {tipoSelecionado === "chapa" ? "Chapa" : tipoSelecionado === "retalho" ? "Retalho" : "Sobra"}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={`Escolha ${tipoSelecionado === "chapa" ? "uma chapa" : tipoSelecionado === "retalho" ? "um retalho" : "uma sobra"}...`} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tipoSelecionado === "chapa" && chapas
                        .filter((c) => c.quantidade > 0)
                        .map((chapa) => (
                          <SelectItem key={chapa.id} value={chapa.id}>
                            {chapa.cor} - {chapa.largura}x{chapa.altura}mm (
                            {chapa.espessura}mm) - {chapa.quantidade} unid.
                          </SelectItem>
                        ))}
                      {tipoSelecionado === "retalho" && retalhos.map((retalho) => (
                        <SelectItem key={retalho.id} value={retalho.id}>
                          {retalho.cor} - {retalho.largura}x{retalho.altura}mm (
                          {retalho.espessura}mm)
                        </SelectItem>
                      ))}
                      {tipoSelecionado === "sobra" && sobras.map((sobra) => (
                        <SelectItem key={sobra.id} value={sobra.id}>
                          {sobra.cor} - {sobra.largura}x{sobra.altura}mm (
                          {sobra.espessura}mm) - {((sobra.largura * sobra.altura) / 1000000 - sobra.areaCortada).toFixed(2)}m² disponíveis
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {itemSelecionado && (
              <Card className="bg-accent/50">
                <CardContent className="pt-4">
                  <p className="text-sm font-medium">
                    {tipoSelecionado === "chapa" ? "Chapa" : tipoSelecionado === "retalho" ? "Retalho" : "Sobra"} selecionada: {itemSelecionado.largura}x
                    {itemSelecionado.altura}mm
                  </p>
                  {tipoSelecionado === "chapa" && (
                    <p className="text-sm text-muted-foreground">
                      {(itemSelecionado as any).quantidade} unidade(s) disponível(is)
                    </p>
                  )}
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
              <>
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
              </>
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
