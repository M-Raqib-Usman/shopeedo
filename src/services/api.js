const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    // Fallback for demo when backend is off
    throw error;
  }
};

// Get all restaurants
export const getRestaurants = async () => {
  return apiCall('/restaurants');
};

// Get single restaurant with menu
export const getRestaurantById = async (id) => {
  return apiCall(`/restaurant/${id}`);
};

// Place new order
export const placeOrder = async (orderData) => {
  return apiCall('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
};

// For future use
export const searchRestaurants = async (query) => {
  return apiCall(`/restaurants?search=${query}`);
};