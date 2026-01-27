import { HabilidadeNaoEncontradaError } from "./errors/HabilidadeNãoEncontradaError";
import { PersonagemNaoEcontradoError } from "./errors/PersonagemNaoEcontradoError";
import type { Personagem } from "./Personagem";
import type { Acao } from "./types/acao.type";
import type { Habilidades } from "./types/habilidades.type";

export class Arena {
    competidores: Personagem[] = [];
    
    listarCompetidores(): void {
        this.competidores.forEach(c => {
            console.log(`Nome: ${c.nome} | Vida: ${c.vida}`);
        })
    }

    buscarCompetidor(nome: string): Personagem | undefined {
        const competidor = this.competidores.find(c => c.nome === nome);
        if (competidor) return competidor;
        throw new PersonagemNaoEcontradoError();
    }

    adicionarCompetidor(competidor: Personagem): void {
        this.competidores.push(competidor);
    }

    executarAcao(atacante: Personagem, defensor: Personagem, acao: Acao): number | void {
        switch (acao.tipo) {
            case "atacar":
                return atacante.atacar(defensor);
            case "habilidade":
                const nome = acao.nome as Habilidades;
                const habilidade = atacante[nome];
                if (typeof habilidade === "function") {
                    return habilidade.call(atacante, defensor);
                }
                throw new HabilidadeNaoEncontradaError();
            case "usarItem":
                atacante.usarItem(acao.indice);
                return;
        }
    }

    iniciarLuta(lutador1: Personagem, lutador2: Personagem): void {
        console.log(`A luta começou entre: ${lutador1.nome} e ${lutador2.nome}!`);
        // logica de turno 
    }

}