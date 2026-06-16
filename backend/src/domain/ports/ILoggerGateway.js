class ILoggerGateway {
  info(message, meta = {}) {
    throw new Error("ILoggerGateway.info deve ser implementado");
  }

  warn(message, meta = {}) {
    throw new Error("ILoggerGateway.warn deve ser implementado");
  }

  error(message, error = {}) {
    throw new Error("ILoggerGateway.error deve ser implementado");
  }

  debug(message, meta = {}) {
    throw new Error("ILoggerGateway.debug deve ser implementado");
  }
}
module.exports = ILoggerGateway;
