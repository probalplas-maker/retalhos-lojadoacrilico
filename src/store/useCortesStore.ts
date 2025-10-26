import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Corte } from "@/types";

interface CortesStore {
  cortes: Corte[];
  addCorte: (corte: Omit<Corte, "id" | "dataCriacao">) => void;
  updateCorte: (id: string, corte: Partial<Omit<Corte, "id" | "dataCriacao">>) => void;
  removeCorte: (id: string) => void;
}

export const useCortesStore = create<CortesStore>()(
  persist(
    (set) => ({
      cortes: [],
      addCorte: (corte) =>
        set((state) => ({
          cortes: [
            ...state.cortes,
            {
              ...corte,
              id: crypto.randomUUID(),
              dataCriacao: new Date(),
            },
          ],
        })),
      updateCorte: (id, updatedCorte) =>
        set((state) => ({
          cortes: state.cortes.map((corte) =>
            corte.id === id ? { ...corte, ...updatedCorte } : corte
          ),
        })),
      removeCorte: (id) =>
        set((state) => ({
          cortes: state.cortes.filter((corte) => corte.id !== id),
        })),
    }),
    {
      name: "cortes-storage",
    }
  )
);
