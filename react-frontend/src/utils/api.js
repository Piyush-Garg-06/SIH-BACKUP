const API_BASE_URL = 'http://localhost:5000/api'; // Backend server URL

const handleResponse = async (response) => {
  console.log('API Response:', response.status, response.statusText);
  
  // For successful responses with no content (204), return null or empty object
  if (response.status === 204) {
    return {};
  }
  
  // For non-2xx responses, throw an error
  if (!response.ok) {
    // Handle HTTP errors (non-2xx statuses)
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      // If parsing JSON fails, use text or default message
      try {
        errorData = { message: await response.text() };
      } catch (e2) {
        errorData = { message: response.statusText };
      }
    }
    
    const error = new Error(errorData.message || 'Something went wrong');
    error.response = response; // Attach the original response for more details
    error.data = errorData; // Attach parsed error data
    throw error;
  }
  
  // Check if response is PDF (for health card download)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/pdf')) {
    return await response.blob();
  }
  
  // For 2xx responses, try to parse JSON
  try {
    const data = await response.json();
    console.log('API Data:', data);
    return data;
  } catch (e) {
    // If parsing JSON fails for a successful response, return empty object
    console.warn('Failed to parse JSON response, returning empty object');
    return {};
  }
};

const api = {
  get: async (url, config = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
    if (token) {
      headers['x-auth-token'] = token;
    }

    console.log('Making GET request to:', `${API_BASE_URL}${url}`);
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers,
      ...config,
    });
    return handleResponse(response);
  },

  post: async (url, data, config = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      ...config.headers,
    };

    // If data is FormData, fetch will automatically set Content-Type to multipart/form-data
    // Otherwise, default to application/json
    if (!(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['x-auth-token'] = token;
    }

    console.log('Making POST request to:', `${API_BASE_URL}${url}`);
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers,
      body: data instanceof FormData ? data : JSON.stringify(data),
      ...config,
    });
    return handleResponse(response);
  },

  put: async (url, data, config = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
    if (token) {
      headers['x-auth-token'] = token;
    }

    console.log('Making PUT request to:', `${API_BASE_URL}${url}`);
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
      ...config,
    });
    return handleResponse(response);
  },

  delete: async (url, config = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
    if (token) {
      headers['x-auth-token'] = token;
    }

    console.log('Making DELETE request to:', `${API_BASE_URL}${url}`);
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers,
      ...config,
    });
    return handleResponse(response);
  },
};

// Mimic response interceptor for 401 errors
const originalHandleResponse = api.get; // Store original for re-use if needed
api.get = async (...args) => {
  try {
    return await originalHandleResponse(...args);
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw error;
  }
};

const originalPost = api.post;
api.post = async (...args) => {
  try {
    return await originalPost(...args);
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw error;
  }
};

const originalPut = api.put;
api.put = async (...args) => {
  try {
    return await originalPut(...args);
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw error;
  }
};

const originalDelete = api.delete;
api.delete = async (...args) => {
  try {
    return await originalDelete(...args);
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw error;
  }
};

export default api;