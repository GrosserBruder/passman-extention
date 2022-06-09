class AuthorisationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthorisationError";
  }
}