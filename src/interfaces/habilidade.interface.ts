import { Personagem } from "../domain/Personagem";

export interface IHabilidade {
    nome: string;
    descricao: string;
    custoMana?: number;
    executar: (alvo?: Personagem) => number | void;
}