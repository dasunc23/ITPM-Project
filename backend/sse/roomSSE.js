// Store all active SSE clients
// Key: roomCode, Value: array of response objects
const roomClients = {};

// ─── Add a client to a room ───────────────────────
const addClient = (roomCode, res) => {
  const code = roomCode.toUpperCase();
  if (!roomClients[code]) {
    roomClients[code] = [];
  }
  roomClients[code].push(res);
};

// ─── Remove a client from a room ─────────────────
const removeClient = (roomCode, res) => {
  const code = roomCode.toUpperCase();
  if (!roomClients[code]) return;
  roomClients[code] = roomClients[code].filter(client => client !== res);

  // Clean up empty rooms
  if (roomClients[code].length === 0) {
    delete roomClients[code];
  }
};

// ─── Broadcast to all clients in a room ──────────
const broadcastToRoom = (roomCode, data) => {
  const code = roomCode.toUpperCase();
  if (!roomClients[code]) return;
  const message = `data: ${JSON.stringify(data)}\n\n`;
  roomClients[code].forEach(client => client.write(message));
};

// ─── SSE Route Handler ────────────────────────────
const roomSSEHandler = (req, res) => {
  const { roomCode } = req.params;
  const code = roomCode.toUpperCase();

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  // Send initial connection confirmation
  res.write(`data: ${JSON.stringify({ type: 'connected', message: 'SSE Connected', roomCode: code })}\n\n`);

  // Add this client to the room
  addClient(code, res);

  // Remove client when connection closes
  req.on('close', () => {
    removeClient(code, res);
  });
};

export { roomSSEHandler, broadcastToRoom };   