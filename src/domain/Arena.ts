import { Guerreiro, Mago, Arqueiro, Ladino } from "./ClassesPersonagens.js";
import { AcaoInvalidaError } from "../errors/AcaoInvalidaError.js";
import { HabilidadeNaoEncontradaError } from "../errors/HabilidadeNãoEncontradaError.js";
import { PersonagemNaoEcontradoError } from "../errors/PersonagemNaoEcontradoError.js";
import { Personagem } from "./Personagem.js";

import { print } from "../utils/print.js";

// Função para limpar a saída do HTML (usada no lugar de console.clear)
function clearOutput() {
    const output = document.getElementById("output");
    if (output) output.innerHTML = "";
}
import type { Acao } from "../types/acao.type";
import type { Habilidades } from "../types/habilidades.type";

export class Arena {
    competidores: Personagem[] = [];
    
    adicionarCompetidor(competidor: Personagem): void {
        this.competidores.push(competidor);
    }

    listarCompetidores(): void {
        this.competidores.forEach(c => {
            print(`Nome: ${c.nome} | Classe: ${c.classe} | Vida: ${c.vida}`);
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
        print(`A luta começou entre: ${lutador1.nome} e ${lutador2.nome}!`);
        console.log(`A luta começou entre: ${lutador1.nome} e ${lutador2.nome}!`);
        let turno = 1;
        let atacante = lutador1;
        let defensor = lutador2;

        try {
            while (atacante.estaVivo() && defensor.estaVivo()) {
                print(`\n--- Turno ${turno} ---`);
                print(`É a vez de ${atacante.nome} atacar ${defensor.nome}.`);
                console.log(`\n--- Turno ${turno} ---`);
                console.log(`É a vez de ${atacante.nome} atacar ${defensor.nome}.`);


                const acao = await escolherAcao(atacante, defensor);

                clearOutput();

                try {
                    const resultado = this.executarAcao(atacante, defensor, acao);
                    if (typeof resultado === "number") {
                        print(`${atacante.nome} executou ${acao.tipo} causando ${resultado} de dano.`);
                    } else {
                        print(`${atacante.nome} executou ${acao.tipo}.`);
                    }
                } catch (error) {
                    if (error instanceof Error) print(`Ação inválida: ${error.message}`);
                }

                print(`Vida de ${defensor.nome}: ${defensor.vida}`);
                print(`Vida de ${atacante.nome}: ${atacante.vida}`);
                console.log(`Vida de ${defensor.nome}: ${defensor.vida}`);
                console.log(`Vida de ${atacante.nome}: ${atacante.vida}`);

                await aguardarEnter();
                
                [atacante, defensor] = [defensor, atacante];
                turno++;
            }
            const vencedor = atacante.estaVivo() ? atacante : defensor;
            switch (vencedor.constructor.name) {
                case "Guerreiro":
                    print(`O bravo guerreiro ${vencedor.nome} triunfou com sua força e honra!`);
                    console.log(`O bravo guerreiro ${vencedor.nome} triunfou com sua força e honra!`);
                    break;
                case "Mago":
                    print(`O sábio mago ${vencedor.nome} venceu com sua sabedoria e poder arcano!`);
                    console.log(`O sábio mago ${vencedor.nome} venceu com sua sabedoria e poder arcano!`);
                    break;
                case "Arqueiro":
                    print(`O ágil arqueiro ${vencedor.nome} venceu com precisão e destreza!`);
                    console.log(`O ágil arqueiro ${vencedor.nome} venceu com precisão e destreza!`);
                    break;
                case "Ladino":
                    print(`O astuto ladino ${vencedor.nome} venceu nas sombras, sorrateiro como sempre!`);
                    console.log(`O astuto ladino ${vencedor.nome} venceu nas sombras, sorrateiro como sempre!`);
                    break;
                default:
                    print(`O vencedor é: ${vencedor.nome}`);
                    console.log(`O vencedor é: ${vencedor.nome}`);
                    break;
            }
            print(`\n${vencedor.nome} venceu a luta!`);
            await aguardarEnter();
        } catch (error) {
            
            if (error instanceof Error) print("Erro durante a luta: " + error.message);
            
            function clearOutput() {
                const output = document.getElementById("output");
                if (output) output.innerHTML = "";
            }
        }
    }

}