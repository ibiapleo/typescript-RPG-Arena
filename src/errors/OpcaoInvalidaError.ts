export class OpcaoInvalidaError extends Error {
    constructor(msg: string = "Opção inválida!") {
        super(msg);
        this.name = "OpcaoInvalidaError";
    }
}