const { Server } = require('socket.io');

let ioInstance = null;

function initSocketServer(httpServer, options = {}) {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: options.corsOrigin || '*',
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
  });

  ioInstance.on('connection', (socket) => {
    console.log(`[Socket] Cliente conectado: ${socket.id}`);

    socket.on('register', (userId) => {
      if (userId) socket.join(`user:${userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Cliente desconectado: ${socket.id}`);
    });
  });

  return ioInstance;
}

function getIo() {
  if (!ioInstance) {
    throw new Error('Socket.io nao foi inicializado. Chame initSocketServer antes.');
  }
  return ioInstance;
}

module.exports = { initSocketServer, getIo };