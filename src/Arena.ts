import { PersonagemNaoEcontradoError } from "./errors/PersonagemNaoEcontradoError";
import type { Personagem } from "./personagem";

export class Arena {
    competidores: Personagem[] = [];
    
    listarCompetidores(): void {
        this.competidores.forEach(c => {
            console.log(`Nome: ${c.nome} | Nível: ${c.nivel} | Vida: ${c.vida}`);
        })
    }

    buscarCompetidor(nome: string): Personagem | undefined {
        let competidor = this.competidores.find(c => c.nome === nome);
        if (competidor) {
            return competidor;
        }
        throw new PersonagemNaoEcontradoError();
    }

    adicionarCompetidor(competidor: Personagem): void {
        this.competidores.push(competidor);
    }

    executarAcao(atacante: Personagem, defensor: Personagem): number {

    }

    iniciarLuta(lutador1: Personagem, lutador2: Personagem): void {
        console.log(`A luta começou entre: ${lutador1.nome} e ${lutador2.nome}!`);
        // logica de turno 
    }

}