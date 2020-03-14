export class DomainError extends Error {
    public reason?: string;
    public status: number = 200;
    public data?: {};

    constructor(message: string) {
        super(message);

        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends DomainError {
    constructor(resource: string, reason?: string) {
        super(`Resource ${resource} was not found`);

        this.status = 404;
        this.reason = reason;
    }
}


export class BadRequestError extends DomainError {
    constructor(reason?: string, data?: {}) {
        super('Bad Request');

        this.status = 400;
        this.reason = reason;
        this.data = data;
    }
}

export class ConflictError extends DomainError {
    constructor(reason?: string) {
        super('Forbidden');

        this.status = 409;
        this.reason = reason;
    }
}

export class ForbiddenError extends DomainError {
    constructor(reason?: string) {
        super('Forbidden');

        this.status = 403;
        this.reason = reason;
    }
}

export class InternalError extends DomainError {
    constructor(reason?: string) {
        super('Internal Server Error');

        this.status = 500;
        this.reason = reason;
    }
}

export class UnauthorizedError extends DomainError {
    constructor(reason?: string) {
        super('Unauthorized');

        this.status = 401;
        this.reason = reason;
    }
}

export class UnprocessableEntity extends DomainError {
    constructor(message: string = 'Unprocessable Entity') {
        super(message);

        this.status = 422;
    }
}