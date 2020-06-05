import axios, { AxiosRequestConfig } from "axios";

const apiService = (config?: AxiosRequestConfig) => {
  const baseURL = "http://localhost:3333";
  return axios.create({ baseURL, ...config });
};

export default apiService;
