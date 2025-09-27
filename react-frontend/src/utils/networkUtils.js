// Network utilities for QR code generation

/**
 * Get the local network IP address for mobile access
 * This is a client-side approximation - actual IP detection requires server-side help
 */
export const getNetworkIP = async () => {
  try {
    // Method 1: Use WebRTC to detect local IP
    const ip = await getLocalIP();
    if (ip && ip !== '127.0.0.1') {
      return ip;
    }
  } catch (error) {
    console.log('WebRTC IP detection failed:', error);
  }

  // Method 2: Common local network IP patterns
  const commonIPs = [
    '192.168.1.',
    '192.168.0.',
    '10.0.0.',
    '172.16.'
  ];

  // Check if current hostname matches a pattern
  const hostname = window.location.hostname;
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return hostname;
  }

  // Method 3: Try to fetch IP from a service
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    // Note: This gives public IP, not local network IP
    return data.ip;
  } catch (error) {
    console.log('External IP detection failed:', error);
  }

  // Fallback to manual configuration message
  return null;
};

/**
 * WebRTC method to detect local IP
 */
const getLocalIP = () => {
  return new Promise((resolve, reject) => {
    // RTCPeerConnection configuration
    const pc = new RTCPeerConnection({
      iceServers: []
    });

    // Create a dummy data channel
    pc.createDataChannel('');

    // Create offer and set local description
    pc.createOffer()
      .then(offer => pc.setLocalDescription(offer))
      .catch(reject);

    // Listen for ICE candidates
    pc.onicecandidate = (ice) => {
      if (!ice || !ice.candidate || !ice.candidate.candidate) return;
      
      const myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate);
      if (myIP) {
        resolve(myIP[1]);
        pc.close();
      }
    };

    // Timeout after 5 seconds
    setTimeout(() => {
      reject(new Error('IP detection timeout'));
      pc.close();
    }, 5000);
  });
};

/**
 * Generate accessible URL for QR codes
 */
export const generateAccessibleURL = async (path, options = {}) => {
  const {
    forceLocalhost = false,
    customIP = null,
    port = window.location.port || '5174'
  } = options;

  // Production URL (from environment)
  if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_PRODUCTION_URL) {
    return `${process.env.REACT_APP_PRODUCTION_URL || window.location.origin}${path}`;
  }

  // Custom public URL (like ngrok)
  if (process.env.REACT_APP_PUBLIC_URL) {
    return `${process.env.REACT_APP_PUBLIC_URL}${path}`;
  }

  // Custom IP override
  if (customIP) {
    return `http://${customIP}:${port}${path}`;
  }

  // Force localhost (for testing)
  if (forceLocalhost) {
    return `${window.location.origin}${path}`;
  }

  // Try to get network IP
  try {
    const networkIP = await getNetworkIP();
    if (networkIP) {
      // Check if it's a local network IP
      if (networkIP.startsWith('192.168.') || 
          networkIP.startsWith('10.') || 
          networkIP.startsWith('172.')) {
        return `http://${networkIP}:${port}${path}`;
      }
    }
  } catch (error) {
    console.log('Network IP detection failed:', error);
  }

  // Fallback to current origin
  return `${window.location.origin}${path}`;
};

/**
 * Validate if URL is accessible for mobile devices
 */
export const validateMobileAccessibleURL = async (url) => {
  try {
    // Simple connectivity test
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'no-cors' // Avoid CORS issues
    });
    return true;
  } catch (error) {
    return false;
  }
};