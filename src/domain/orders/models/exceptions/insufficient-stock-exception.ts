export class InsufficientStockException extends Error {
    constructor(message: string) {
        super(message);
    }
}
