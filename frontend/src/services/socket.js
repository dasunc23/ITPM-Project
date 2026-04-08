const listeners = new Map();

const mockSocket = {
  connected: false,
  connect() {
    this.connected = true;
  },
  disconnect() {
    this.connected = false;
  },
  emit(eventName, payload) {
    const handlers = listeners.get(eventName) || [];
    handlers.forEach((handler) => handler(payload));
  },
  on(eventName, handler) {
    const handlers = listeners.get(eventName) || [];
    listeners.set(eventName, [...handlers, handler]);
  },
  off(eventName, handler) {
    const handlers = listeners.get(eventName) || [];
    listeners.set(
      eventName,
      handlers.filter((item) => item !== handler),
    );
  },
};

export const getSocket = () => {
  if (!mockSocket.connected) {
    mockSocket.connect();
  }

  return mockSocket;
};

export const disconnectSocket = () => {
  mockSocket.disconnect();
};
