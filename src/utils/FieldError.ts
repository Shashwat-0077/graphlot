// NOTE : This will be mainly used in Create or updating something, where we need to show the error in the form field itself. I don't think we need to use this in Get or deleting something

export class FieldError<T extends object> extends Error {
    field: keyof T | "root";

    constructor({
        message,
        field,
    }: {
        message: string;
        field?: keyof T | "root";
    }) {
        super(message);
        this.field = field || "root";
        this.name = "FieldError";
    }
}
