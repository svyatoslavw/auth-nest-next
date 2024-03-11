import { axiosWithToken } from "../api.interceptor"

export const userService = {
  async getProfile() {
    const response = await axiosWithToken.get<IUser>("user/profile")
    return response.data
  }
}
