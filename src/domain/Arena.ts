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
                const dano = atacante.atacar(defensor);
                defensor.vida -= dano;
                return dano;
            case "habilidade":
                const danoHab = this.executarHabilidade(atacante, defensor, acao.nome as Habilidades);
                if (typeof danoHab === "number") {
                    defensor.vida -= danoHab;
                    return danoHab;
                }
                return 0;
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
        escolherAcao: (atacante: Personagem, defensor: Personagem) => Promise<Acao>,
        aguardarEnter: () => Promise<void>    
    ): Promise<void> {
        console.log(`A luta começou entre: ${lutador1.nome} e ${lutador2.nome}!`);
        let turno = 1;
        let atacante = lutador1;
        let defensor = lutador2;

        try {
            while (atacante.estaVivo() && defensor.estaVivo()) {
                console.log(`\n--- Turno ${turno} ---`);
                console.log(`É a vez de ${atacante.nome} atacar ${defensor.nome}.`);

                const acao = await escolherAcao(atacante, defensor);

                console.clear();

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

                await aguardarEnter();
                
                [atacante, defensor] = [defensor, atacante];
                turno++;
            }
            const vencedor = atacante.estaVivo() ? atacante : defensor;
            switch (vencedor.constructor.name) {
                case "Guerreiro":
                    console.log(`O bravo guerreiro ${vencedor.nome} triunfou com sua força e honra!`);
                    break;
                case "Mago":
                    console.log(`O sábio mago ${vencedor.nome} venceu com sua sabedoria e poder arcano!`);
                    break;
                case "Arqueiro":
                    console.log(`O ágil arqueiro ${vencedor.nome} venceu com precisão e destreza!`);
                    break;
                case "Ladino":
                    console.log(`O astuto ladino ${vencedor.nome} venceu nas sombras, sorrateiro como sempre!`);
                    break;
                default:
                    console.log(`O vencedor é: ${vencedor.nome}`);
            }
            console.log(`\n${vencedor.nome} venceu a luta!`);
            await aguardarEnter();
        } catch (error) {
            if (error instanceof Error) console.error("Erro durante a luta:", error.message);
        }
    }

}