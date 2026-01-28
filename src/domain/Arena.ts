import { Guerreiro, Mago, Arqueiro, Ladino } from "./ClassesPersonagens";
import { AcaoInvalidaError } from "../errors/AcaoInvalidaError";
import { HabilidadeNaoEncontradaError } from "../errors/HabilidadeNãoEncontradaError";
import { PersonagemNaoEcontradoError } from "../errors/PersonagemNaoEcontradoError";
import { Personagem } from "./Personagem";
import type { Acao } from "../types/acao.type";
import type { Habilidades } from "../types/habilidades.type";

export class Arena {
    competidores: Personagem[] = [];
    
    adicionarCompetidor(competidor: Personagem): void {
        this.competidores.push(competidor);
    }

    listarCompetidores(): void {
        this.competidores.forEach(c => {
            console.log(`Nome: ${c.nome} | Classe: ${c.classe} | Vida: ${c.vida}`);
        })
    }

    buscarCompetidor(nome: string): Personagem | undefined {
        const competidor = this.competidores.find(c => c.nome === nome);
        if (!competidor) throw new PersonagemNaoEcontradoError();
        return competidor;
    }

    executarAcao(atacante: Personagem, defensor: Personagem, acao: Acao): number | void {
        switch (acao.tipo) {
            case "atacar":
                return atacante.atacar(defensor);
            case "habilidade":
                return this.executarHabilidade(atacante, defensor, acao.nome as Habilidades);
            case "usarItem":
                atacante.usarItem(acao.indice);
                return;
            default:
                throw new AcaoInvalidaError();
        }
    }

    private executarHabilidade(atacante: Personagem, defensor: Personagem, nome: Habilidades): number | void {
        // Guerreiro
        if (atacante instanceof Guerreiro && nome === "golpeBrutal") {
            return atacante.golpeBrutal(defensor);
        }

        // Mago
        if (atacante instanceof Mago) {
            if (nome == "bolaDeFogo") return atacante.bolaDeFogo(defensor);
            if (nome == "meditar") return atacante.meditar();
        }

        // Arqueiro
        if (atacante instanceof Arqueiro && nome === "flechaPrecisa") {
            return atacante.flechaPrecisa(defensor);
        }

        // Ladino
        if (atacante instanceof Ladino && nome === "furtividade") {
            return atacante.furtividade();
        }

        throw new HabilidadeNaoEncontradaError();
    }

    async iniciarLuta(
        lutador1: Personagem, 
        lutador2: Personagem,
        escolherAcao: (atacante: Personagem, defensor: Personagem) => Promise<Acao>    
    ): Promise<void> {
        console.log(`A luta começou entre: ${lutador1.nome} e ${lutador2.nome}!`);
        let turno = 1;
        let atacante = lutador1;
        let defensor = lutador2;

        try {
            while (atacante.estaVivo() && defensor.estaVivo()) {
                console.log(`\n--- Turno ${turno} ---`);

                const acao = await escolherAcao(atacante, defensor);

                try {
                    const resultado = this.executarAcao(atacante, defensor, acao);
                    if (typeof resultado === "number") {
                        console.log(`${atacante.nome} executou ${acao.tipo} causando ${resultado} de dano.`);
                    } else {
                        console.log(`${atacante.nome} executou ${acao.tipo}.`);
                    }
                } catch (error) {
                    if (error instanceof Error) console.log(`Ação inválida: ${error.message}`);
                }

                console.log(`Vida de ${defensor.nome}: ${defensor.vida}`);
                console.log(`Vida de ${atacante.nome}: ${atacante.vida}`);
                
                [atacante, defensor] = [defensor, atacante];
                turno++;
            }
            const vencedor = lutador1.estaVivo() ? lutador1 : lutador2;
            console.log(`\n${vencedor.nome} venceu a luta!`);
        } catch (error) {
            if (error instanceof Error) console.error("Erro durante a luta:", error.message);
        }
    }

}