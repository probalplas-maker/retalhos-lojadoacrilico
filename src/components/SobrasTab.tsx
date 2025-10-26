import { useSobrasStore } from "@/store/useSobrasStore";
import { SobraCard } from "./SobraCard";

const SobrasTab = () => {
  const sobras = useSobrasStore((state) => state.sobras);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Sobras</h2>
          <p className="text-muted-foreground">
            Sobras resultantes de cortes em chapas
          </p>
        </div>
      </div>

      {sobras.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">
            Nenhuma sobra registada. Faça cortes para gerar sobras automaticamente.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sobras.map((sobra) => (
            <SobraCard key={sobra.id} sobra={sobra} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SobrasTab;
