import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { AxiosResponse } from "axios"

import { authService } from "../services/auth.service"

type TRegisterMutation = UseMutationOptions<
  AxiosResponse<IAuthTokenResponse, any>,
  any,
  IAuthRegisterForm,
  unknown
>

export const useRegisterMutation = (settings?: TRegisterMutation) =>
  useMutation({
    mutationKey: ["phone confirmation"],
    mutationFn: (data: IAuthRegisterForm) => authService.register(data),
    ...settings
  })
