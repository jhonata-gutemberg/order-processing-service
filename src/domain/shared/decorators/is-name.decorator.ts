import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from "class-validator";

export function getNameValidationError(value: unknown): string | null {
    if (value === undefined || value === null) {
        return "name is required";
    }
    if (typeof value !== "string") {
        return "name must be a string";
    }
    const trimmed = value.trim();
    if (trimmed === "") {
        return "name is required";
    }
    if (trimmed.length < 2) {
        return "name must be at least 2 characters";
    }
    if (!value.match(/^[a-zA-Z ]+$/)) {
        return "name must not contain numbers or special characters";
    }

    return null;
}

export function IsName(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: "isName",
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: unknown) {
                    return getNameValidationError(value) === null;
                },
                defaultMessage(args: ValidationArguments) {
                    return (
                        getNameValidationError(args.value) ??
                        `${args.property} must be a valid name`
                    );
                },
            },
        });
    };
}
