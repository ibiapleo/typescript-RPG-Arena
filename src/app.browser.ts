import { Arena } from "./domain/Arena";
import { Guerreiro, Mago, Arqueiro, Ladino } from "./domain/ClassesPersonagens";
import { PocaoVida, PocaoMana, PocaoDefesa, PocaoAtaque, CapaSupremaDaTrindade } from "./domain/Item";
import type { Acao } from "./types/acao.type";
import type { Personagem } from "./domain/Personagem";
import type { Habilidades } from "./types/habilidades.type";
import { OpcaoInvalidaError } from "./errors/OpcaoInvalidaError";
import { Classes } from "./enums/classes";

const output = document.getElementById("output")!;
const input = document.getElementById("input") as HTMLInputElement;
const button = document.getElementById("button")!;

const restart = document.getElementById("restart-button") as HTMLButtonElement;

if (restart) {
    restart.addEventListener("click", () => {
        window.location.reload();
    });
}

function addEnterListener(handler: () => void) {
    function keyHandler(e: KeyboardEvent) {
        if (e.key === "Enter" || e.keyCode === 13) {
            e.preventDefault();
            handler();
        }
    }
    input.addEventListener("keydown", keyHandler);
    return () => input.removeEventListener("keydown", keyHandler);
}

function inputPrompt(pergunta: string): Promise<string> {
    print(pergunta);
    input.value = "";
    input.focus();
    return new Promise(resolve => {
        let resolved = false;
        function handler() {
            if (resolved) return;
            resolved = true;
            button.removeEventListener("click", handler);
            removeEnterListener();
            resolve(input.value);
        }
        button.addEventListener("click", handler);
        const removeEnterListener = addEnterListener(handler);
    });
}

function print(msg: string) {
    output.innerHTML += msg + "\n";
    output.scrollTop = output.scrollHeight;
}

function clear() {
    output.innerHTML = "";
}

async function aguardarEnter(): Promise<void> {
    await inputPrompt("\nPressione Enter para continuar...");
    clear();
}

async function escolherPersonagem(personagens: Personagem[]): Promise<Personagem> {
    print("Escolha seu personagem: ");
    personagens.forEach((p, i) => {
        print(`${i + 1}. ${p.nome} (Classe: ${Classes[p.classe]})`);
    });
    const escolha = await inputPrompt("Digite o número do personagem escolhido: ");
    const escolhaNum = parseInt(escolha);
    if (isNaN(escolhaNum) || escolhaNum < 1 || escolhaNum > personagens.length) throw new OpcaoInvalidaError();
    clear();
    return personagens[escolhaNum - 1]!;
}

async function acaoUsuario(atacante: Personagem, defensor: Personagem): Promise<Acao> {
    print('Status:');
    print(`Vida: ${atacante.vida}`);
    print(`Ataque: ${atacante.ataque}`);
    print(`Defesa: ${atacante.defesa}`);
    if (atacante.temMana()) print(`Mana: ${atacante.mana}`);
    print('\n');
    
    print('Inventário:');
    if (atacante.inventario.length) {
        atacante.inventario.forEach((item, index) => {
            print(`Item ${index + 1}: ${item.nome} - ${item.descricao}`);
        });       
    }
    print('\n');

    print('Habilidades:');
    if (atacante.habilidades.length) {
        atacante.habilidades.forEach((habilidade, index) => {
            print(`${habilidade.nome} - ${habilidade.descricao}`);
            print(`Custo de Mana: ${habilidade.custoMana ?? 0}\n`);
        });
    } else {
        print("Nenhuma habilidade disponível.");
    }
    print('\n');

    print("Ações Disponíveis: ");
    print("1. Atacar");

    atacante.habilidades.forEach((h, i) => {
        print(`${i + 2}. Usar Habilidade: ${h.nome}`);
    });

    if (atacante.inventario.length) {
        print(`${atacante.habilidades.length + 2}. Usar item`);
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

    clear();
    return { tipo: "atacar" };
}

async function main() {
    const guerreiro = new Guerreiro("Magnus");
    const mago = new Mago("Davy");
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

    print("Escolha o adversário:");
    adversarios.forEach((p, i) => {
        print(`${i + 1} - ${p.nome} (${p.constructor.name})`);
    });
    const escolhaAdv = await inputPrompt("Digite o número do adversário: ");
    const adversario = adversarios[parseInt(escolhaAdv) - 1];
    if (!adversario) throw new OpcaoInvalidaError();

    clear();

    await arena.iniciarLuta(jogador, adversario, acaoUsuario, aguardarEnter);
    }

main();

