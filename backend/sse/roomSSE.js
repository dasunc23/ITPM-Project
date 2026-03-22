// Store all active SSE clients
// Key: roomCode, Value: array of response objects
const roomClients = {};

// ─── Add a client to a room ───────────────────────
const addClient = (roomCode, res) => {
  if (!roomClients[roomCode]) {
    roomClients[roomCode] = [];
  }
  roomClients[roomCode].push(res);
};

// ─── Remove a client from a room ─────────────────
const removeClient = (roomCode, res) => {
  if (!roomClients[roomCode]) return;
  roomClients[roomCode] = roomClients[roomCode].filter(client => client !== res);

  // Clean up empty rooms
  if (roomClients[roomCode].length === 0) {
    delete roomClients[roomCode];
  }
};

// ─── Broadcast to all clients in a room ──────────
const broadcastToRoom = (roomCode, data) => {
  if (!roomClients[roomCode]) return;
  const message = `data: ${JSON.stringify(data)}\n\n`;
  roomClients[roomCode].forEach(client => client.write(message));
};

// ─── SSE Route Handler ────────────────────────────
const roomSSEHandler = (req, res) => {
  const { roomCode } = req.params;

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  // Send initial connection confirmation
  res.write(`data: ${JSON.stringify({ type: 'connected', message: 'SSE Connected' })}\n\n`);

  // Add this client to the room
  addClient(roomCode, res);

  // Remove client when connection closes
  req.on('close', () => {
    removeClient(roomCode, res);
  });
};

export { roomSSEHandler, broadcastToRoom };   