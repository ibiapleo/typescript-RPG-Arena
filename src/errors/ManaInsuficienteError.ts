export class ManaInsuficienteError extends Error {
    constructor(mensagem: string = "O personagem não possui mana suficiente para realizar esta ação.") {
        super(mensagem);
        this.name = "ManaInsuficienteError";
    }
}