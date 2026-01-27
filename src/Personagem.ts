import type { Classes } from "./enums/classes";
import { InventarioCheioError } from "./errors/InventarioCheioError";
import type { Item } from "./item";

export class Personagem {
    nome: string;
    nivel: number;
    vida: number;
    vidaMaxima: number = 100;
    inventario: Item[] = [];
    classe: Classes;
    ataque: number;
    defesa: number = 10;

    constructor(nome: string, nivel: number, vida: number, classe: Classes, ataque: number, defesa: number) {
        this.nome = nome;
        this.nivel = nivel;
        this.vida = vida;
        this.classe = classe;
        this.ataque = ataque;
        this.defesa = defesa;
    }

    getVida(): number {
        return this.vida;
    }

    setVida(vida: number): number {
        this.vida = vida;
        return this.vida;
    }

    estaVivo(): boolean {
        return this.vida > 0;
    }

    atacar(alvo: Personagem): number {
        const danoCausado = this.ataque - alvo.defesa;
        if (danoCausado > 0) {
           return danoCausado;
        }
        return 0;
    }

    curar(heal: number): void {
        this.vida += heal;
    }

    adicionarItem(item: Item): void {
        if (this.inventario.length < 5) {
            this.inventario.push(item);
            return;
        }
        throw new InventarioCheioError();
    }

    usarItem(indice: number): void {
        if (indice >= 0 && indice < this.inventario.length) {
            const item = this.inventario[indice];
            if (item) {
                item.usar(this);
                this.inventario.splice(indice, 1);
            }
        }
    }

}