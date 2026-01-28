export class LadinoEmFurtividadeError extends Error {
    constructor(mensagem: string = "O Ladino está em furtividade e não pode ser atacado!") {
        super(mensagem);
        this.name = "LadinoEmFurtividadeError";
    }
}