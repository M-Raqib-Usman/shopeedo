const API_BASE_URL = 'http://localhost:5000/api';

export const getRestaurants = async () => {
  const response = await fetch(`${API_BASE_URL}/restaurants`);
  if (!response.ok) throw new Error('Failed to fetch restaurants');
  return response.json();
};

export const getRestaurantById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/restaurant/${id}`);
  if (!response.ok) throw new Error('Failed to fetch restaurant details');
  return response.json();
};

export const placeOrder = async (orderData) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to place order');
  }
  return response.json();
};

export const getCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/menu/categories`);
  return response.json();
};

export const getMenuByCategory = async (categoryName) => {
  const response = await fetch(`${API_BASE_URL}/menu/category/${encodeURIComponent(categoryName)}`);
  return response.json();
};

export const getUserOrders = async (email) => {
  const response = await fetch(`${API_BASE_URL}/orders/user/${email}`);
  if (!response.ok) throw new Error('Failed to fetch orders');
  return response.json();
};

export const updateProfile = async (profileData) => {
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData),
  });
  return response.json();
};

export const rateOrder = async (orderId, rating) => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/rate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating }),
  });
  return response.json();
};

export const getPaymentMethods = async (email) => {
  const response = await fetch(`${API_BASE_URL}/payments/${email}`);
  if (!response.ok) throw new Error('Failed to fetch payment methods');
  return response.json();
};

export const addPaymentMethod = async (paymentData) => {
  const response = await fetch(`${API_BASE_URL}/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData),
  });
  return response.json();
};

export const deletePaymentMethod = async (id) => {
  const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};