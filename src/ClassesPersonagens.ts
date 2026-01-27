import { Classes } from "./enums/classes";
import { ManaInsuficienteError } from "./errors/ManaInsuficienteError";
import { PersonagemMortoError } from "./errors/PersonagemMortoError";
import { Personagem } from "./Personagem";

export class Guerreiro extends Personagem {
    constructor(nome: string) {
        super(nome, 150, Classes.Guerreiro, 18, 10);
    }

    golpeBrutal(alvo: Personagem): number {
        if (!this.estaVivo() || !alvo.estaVivo()) throw new PersonagemMortoError();
        const danoCausado = (this.ataque * 2) - alvo.defesa;
        return danoCausado > 0 ? danoCausado : 0;
    }
}

export class Mago extends Personagem {
    mana: number;
    
    constructor (nome: string) {
        super(nome, 80, Classes.Mago, 9, 5);
        this.mana = 100;
    }

    bolaDeFogo(alvo: Personagem): number {
        if (this.mana < 30) throw new ManaInsuficienteError();
        if (!this.estaVivo() || !alvo.estaVivo()) throw new PersonagemMortoError();
        this.mana -= 30;
        const danoCausado = (this.ataque * 3) - alvo.defesa;
        return danoCausado > 0 ? danoCausado : 0;
    }

    meditar(): void {
        this.mana += 25;
    }
}

export class Arqueiro extends Personagem {
    mana: number;

    constructor(nome: string) {
        super(nome, 100, Classes.Arqueiro, 12, 6);
        this.mana = 30;
    }

    override atacar(alvo: Personagem): number {
        if (!this.estaVivo() || !alvo.estaVivo()) throw new PersonagemMortoError();
        let dano = this.ataque - alvo.defesa;
        
        if (Math.random() < 0.3) {
            dano *= 2;
            console.log("Acerto crítico!");
        }

        return dano > 0 ? dano : 0;
    }

    flechaPrecisa(alvo: Personagem): number {
        if (!this.estaVivo() || !alvo.estaVivo()) throw new PersonagemMortoError();
        this.mana -= 15;
        const dano = (this.ataque * 2) - alvo.defesa;
        return dano > 0 ? dano : 0;
    }
}

export class Ladino extends Personagem {
    emFurtividade: boolean = false;

    constructor(nome: string) {
        super(nome, 80, Classes.Ladino, 14, 4);
    }

    furtividade(): void {
        this.emFurtividade = true;
        console.log(`${this.nome} entrou em modo furtivo!`);
    }

    override atacar(alvo: Personagem): number {
        if (!this.estaVivo() || !alvo.estaVivo()) throw new PersonagemMortoError();
        let dano = this.ataque - alvo.defesa;
        if (this.emFurtividade) {
            dano *= 4;
            this.emFurtividade = false;
            console.log(`Ataque furtivo bem-sucedido! ${this.nome} perdeu a furtividade!`);
        }
        return dano > 0 ? dano : 0;
    }


}
