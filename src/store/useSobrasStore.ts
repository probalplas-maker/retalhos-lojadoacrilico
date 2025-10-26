import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Sobra } from "@/types";

interface SobrasStore {
  sobras: Sobra[];
  addSobra: (sobra: Omit<Sobra, "id" | "dataCriacao">) => void;
  updateSobra: (id: string, sobra: Partial<Omit<Sobra, "id" | "dataCriacao">>) => void;
  removeSobra: (id: string) => void;
}

export const useSobrasStore = create<SobrasStore>()(
  persist(
    (set) => ({
      sobras: [],
      addSobra: (sobra) =>
        set((state) => ({
          sobras: [
            ...state.sobras,
            {
              ...sobra,
              id: crypto.randomUUID(),
              dataCriacao: new Date(),
            },
          ],
        })),
      updateSobra: (id, updatedSobra) =>
        set((state) => ({
          sobras: state.sobras.map((sobra) =>
            sobra.id === id ? { ...sobra, ...updatedSobra } : sobra
          ),
        })),
      removeSobra: (id) =>
        set((state) => ({
          sobras: state.sobras.filter((sobra) => sobra.id !== id),
        })),
    }),
    {
      name: "sobras-storage",
    }
  )
);
