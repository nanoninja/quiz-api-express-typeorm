export interface ErrorItem {
    message: string;
    reason?: string;
    domain?: string;
}

export interface ErrorHandler {
    status: number;
    message: string;
    type?: string;
    description?: string;
    errors?: ErrorItem[];
}

export class HttpError implements ErrorHandler {
    status: number = 200;
    message: string;
    type?: string;
    description?: string;
    errors?: ErrorItem[];

    constructor(status: number, message: string, description?: string) {
        this.status = status;
        this.message = message;
        this.description = description;
    }

    addItem(message: string, reason?: string, domain?: string): HttpError {
        if (!this.errors) {
            this.errors = [];
        }

        this.errors.push({
            message: message,
            reason: reason,
            domain: domain
        });

        return this;
    }

}

export function createError(status: number, msg: string, description?: string): HttpError {
    return new HttpError(status, msg, description);
}
