// Serveur Socket.IO minimal pour la communication temps réel
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('Client connecté à Socket.IO');

  // Pour test : écouter un ajout de produit
  socket.on('product:add', (product) => {
    // Diffuse à tous les clients sauf l'émetteur
    socket.broadcast.emit('product:new', product);
  });
});

const PORT = process.env.REALTIME_PORT || 4001;
server.listen(PORT, () => {
  console.log('Socket.IO server running on port', PORT);
});
