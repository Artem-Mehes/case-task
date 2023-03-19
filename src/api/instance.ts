import axios from 'axios';

const BASE_URL = 'https://api.wisey.app/api/v1/';

export const apiInstance = axios.create({
  baseURL: BASE_URL,
});

apiInstance.interceptors.response.use((response) => response.data);

apiInstance.interceptors.request.use(async (config) => {
  try {
    const response = await axios.get(
      `${BASE_URL}auth/anonymous?platform=subscriptions`
    );

    config.headers.Authorization = `Bearer ${response.data.token}`;
  } catch (error) {
    throw new Error(
      `${error instanceof Error && `${error.message}: `}Error getting token`
    );
  }

  return config;
});
