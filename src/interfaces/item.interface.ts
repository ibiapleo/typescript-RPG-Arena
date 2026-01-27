import type { Personagem } from "../personagem";
import type { Raridades } from "../enums/raridades";

export interface IItem {
    nome: string;
    descricao: string;
    raridade: Raridades;
    usar(alvo: Personagem): void
}