import type { Classes } from "./enums/classes";
import { InventarioCheioError } from "./errors/InventarioCheioError";
import { PersonagemMortoError } from "./errors/PersonagemMortoError";
import type { IItem } from "./interfaces/item.interface";

export class Personagem {
    public readonly nome: string;
    private _vida: number;
    private _vidaMaxima: number;
    private _inventario: IItem[] = [];
    public classe: Classes;
    public ataque: number;
    public defesa: number;

    constructor(nome: string, vida: number, classe: Classes, ataque: number, defesa: number) {
        this.nome = nome;
        this._vida = vida;
        this._vidaMaxima = vida;
        this.classe = classe;
        this.ataque = ataque;
        this.defesa = defesa;
    }

    get vida(): number {
        return this._vida;
    }

    set vida(valor: number) {
        this._vida = Math.max(0, Math.min(valor, this._vidaMaxima));
    }

    estaVivo(): boolean {
        return this._vida > 0;
    }

    atacar(alvo: Personagem): number {
        if (!this.estaVivo() || !alvo.estaVivo()) throw new PersonagemMortoError();

        const danoCausado = this.ataque - alvo.defesa;
        if (danoCausado > 0) {
           return danoCausado;
        }
        return 0;
    }

    curar(heal: number): void {
        this.vida += heal;
    }

    adicionarItem(item: IItem): void {
        if (this._inventario.length < 5) {
            this._inventario.push(item);
            return;
        }
        throw new InventarioCheioError();
    }

    usarItem(indice: number): void {
        if (indice >= 0 && indice < this._inventario.length) {
            const item = this._inventario[indice];
            if (item) {
                item.usar(this);
                this._inventario.splice(indice, 1);
            }
        }
    }

}