class ParserError extends Error {
  constructor(message, command, line) {
    super(message);

    if (command != null && command != -1)
      this.message = `Invalid command number ${ command } (starts at line ${ line })\n${ message }`;

    this.name = "ParserError";
  }
}

module.exports = ParserError;
