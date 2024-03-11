import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { AxiosResponse } from "axios"

import { authService } from "../services/auth.service"

type TEmailConfirmationMutation = UseMutationOptions<
  AxiosResponse<TAuthResponse, any>,
  unknown,
  IAuthEmailConfirmationForm,
  unknown
>

export const useEmailConfirmationMutation = (settings?: TEmailConfirmationMutation) =>
  useMutation<AxiosResponse<TAuthResponse, any>, unknown, IAuthEmailConfirmationForm, unknown>({
    mutationKey: ["email confirmation"],
    mutationFn: (data: IAuthEmailConfirmationForm) => authService.emailConfirmation(data),
    ...settings
  })
