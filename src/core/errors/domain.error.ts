export class DomainError extends Error {
  public readonly code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
  }
}

export class ConflictError extends DomainError {}
export class NotFoundError extends DomainError {}
export class ValidationError extends DomainError {}
