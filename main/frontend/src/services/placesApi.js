const API_BASE_URL = "https://travel-mate-backend-jbxi.onrender.com/api";

export const placesAPI = {
  // Get top 10 places by visitors (for dashboard bar chart)
  getTopPlaces: async (params = {}) => {
    const { country, category } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("topOnly", "true"); // Flag to get top 10

    if (country) queryParams.append("country", country);
    if (category) queryParams.append("category", category);

    try {
      const response = await fetch(`${API_BASE_URL}/places?${queryParams}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch top places");
      }
      const result = await response.json();
      return result.data || []; // Return data array or empty array
    } catch (error) {
      console.error("getTopPlaces error:", error);
      throw error;
    }
  },

  // Get ALL places (for dashboard stats)
  getAllPlaces: async (params = {}) => {
    const { country, category } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("page", 1);
    queryParams.append("limit", 50000); // High limit to get all records

    if (country) queryParams.append("country", country);
    if (category) queryParams.append("category", category);

    try {
      const response = await fetch(`${API_BASE_URL}/places?${queryParams}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch places");
      }
      const result = await response.json();
      return result.data || []; // Return data array or empty array
    } catch (error) {
      console.error("getAllPlaces error:", error);
      throw error;
    }
  },

  // Get places with pagination and ALL filters (for DataTable)
  getPlaces: async (params = {}) => {
    const {
      page = 1,
      limit = 10,
      location,
      country,
      category,
      visitors,
      rating,
      accommodation_available,
      address,
      search,
      sortBy,
      sortOrder,
    } = params;

    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("limit", limit);

    if (location) queryParams.append("location", location);
    if (country) queryParams.append("country", country);
    if (category) queryParams.append("category", category);
    if (visitors) queryParams.append("visitors", visitors);
    if (rating) queryParams.append("rating", rating);
    if (accommodation_available)
      queryParams.append("accommodation_available", accommodation_available);
    if (address) queryParams.append("address", address);
    if (search) queryParams.append("search", search);
    if (sortBy) queryParams.append("sortBy", sortBy);
    if (sortOrder) queryParams.append("sortOrder", sortOrder);

    const response = await fetch(`${API_BASE_URL}/places?${queryParams}`);
    if (!response.ok) {
      throw new Error("Failed to fetch places");
    }
    return response.json();
  },

  // Get filter options for ALL columns
  getFilters: async () => {
    const response = await fetch(`${API_BASE_URL}/places/filters`);
    if (!response.ok) {
      throw new Error("Failed to fetch filters");
    }
    return response.json();
  },

  // Get statistics
  getStats: async (params = {}) => {
    const { country, category } = params;
    const queryParams = new URLSearchParams();

    if (country) queryParams.append("country", country);
    if (category) queryParams.append("category", category);

    try {
      console.log("Fetching stats with params:", params);
      const url = `${API_BASE_URL}/places/stats?${queryParams}`;
      console.log("Stats URL:", url);

      const response = await fetch(url);
      const data = await response.json();

      console.log("Stats response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch statistics");
      }

      return data;
    } catch (error) {
      console.error("getStats error:", error);
      throw error;
    }
  },
};
