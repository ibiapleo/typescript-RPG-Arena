import { Classes } from "../enums/classes";
import { LadinoEmFurtividadeError } from "../errors/LadinoEmFurtividadeError";
import { ManaInsuficienteError } from "../errors/ManaInsuficienteError";
import { PersonagemMortoError } from "../errors/PersonagemMortoError";
import { IHabilidade } from "../interfaces/habilidade.interface";
import { Personagem } from "./Personagem";

export class Guerreiro extends Personagem {
    constructor(nome: string) {
        super(nome, 150, Classes.Guerreiro, 18, 10);
    }
    
    override get habilidades(): IHabilidade[] {
        return [
            {
                nome: "golpeBrutal",
                descricao: "Um ataque poderoso que causa dano dobrado ao inimigo.",
                executar: (alvo?: Personagem) => this.golpeBrutal(alvo!)
            }
        ];
    }

    golpeBrutal(alvo: Personagem): number {
        if (!this.estaVivo() || !alvo.estaVivo()) throw new PersonagemMortoError();
        if (!alvo.podeSerAtacado()) throw new LadinoEmFurtividadeError();

        const dano = (this.ataque * 2) - alvo.defesa;
        return dano > 0 ? dano : 0;
    }

}

export class Mago extends Personagem {
    mana: number;
    
    constructor (nome: string) {
        super(nome, 80, Classes.Mago, 9, 5);
        this.mana = 100;
    }

    override get habilidades(): IHabilidade[] {
        return [
            {
                nome: "bolaDeFogo",
                descricao: "Uma bola de fogo que causa dano de ataque triplo ao inimigo.",
                custoMana: 30,
                executar: (alvo?: Personagem) => this.bolaDeFogo(alvo!)
            },
            {
                nome: "meditar",
                descricao: "Meditar durante a batalha para recuperar 25 pontos de mana.",
                custoMana: 0,
                executar: () => this.meditar()
            }
        ];
    }

    bolaDeFogo(alvo: Personagem): number {
        if (this.mana < 30) throw new ManaInsuficienteError();
        if (!this.estaVivo() || !alvo.estaVivo()) throw new PersonagemMortoError();
        if (!alvo.podeSerAtacado()) throw new LadinoEmFurtividadeError();

        this.mana -= 30;
        const dano = (this.ataque * 3) - alvo.defesa;
        return dano > 0 ? dano : 0;
    }

    meditar(): void {
        this.mana += 25;
    }
    
    override restaurarMana(valor: number): void {
        this.mana = Math.min(this.mana + valor, 100);
    }
}

export class Arqueiro extends Personagem {
    mana: number;

    constructor(nome: string) {
        super(nome, 100, Classes.Arqueiro, 12, 6);
        this.mana = 30;
    }

    override get habilidades(): IHabilidade[] {
        return [
            {
                nome: "flechaPrecisa",
                descricao: "Um ataque preciso que pode causar dano crítico.",
                custoMana: 15,
                executar: (alvo?: Personagem) => this.flechaPrecisa(alvo!)
            }
        ];
    }

    override atacar(alvo: Personagem): number {
        if (!this.estaVivo() || !alvo.estaVivo()) throw new PersonagemMortoError();
        if (!alvo.podeSerAtacado()) throw new LadinoEmFurtividadeError();

        let dano = this.ataque - alvo.defesa;
        
        if (Math.random() < 0.3) {
            dano *= 2;
            console.log("Acerto crítico!");
        }

        return dano > 0 ? dano : 0;
    }

    flechaPrecisa(alvo: Personagem): number {
        if (this.mana < 15) throw new ManaInsuficienteError();
        if (!this.estaVivo() || !alvo.estaVivo()) throw new PersonagemMortoError();
        if (!alvo.podeSerAtacado()) throw new LadinoEmFurtividadeError();

        this.mana -= 15;
        const dano = (this.ataque * 2) - alvo.defesa;
        return dano > 0 ? dano : 0;
    }

    override restaurarMana(valor: number): void {
        this.mana = Math.min(this.mana + valor, 30);
    }

}

export class Ladino extends Personagem {
    emFurtividade: boolean = false;
    mana: number;

    constructor(nome: string) {
        super(nome, 80, Classes.Ladino, 14, 4);
        this.mana = 30;
    }

    override get habilidades(): IHabilidade[] {
        return [
            {
                nome: "furtividade",
                descricao: "Entrar em modo furtivo para evitar ataques inimigos e causar dano aumentado no próximo ataque.",
                custoMana: 15,
                executar: () => this.furtividade()
            }
        ];
    }

    furtividade(): void {
        if (this.mana < 15) throw new ManaInsuficienteError();

        this.mana -= 15;
        this.emFurtividade = true;
        console.log(`${this.nome} entrou em modo furtivo!`);
    }

    override atacar(alvo: Personagem): number {
        if (!this.estaVivo() || !alvo.estaVivo()) throw new PersonagemMortoError();
        if (!alvo.podeSerAtacado()) throw new LadinoEmFurtividadeError();
        
        let dano = this.ataque - alvo.defesa;
        if (this.emFurtividade) {
            dano *= 4;
            this.emFurtividade = false;
            console.log(`Ataque furtivo bem-sucedido! ${this.nome} perdeu a furtividade!`);
        }
        return dano > 0 ? dano : 0;
    }

    override podeSerAtacado(): boolean {
        return !this.emFurtividade;
    }

    override restaurarMana(valor: number): void {
        this.mana = Math.min(this.mana + valor, 30);
    }


}
