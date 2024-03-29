import axios, { CreateAxiosDefaults } from "axios"

import { errorCatch } from "./api.error"
import { getAccessToken, removeCookiesFromStorage } from "./services/auth-token.service"
import { authService } from "./services/auth.service"

const options: CreateAxiosDefaults = {
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": true
  },
  withCredentials: true
}

const axiosClassic = axios.create(options)
const axiosWithToken = axios.create(options)

axiosWithToken.interceptors.request.use((config) => {
  const accessToken = getAccessToken()

  if (config?.headers && accessToken) config.headers.Authorization = `Bearer ${accessToken}`

  return config
})

axiosWithToken.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config

    if (
      (error?.response?.status === 401 ||
        errorCatch(error) === "jwt expired" ||
        errorCatch(error) === "jwt must be provided") &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true
      try {
        await authService.getNewTokens()
        return axiosWithToken.request(originalRequest)
      } catch (error) {
        if (errorCatch(error) === "jwt expired") removeCookiesFromStorage()
      }
    }

    throw error
  }
)

export { axiosClassic, axiosWithToken }
