import type { IItem } from "./interfaces/item.interface";
import type { Personagem } from "./Personagem";
import type { Raridades } from "./enums/raridades";

export class Item implements IItem {
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

    usar(alvo: Personagem): void {
        console.log(`${this.nome} restaurou ${this.qtdVidaRestaurada} pontos de vida!`);
        alvo.curar(this.qtdVidaRestaurada);
    }
}

export class PocaoMana extends Item {
    qtdManaRestaurada: number = 50;

    usar(alvo: Personagem): void {
        console.log(`${this.nome} restaurou ${this.qtdManaRestaurada} pontos de mana!`);
        alvo.curar(this.qtdManaRestaurada);
    }
}