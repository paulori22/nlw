import apiService from "./apiService";
import { AxiosResponse, AxiosError } from "axios";

const api = apiService();

interface SucessFunc {
  (response: AxiosResponse): void;
}

interface FailFunc {
  (response: AxiosError): void;
}

interface Point {
  name: string;
  email: string;
  whatsapp: string;
  uf: string;
  city: string;
  latitude: number;
  longitude: number;
  items: Array<number>;
}

const pointService = {
  registerPoint: (data: Point, success: SucessFunc, fail?: FailFunc) => {
    api
      .post("/points", data)
      .then((response) => success(response))
      .catch((error) => {
        alert(error);
        if (fail !== undefined) fail(error);
      });
  },
};

export default pointService;
