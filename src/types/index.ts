export interface Chapa {
  id: string;
  largura: number;
  altura: number;
  espessura: number;
  cor: string;
  quantidade: number;
  localizacao?: string;
  dataCriacao: Date;
}

export interface Retalho {
  id: string;
  largura: number;
  altura: number;
  espessura: number;
  cor: string;
  chapaOrigem?: string;
  localizacao?: string;
  dataCriacao: Date;
}

export interface Corte {
  id: string;
  largura: number;
  altura: number;
  espessura: number;
  cor: string;
  chapaOrigem?: string;
  dataCriacao: Date;
}

export interface Sobra {
  id: string;
  largura: number;
  altura: number;
  espessura: number;
  cor: string;
  chapaOrigem?: string;
  localizacao?: string;
  areaCortada: number;
  dataCriacao: Date;
}
