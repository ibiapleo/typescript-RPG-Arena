import { ManaInsuficienteError } from "./errors/ManaInsuficienteError";
import { Personagem } from "./personagem";

export class Guerreiro extends Personagem {
    vida: number = 150;
    vidaMaxima: number = 150;
    ataque: number = 18;

    golpeBrutal(alvo: Personagem): number {
        const danoCausado = (this.ataque * 2) - alvo.defesa;
        return danoCausado;
    }
}

export class Mago extends Personagem {
    vida: number = 80;
    ataque: number = 9;
    mana: number = 100;

    bolaDeFogo(alvo: Personagem): number {
        if (this.mana >= 30) {
            const danoCausado = (this.ataque * 3) - alvo.defesa;
            this.mana -= 30;
            return danoCausado;
        }
        throw new ManaInsuficienteError();
    }

    meditar(): void {
        this.mana += 25;
    }
}

export class Arqueiro extends Personagem {
    vida: number = 100;
    ataque: number = 12;
    mana: number = 50;

    override atacar(alvo: Personagem): number {
        const danoBase = this.ataque - alvo.defesa;
        let danoFinal = danoBase;
        
        if (Math.random() < 0.3) {
            danoFinal *= 2;
            console.log("Acerto crítico!");
        }

        return danoFinal;
    }
}

export class Ladino extends Personagem {
    vida: number = 80;
    ataque: number = 14;
    emFurtividade: boolean = false;

    furtividade(): void {
        this.emFurtividade = true;
        console.log(`${this.nome} entrou em modo furtivo!`);
    }

    override atacar(alvo: Personagem): number {
        let danoCausado = this.ataque - alvo.defesa;
        if (this.emFurtividade) {
            danoCausado *= 4;
            this.emFurtividade = false;
            console.log(`Ataque furtivo bem-sucedido! ${this.nome} perdeu a furtividade!`);
        }
        return danoCausado;
    }


}
