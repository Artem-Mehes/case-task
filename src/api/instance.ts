import axios from 'axios';

const BASE_URL = 'https://api.wisey.app/api/v1/';

export const apiInstance = axios.create({
  baseURL: BASE_URL,
});

apiInstance.interceptors.response.use((response) => {
  return response.data;
});

// TODO: handle error
apiInstance.interceptors.request.use(async (config) => {
  try {
    const response = await axios.get(
      `${BASE_URL}auth/anonymous?platform=subscriptions`
    );
    if (response.data.token) {
      config.headers.Authorization = `Bearer ${response.data.token}`;
    }
  } catch (e) {
    console.error(e);
  }

  return config;
});
