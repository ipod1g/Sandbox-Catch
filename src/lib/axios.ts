import Axios from "axios";

import { API_URL } from "@/config";

export const instance = Axios.create({
  baseURL: API_URL,
});

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);
