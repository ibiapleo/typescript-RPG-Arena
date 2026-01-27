export class HabilidadeNaoEncontradaError extends Error {
    constructor(mensagem: string = "A habilidade não foi encontrada.") {
        super(mensagem);
        this.name = "HabilidadeNaoEncontradaError";
    }
}