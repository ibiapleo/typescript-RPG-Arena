import type { Habilidades } from "./habilidades.type";
export type Acao = 
    | { tipo: "atacar" } 
    | { tipo: "habilidade"; nome: Habilidades } 
    | { tipo: "usarItem"; indice: number };