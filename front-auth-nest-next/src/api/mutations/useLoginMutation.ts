import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { AxiosResponse } from "axios"

import { authService } from "../services/auth.service"

type TEmailLoginMutation = UseMutationOptions<
  AxiosResponse<IAuthTokenResponse, any>,
  any,
  IAuthEmailLoginForm,
  unknown
>

export const useLoginMutation = (settings?: TEmailLoginMutation) =>
  useMutation({
    mutationKey: ["email login"],
    mutationFn: (data: IAuthEmailLoginForm) => authService.login(data),
    ...settings
  })
