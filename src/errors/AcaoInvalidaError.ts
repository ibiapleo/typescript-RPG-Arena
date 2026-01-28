export class AcaoInvalidaError extends Error {
    constructor(mensagem: string = "A ação é inválida.") {
        super(mensagem);
        this.name = "AcaoInvalidaError";
    }
}