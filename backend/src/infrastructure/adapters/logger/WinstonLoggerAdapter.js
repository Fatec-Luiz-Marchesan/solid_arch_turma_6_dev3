const ILoggerGateway = require("../../../domain/ports/ILoggerGateway");

class WinstonLoggerAdapter extends ILoggerGateway {
  constructor(winstonInstance) {
    super();
    if (!winstonInstance) {
      throw new Error("WinstonLoggerAdapter requer instancia do Winston");
    }
    this.logger = winstonInstance;
  }

  info(message, meta = {}) {
    this.logger.info(message, meta);
  }

  warn(message, meta = {}) {
    this.logger.warn(message, meta);
  }

  error(message, error = {}) {
    const meta =
      error instanceof Error
        ? { errorMessage: error.message, stack: error.stack }
        : error;
    this.logger.error(message, meta);
  }

  debug(message, meta = {}) {
    this.logger.debug(message, meta);
  }
}

module.exports = WinstonLoggerAdapter;
