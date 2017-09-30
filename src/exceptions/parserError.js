class ParserError extends Error {
  constructor(message) {
    this.message = message;
    this.name = "ParserError";
  }
}

export default ParserError;
