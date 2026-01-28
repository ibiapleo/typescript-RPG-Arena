import * as readline from "readline";
import { Arena } from "./domain/Arena";
import { Guerreiro, Mago, Arqueiro, Ladino } from "./domain/ClassesPersonagens";
import { PocaoVida, PocaoMana, PocaoDefesa, PocaoAtaque, CapaSupremaDaTrindade } from "./domain/Item";
import type { Acao } from "./types/acao.type";
import type { Personagem } from "./domain/Personagem";
import type { Habilidades } from "./types/habilidades.type";
import { OpcaoInvalidaError } from "./errors/OpcaoInvalidaError";
import { Classes } from "./enums/classes";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function inputPrompt(pergunta: string): Promise<string> {
    return new Promise(resolve => rl.question(pergunta, resolve));
}

async function aguardarEnter(): Promise<void> {
    await inputPrompt("\nPressione Enter para continuar...");
    console.clear();
}

async function escolherPersonagem(personagens: Personagem[]): Promise<Personagem> {
    console.log("Escolha seu personagem: ");
    personagens.forEach((p, i) => {
        console.log(`${i + 1}. ${p.nome} (Classe: ${Classes[p.classe]})`);
    })
    const escolha = await inputPrompt("Digite o número do personagem escolhido: ");
    const escolhaNum = parseInt(escolha);
    if (isNaN(escolhaNum) || escolhaNum < 1 || escolhaNum > personagens.length) throw new OpcaoInvalidaError();
    console.clear();
    return personagens[escolhaNum - 1]!;
}

async function acaoUsuario(atacante: Personagem, defensor: Personagem): Promise<Acao> {
    console.log('Status:');
    console.log(`Vida: ${atacante.vida}`);
    console.log(`Ataque: ${atacante.ataque}`);
    console.log(`Defesa: ${atacante.defesa}`);
    if (atacante.temMana()) console.log(`Mana: ${atacante.mana}`);
    console.log('\n');
    
    console.log('Inventário:');
    if (atacante.inventario.length) {
        atacante.inventario.forEach((item, index) => {
            console.log(`Item ${index + 1}: ${item.nome} - ${item.descricao}`);
        });       
    }
    console.log('\n');

    console.log('Habilidades:');
    if (atacante.habilidades.length) {
        atacante.habilidades.forEach((habilidade, index) => {
            console.log(`${habilidade.nome} - ${habilidade.descricao}`);
            console.log(`Custo de Mana: ${habilidade.custoMana ?? 0}\n`);
        });
    } else {
        console.log("Nenhuma habilidade disponível.");
    }
    console.log('\n');

    console.log("Ações Disponíveis: ");
    console.log("1. Atacar");

    atacante.habilidades.forEach((h, i) => {
        console.log(`${i + 2}. Usar Habilidade: ${h.nome}`);
    });

    if (atacante.inventario.length) {
        console.log(`${atacante.habilidades.length + 2}. Usar item`);
    }

    const escolha = await inputPrompt("Escolha sua ação: ");
    if (escolha === "1") return { tipo: "atacar" };
    
    if (parseInt(escolha) <= atacante.habilidades.length + 1) {
        const habilidadeSelecionada = atacante.habilidades[parseInt(escolha) - 2];
        if (habilidadeSelecionada) {
            return { tipo: "habilidade", nome: habilidadeSelecionada.nome as Habilidades };
        } else {
            throw new OpcaoInvalidaError();
        }
    }

    if (atacante.inventario.length && escolha === String(atacante.habilidades.length + 2)) {
        const qualItem = await inputPrompt("Qual item? (número): ");
        return { tipo: "usarItem", indice: parseInt(qualItem) - 1 };
    }

    console.clear();
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
    if (!adversario) throw new OpcaoInvalidaError();

    console.clear();

    await arena.iniciarLuta(jogador, adversario, acaoUsuario, aguardarEnter);

    rl.close();
    console.clear();
}

main();

