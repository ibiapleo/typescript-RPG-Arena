import type { IItem } from "../interfaces/item.interface";
import type { Personagem } from "./Personagem";
import { Raridades } from "../enums/raridades";

abstract class Item implements IItem {
    nome: string;
    descricao: string;
    raridade: Raridades;

    constructor(nome: string, descricao: string, raridade: Raridades) {
        this.nome = nome;
        this.descricao = descricao;
        this.raridade = raridade;
    }

    usar(alvo: Personagem): void {
        console.log(`${this.nome} foi utilizada! em ${alvo.nome}`);
    }
}

export class PocaoVida extends Item {
    qtdVidaRestaurada: number = 50;

    constructor() {
        super("Poção de Vida", "Restaura 50 pontos de vida.", Raridades.Incomum);
    }

    usar(alvo: Personagem): void {
        console.log(`${this.nome} restaurou ${this.qtdVidaRestaurada} pontos de vida!`);
        alvo.curar(this.qtdVidaRestaurada);
    }
}

export class PocaoMana extends Item {
    qtdManaRestaurada: number = 50;

    constructor() {
        super("Poção de Mana", "Restaura 50 pontos de mana.", Raridades.Raro);
    }

    usar(alvo: Personagem): void {
        console.log(`${this.nome} restaurou ${this.qtdManaRestaurada} pontos de mana!`);
        alvo.restaurarMana(this.qtdManaRestaurada);
    }
}

export class PocaoDefesa extends Item {
    qtdDefesaAumentada: number = 15;

    constructor() {
        super("Poção de Defesa", "Aumenta 15 pontos de defesa.", Raridades.Epico);
    }

    usar(alvo: Personagem): void {
        console.log(`${this.nome} aumentou ${this.qtdDefesaAumentada} pontos de defesa!`);
        alvo.aumentarDefesa(this.qtdDefesaAumentada);
    }
}

export class PocaoAtaque extends Item {
    qtdAtaqueAumentado: number = 15;

    constructor() {
        super("Poção de Ataque", "Aumenta 15 pontos de ataque.", Raridades.Epico);
    }

    usar(alvo: Personagem): void {
        console.log(`${this.nome} aumentou ${this.qtdAtaqueAumentado} pontos de ataque!`);
        alvo.aumentarAtaque(this.qtdAtaqueAumentado);
    }
}

export class CapaSupremaDaTrindade extends Item {
    qtdAtaqueAumentado: number = 10;
    qtdDefesaAumentada: number = 10;
    qtdVidaRestaurada: number = 100;
    qtdManaRestaurada: number = 100;

    constructor() {
        super("Capa Suprema da Trindade", "Aumenta 10 pontos de ataque e defesa, restaura 100 pontos de vida e mana.", Raridades.Lendario);
    }

    usar(alvo: Personagem): void {
        console.log(`${alvo.nome} utilizou a Capa Suprema da Trindade! ${this.qtdAtaqueAumentado} pontos de ataque aumentados! ${this.qtdDefesaAumentada} pontos de defesa aumentados! ${this.qtdVidaRestaurada} pontos de vida restaurados! ${this.qtdManaRestaurada} pontos de mana restaurados!`);
        alvo.aumentarAtaque(this.qtdAtaqueAumentado);
        alvo.aumentarDefesa(this.qtdDefesaAumentada);
        alvo.curar(this.qtdVidaRestaurada);
        alvo.restaurarMana(this.qtdManaRestaurada);
    }
}
