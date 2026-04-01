const API_BASE_URL = 'http://localhost:5000/api';

export const getRestaurants = async () => {
  const response = await fetch(`${API_BASE_URL}/restaurants`);
  return response.json();
};

export const getRestaurantById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/restaurant/${id}`);
  return response.json();
};

export const placeOrder = async (orderData) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  return response.json();
};