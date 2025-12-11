export class StringToIntegerConverter {
    public static convert(stringValue?: string) {
        if (stringValue === undefined) {
            return undefined;
        }
        const number = Number.parseInt(stringValue);
        return isNaN(number) ? undefined : number;
    }
}
