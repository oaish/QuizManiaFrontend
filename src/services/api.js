const API_URL = import.meta.env.VITE_API_URL || 'https://quizmaniabackend-u50q.onrender.com/api';

/**
 * Perform generic API requests using standard fetch
 * Features: Automatic JWT token attachments and unified error parsing
 */
class ApiService {
  constructor() {
    this.baseUrl = API_URL;
  }

  // Get active token from localStorage
  getToken() {
    return localStorage.getItem('quizmania_jwt_token');
  }

  // Build standard request headers
  getHeaders(customHeaders = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Handle fetch response and parse errors
  async handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
      // Auto logout on token expiration or invalidity
      if (response.status === 401) {
        localStorage.removeItem('quizmania_jwt_token');
        localStorage.removeItem('quizmania_user');
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register') && window.location.pathname !== '/') {
          window.location.href = '/login?expired=true';
        }
      }
      
      const errorMsg = data.message || 'An error occurred during the request.';
      throw new Error(errorMsg);
    }

    return data;
  }

  // GET Request
  async get(endpoint, headers = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(headers),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`API GET error [${endpoint}]:`, error.message);
      throw error;
    }
  }

  // POST Request
  async post(endpoint, body, headers = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(headers),
        body: JSON.stringify(body),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`API POST error [${endpoint}]:`, error.message);
      throw error;
    }
  }

  // PUT Request
  async put(endpoint, body, headers = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(headers),
        body: JSON.stringify(body),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`API PUT error [${endpoint}]:`, error.message);
      throw error;
    }
  }

  // DELETE Request
  async delete(endpoint, headers = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(headers),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`API DELETE error [${endpoint}]:`, error.message);
      throw error;
    }
  }
}

const api = new ApiService();
export default api;
export { API_URL };
