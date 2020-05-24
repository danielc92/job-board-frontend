import axios from "axios"

// Documentation here https://github.com/axios/axios

export const api = axios.create({
  baseURL: process.env.REACT_APP_REST_API_BASE_URL,
  timeout: 3000,
})
