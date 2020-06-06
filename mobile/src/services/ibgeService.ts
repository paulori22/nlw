import apiService from "./apiService";
import { AxiosResponse, AxiosError } from "axios";

//https://servicodados.ibge.gov.br/api/v1/localidades/estados
//https://servicodados.ibge.gov.br/api/v1/localidades/estados/{UF}/municipios

interface SucessFuncUF {
  (response: AxiosResponse<IBGEUFResponse[]>): void;
}
interface SucessFuncCity {
  (response: AxiosResponse<IBGECityResponse[]>): void;
}

interface FailFunc {
  (response: AxiosError): void;
}

interface IBGEUFResponse {
  id: number;
  sigla: string;
  nome: string;
  regiao: {
    id: number;
    sigla: string;
    nome: string;
  };
}

interface IBGECityResponse {
  id: number;
  nome: string;
  microrregiao: {
    id: number;
    nome: string;
    mesorregiao: {
      id: number;
      nome: string;
      UF: {
        id: number;
        sigla: string;
        nome: string;
        regiao: {
          id: number;
          sigla: string;
          nome: string;
        };
      };
    };
  };
}

const api = apiService({
  baseURL: "https://servicodados.ibge.gov.br/api/v1/localidades",
});

const ibgeService = {
  ufs: (success: SucessFuncUF, fail?: FailFunc) => {
    api
      .get<IBGEUFResponse[]>("/estados?orderBy=nome")
      .then((response) => success(response))
      .catch((error) => {
        alert(error);
        if (fail !== undefined) fail(error);
      });
  },
  citiesUF: (uf: string, success: SucessFuncCity, fail?: FailFunc) => {
    api
      .get<IBGECityResponse[]>(`/estados/${uf}/municipios`)
      .then((response) => success(response))
      .catch((error) => {
        alert(error);
        if (fail !== undefined) fail(error);
      });
  },
};

export default ibgeService;
