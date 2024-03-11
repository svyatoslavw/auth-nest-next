import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { AxiosResponse } from "axios"

import { authService } from "../services/auth.service"

type TPhoneConfirmationMutation = UseMutationOptions<
  AxiosResponse<IAuthMessageResponse, any>,
  any,
  IAuthPhoneConfirmationForm,
  unknown
>

export const usePhoneConfirmationMutation = (settings?: TPhoneConfirmationMutation) =>
  useMutation({
    mutationKey: ["phone confirmation"],
    mutationFn: (data: IAuthPhoneConfirmationForm) => authService.phoneConfirmation(data),
    ...settings
  })
