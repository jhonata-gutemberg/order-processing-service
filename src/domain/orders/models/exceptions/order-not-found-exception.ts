export class OrderNotFoundException extends Error {
    constructor(message: string) {
        super(message);
    }
}
