import { getAuthHeaders } from "../config/auth";

const API_BASE_URL = "https://travel-mate-backend-jbxi.onrender.com/api";

export const userAPI = {
  // Get user profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch profile");
    }

    return response.json();
  },

  // Update user profile
  updateProfile: async (data) => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update profile");
    }

    return response.json();
  },

  // Get user logs
  getUserLogs: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${API_BASE_URL}/users/logs?${queryParams}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch logs");
    }

    return response.json();
  },

  // Get liked places
  getLikedPlaces: async () => {
    const response = await fetch(`${API_BASE_URL}/users/liked-places`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch liked places");
    }

    return response.json();
  },

  // Like/Rate a place
  likePlace: async (placeId, rating) => {
    const response = await fetch(`${API_BASE_URL}/users/liked-places`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ placeId, rating }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to rate place");
    }

    return response.json();
  },

  // Unlike a place
  unlikePlace: async (placeId) => {
    const response = await fetch(
      `${API_BASE_URL}/users/liked-places/${placeId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to unlike place");
    }

    return response.json();
  },
};
