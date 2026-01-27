export class PersonagemNaoEcontradoError extends Error {
    constructor(mensagem: string = "O personagem não foi encontrado.") {
        super(mensagem);
        this.name = "PersonagemNaoEcontradoError";
    }
}