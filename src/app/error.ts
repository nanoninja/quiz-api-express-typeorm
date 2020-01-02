export class DomainError extends Error {
    public reason?: string;
    public code: number = 200;
    public data?: {};

    constructor(message: string) {
        super(message);

        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends DomainError {
    constructor(resource: string) {
        super(`Resource ${resource} was not found`);
        this.code = 404;
    }
}

export class BadRequestError extends DomainError {
    constructor(reason?: string, data?: {}) {
        super('Bad Request');
        this.code = 404;
        this.reason = reason;
        this.data = data;
    }
}

export class ConflictError extends DomainError {
    constructor(reason?: string) {
        super('Forbidden');

        this.code = 409;
        this.reason = reason;
    }
}

export class ForbidenError extends DomainError {
    constructor(reason?: string) {
        super('Forbidden');

        this.code = 403;
        this.reason = reason;
    }
}

export class InternalError extends DomainError {
    constructor(reason?: string) {
        super('Internal Server Error');

        this.code = 500;
        this.reason = reason;
    }
}

export class UnauthorizedError extends DomainError {
    constructor(reason?: string) {
        super('Unauthorized');

        this.code = 401;
        this.reason = reason;
    }
}

export class UnprocessableEntity extends DomainError {
    constructor(message: string = 'Unprocessable Entity') {
        super(message);

        this.code = 422;
    }
}