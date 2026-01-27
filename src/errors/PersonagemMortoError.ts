export class PersonagemMortoError extends Error {
    constructor(mensagem: string = "O personagem está morto e não pode realizar esta ação.") {
        super(mensagem);
        this.name = "PersonagemMortoError";
    }
}