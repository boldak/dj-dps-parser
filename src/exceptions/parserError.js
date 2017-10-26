class ParserError extends Error {
  constructor(message, command, line) {
    super(message);

    if (command)
      this.message = `Invalid command number ${ command } (starts at line ${ line })\n${ message }`;

    this.name = "ParserError";
  }
}

module.exports = ParserError;
