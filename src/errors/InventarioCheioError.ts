export class InventarioCheioError extends Error {
    constructor(mensagem: string = "O inventário do personagem está cheio e não pode adicionar mais itens.") {
        super(mensagem);
        this.name = "InventarioCheioError";
    }
}