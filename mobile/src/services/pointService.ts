import apiService from "./apiService";
import { AxiosResponse, AxiosError } from "axios";

const api = apiService();

interface SucessFuncPoint {
  (response: AxiosResponse<Point>): void;
}

interface SucessFuncPointFilter {
  (response: AxiosResponse<PointFilter[]>): void;
}

interface FailFunc {
  (response: AxiosError): void;
}

interface Data {
  point: {
    id: number;
    image: string;
    name: string;
    email: string;
    whatsapp: string;
    uf: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  items: {
    title: string;
  }[];
}

interface PointFilter {
  id: number;
  image: string;
  name: string;
  email: string;
  whatsapp: string;
  uf: string;
  city: string;
  latitude: number;
  longitude: number;
}

const pointService = {
  getPoint: (id: number, success: SucessFuncPoint, fail?: FailFunc) => {
    api
      .get<Data>(`/points/${id}`)
      .then((response) => success(response))
      .catch((error) => {
        alert(error);
        if (fail !== undefined) fail(error);
      });
  },
  getPointsColeta: (
    params: any,
    success: SucessFuncPointFilter,
    fail?: FailFunc
  ) => {
    api
      .get("/points", { params })
      .then((response) => success(response))
      .catch((error) => {
        alert(error);
        if (fail !== undefined) fail(error);
      });
  },
};

export default pointService;
