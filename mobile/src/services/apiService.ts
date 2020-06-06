import axios, { AxiosRequestConfig } from "axios";

const apiService = (config?: AxiosRequestConfig) => {
  const baseURL = "http://192.168.15.145:3333";
  return axios.create({ baseURL, ...config });
};

export default apiService;
