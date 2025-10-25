import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, Scissors, Package, TrendingUp } from "lucide-react";
import { useChapasStore } from "@/store/useChapasStore";
import { useRetalhosStore } from "@/store/useRetalhosStore";

const Dashboard = () => {
  const chapas = useChapasStore((state) => state.chapas);
  const retalhos = useRetalhosStore((state) => state.retalhos);

  const totalChapas = chapas.reduce((acc, c) => acc + c.quantidade, 0);
  const totalRetalhos = retalhos.length;
  const areaChapas = chapas.reduce(
    (acc, c) => acc + (c.largura * c.altura * c.quantidade) / 1000000,
    0
  );
  const areaRetalhos = retalhos.reduce(
    (acc, r) => acc + (r.largura * r.altura) / 1000000,
    0
  );

  const stats = [
    {
      title: "Chapas em Stock",
      value: totalChapas,
      icon: Layers,
      color: "from-primary to-primary-glow",
    },
    {
      title: "Retalhos",
      value: totalRetalhos,
      icon: Scissors,
      color: "from-accent-foreground to-primary",
    },
    {
      title: "Área Total Chapas",
      value: `${areaChapas.toFixed(2)}m²`,
      icon: Package,
      color: "from-primary to-accent-foreground",
    },
    {
      title: "Área Retalhos",
      value: `${areaRetalhos.toFixed(2)}m²`,
      icon: TrendingUp,
      color: "from-primary-glow to-primary",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground mt-1">Visão geral do inventário</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="relative overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
            <div
              className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`}
            />
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Distribuição por Cor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(
              chapas.reduce((acc, c) => {
                acc[c.cor] = (acc[c.cor] || 0) + c.quantidade;
                return acc;
              }, {} as Record<string, number>)
            ).map(([cor, quantidade]) => (
              <div key={cor} className="flex items-center gap-4">
                <div
                  className="w-4 h-4 rounded border border-border"
                  style={{ backgroundColor: cor.toLowerCase() }}
                />
                <span className="flex-1 capitalize">{cor}</span>
                <span className="font-semibold">{quantidade} chapas</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
