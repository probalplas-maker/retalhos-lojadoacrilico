import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Retalho } from "@/types";

interface RetalhosStore {
  retalhos: Retalho[];
  addRetalho: (retalho: Omit<Retalho, "id" | "dataCriacao">) => void;
  updateRetalho: (id: string, retalho: Partial<Omit<Retalho, "id" | "dataCriacao">>) => void;
  removeRetalho: (id: string) => void;
}

export const useRetalhosStore = create<RetalhosStore>()(
  persist(
    (set) => ({
      retalhos: [
        {
          id: "1",
          largura: 500,
          altura: 800,
          espessura: 3,
          cor: "Transparente",
          localizacao: "Armazém C - Retalhos",
          dataCriacao: new Date(),
        },
        {
          id: "2",
          largura: 300,
          altura: 600,
          espessura: 5,
          cor: "Preto",
          localizacao: "Armazém C - Retalhos",
          dataCriacao: new Date(),
        },
      ],
      addRetalho: (retalho) =>
        set((state) => ({
          retalhos: [
            ...state.retalhos,
            {
              ...retalho,
              id: crypto.randomUUID(),
              dataCriacao: new Date(),
            },
          ],
        })),
      updateRetalho: (id, updatedRetalho) =>
        set((state) => ({
          retalhos: state.retalhos.map((retalho) =>
            retalho.id === id ? { ...retalho, ...updatedRetalho } : retalho
          ),
        })),
      removeRetalho: (id) =>
        set((state) => ({
          retalhos: state.retalhos.filter((retalho) => retalho.id !== id),
        })),
    }),
    {
      name: "retalhos-storage",
    }
  )
);
