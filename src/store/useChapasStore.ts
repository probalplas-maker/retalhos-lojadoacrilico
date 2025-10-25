import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Chapa } from "@/types";

interface ChapasStore {
  chapas: Chapa[];
  addChapa: (chapa: Omit<Chapa, "id" | "dataCriacao">) => void;
  updateChapa: (id: string, chapa: Partial<Omit<Chapa, "id" | "dataCriacao">>) => void;
  removeChapa: (id: string) => void;
}

export const useChapasStore = create<ChapasStore>()(
  persist(
    (set) => ({
      chapas: [
        {
          id: "1",
          largura: 2000,
          altura: 3000,
          espessura: 3,
          cor: "Transparente",
          quantidade: 10,
          localizacao: "Armazém A - Prateleira 1",
          dataCriacao: new Date(),
        },
        {
          id: "2",
          largura: 1220,
          altura: 2440,
          espessura: 5,
          cor: "Branco",
          quantidade: 5,
          localizacao: "Armazém B - Prateleira 3",
          dataCriacao: new Date(),
        },
      ],
      addChapa: (chapa) =>
        set((state) => ({
          chapas: [
            ...state.chapas,
            {
              ...chapa,
              id: crypto.randomUUID(),
              dataCriacao: new Date(),
            },
          ],
        })),
      updateChapa: (id, updatedChapa) =>
        set((state) => ({
          chapas: state.chapas.map((chapa) =>
            chapa.id === id ? { ...chapa, ...updatedChapa } : chapa
          ),
        })),
      removeChapa: (id) =>
        set((state) => ({
          chapas: state.chapas.filter((chapa) => chapa.id !== id),
        })),
    }),
    {
      name: "chapas-storage",
    }
  )
);
