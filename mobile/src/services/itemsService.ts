import apiService from "./apiService";
import { AxiosResponse, AxiosError } from "axios";

const api = apiService();

interface SucessFunc {
  (response: AxiosResponse<Item[]>): void;
}

interface FailFunc {
  (response: AxiosError): void;
}

interface Item {
  id: number;
  title: string;
  image_url: string;
}

const itemsService = {
  getItems: (success: SucessFunc, fail?: FailFunc) => {
    api
      .get<Item[]>("/items")
      .then((response) => success(response))
      .catch((error) => {
        alert(error);
        if (fail !== undefined) fail(error);
      });
  },
};

export default itemsService;
