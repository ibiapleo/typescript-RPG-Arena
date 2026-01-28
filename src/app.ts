import * as readline from "readline";
import { Arena } from "./domain/Arena";
import { Guerreiro, Mago, Arqueiro, Ladino } from "./domain/ClassesPersonagens";
import { PocaoVida, PocaoMana, PocaoDefesa, PocaoAtaque, CapaSupremaDaTrindade } from "./domain/Item";
import type { Acao } from "./types/acao.type";
import type { Personagem } from "./domain/Personagem";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function inputPrompt(pergunta: string): Promise<string> {
    return new Promise(resolve => rl.question(pergunta, resolve));
}

async function escolherPersonagem(personagens: Personagem[]): Promise<Personagem> {
    console.log("Escolha seu personagem: ");
    personagens.forEach((p, i) => {
        console.log(`${i + 1}. ${p.nome} (Classe: ${p.classe})`);
    })
    const escolha = await inputPrompt("Digite o número do personagem escolhido: ");
    const escolhaNum = parseInt(escolha);
    return personagens[escolhaNum - 1];
}

async function acaoUsuario(atacante: Personagem, defensor: Personagem): Promise<Acao> {
    console.log(`Seu turno! Você é ${atacante.nome} e está enfrentando ${defensor.nome}.`);
    console.log(`Vida: ${atacante.vida}`);
    console.log(`Ataque: ${atacante.ataque}`);
    console.log(`Defesa: ${atacante.defesa}`);

    if (atacante.inventario.length) {
        atacante.inventario.forEach((item, index) => {
            console.log(`Item ${index + 1}: ${item.nome} - ${item.descricao}`);
        });       
    }
    const habilidades: string[] = [];
    if (atacante instanceof Guerreiro) habilidades.push("golpeBrutal");
    if (atacante instanceof Mago) habilidades.push("bolaDeFogo", "meditar");
    if (atacante instanceof Arqueiro) habilidades.push("flechaPrecisa");
    if (atacante instanceof Ladino) habilidades.push("furtividade");

    console.log("Ações Disponíveis: ");
    console.log("1. Atacar");

    habilidades.forEach((h, i) => {
        console.log(`${i + 2}. Usar Habilidade: ${h}`);
    });

    if (atacante.inventario.length) {
        console.log(`${habilidades.length + 2} - Usar item`);
    }

    const escolha = await inputPrompt("Escolha sua ação: ");
    if (escolha === "1") return { tipo: "atacar" };
    
    if (parseInt(escolha) <= habilidades.length + 1) {
        return { tipo: "habilidade", nome: habilidades[parseInt(escolha) - 2] as any };
    }

    if (atacante.inventario.length && escolha === String(habilidades.length + 2)) {
        const qualItem = await inputPrompt("Qual item? (número): ");
        return { tipo: "usarItem", indice: parseInt(qualItem) - 1 };
    }

    return { tipo: "atacar" };
}

async function main() {
    const guerreiro = new Guerreiro("Magno");
    const mago = new Mago("DavyJones");
    const arqueiro = new Arqueiro("Legolas");
    const ladino = new Ladino("Ripper");

    guerreiro.adicionarItem(new PocaoVida());
    guerreiro.adicionarItem(new PocaoAtaque());
    guerreiro.adicionarItem(new PocaoDefesa());
    mago.adicionarItem(new PocaoMana());
    mago.adicionarItem(new CapaSupremaDaTrindade());
    arqueiro.adicionarItem(new PocaoVida());
    arqueiro.adicionarItem(new PocaoAtaque());
    ladino.adicionarItem(new PocaoDefesa());
    ladino.adicionarItem(new PocaoMana());
    ladino.adicionarItem(new PocaoAtaque());

    const arena = new Arena();
    arena.adicionarCompetidor(guerreiro);
    arena.adicionarCompetidor(mago);
    arena.adicionarCompetidor(arqueiro);
    arena.adicionarCompetidor(ladino);
    
    const personagens = [guerreiro, mago, arqueiro, ladino];
    const jogador = await escolherPersonagem(personagens);

    const adversarios = personagens.filter(p => p !== jogador);

    console.log("Escolha o adversário:");
    adversarios.forEach((p, i) => {
        console.log(`${i + 1} - ${p.nome} (${p.constructor.name})`);
    });
    const escolhaAdv = await inputPrompt("Digite o número do adversário: ");
    const adversario = adversarios[parseInt(escolhaAdv) - 1];

    await arena.iniciarLuta(jogador, adversario, acaoUsuario);

    rl.close();
}

main();

