import { io } from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  connect(userId) {
    // Get the base URL from the API service
    const apiUrl = 'http://localhost:5000';
    
    // Create socket connection
    this.socket = io(apiUrl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      timeout: 10000
    });

    // Handle connection events
    this.socket.on('connect', () => {
      console.log('WebSocket connected:', this.socket.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Authenticate the user
      if (userId) {
        this.socket.emit('authenticate', userId);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.isConnected = false;
      
      // Try to reconnect if it's not a manual disconnect
      if (reason === 'io server disconnect') {
        // The disconnection was initiated by the server, you need to reconnect manually
        this.reconnect(userId);
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.isConnected = false;
    });

    // Handle disease alerts
    this.socket.on('diseaseAlert', (data) => {
      console.log('Received disease alert:', data);
      // Dispatch custom event for components to listen to
      window.dispatchEvent(new CustomEvent('diseaseAlertReceived', { detail: data }));
    });

    // Handle unread alerts
    this.socket.on('unreadAlerts', (data) => {
      console.log('Received unread alerts:', data);
      // Dispatch custom event for components to listen to
      window.dispatchEvent(new CustomEvent('unreadAlertsReceived', { detail: data }));
    });

    // Handle alert resolution
    this.socket.on('alertResolved', (data) => {
      console.log('Alert resolved:', data);
      // Dispatch custom event for components to listen to
      window.dispatchEvent(new CustomEvent('alertResolved', { detail: data }));
    });

    return this.socket;
  }

  reconnect(userId) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnection attempt ${this.reconnectAttempts}`);
        this.connect(userId);
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }

  authenticate(userId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('authenticate', userId);
    }
  }

  // Listen for disease alerts
  onDiseaseAlert(callback) {
    const handler = (event) => callback(event.detail);
    window.addEventListener('diseaseAlertReceived', handler);
    return () => window.removeEventListener('diseaseAlertReceived', handler);
  }

  // Listen for unread alerts
  onUnreadAlerts(callback) {
    const handler = (event) => callback(event.detail);
    window.addEventListener('unreadAlertsReceived', handler);
    return () => window.removeEventListener('unreadAlertsReceived', handler);
  }

  // Listen for resolved alerts
  onAlertResolved(callback) {
    const handler = (event) => callback(event.detail);
    window.addEventListener('alertResolved', handler);
    return () => window.removeEventListener('alertResolved', handler);
  }

  // Send a message (if needed)
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Cannot emit event, socket not connected');
    }
  }
}

// Export a singleton instance
export default new WebSocketService();