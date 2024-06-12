import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { AxiosResponse } from "axios"

import { authService } from "../services/auth.service"
import { useRouter } from "next/navigation"

type TEmailLoginMutation = UseMutationOptions<AxiosResponse<boolean, any>, any, any, unknown>

export const useLogoutMutation = (settings?: TEmailLoginMutation) => {
  const { push } = useRouter()

  return useMutation({
    mutationKey: ["logout"],
    mutationFn: () => authService.logout(),
    onSuccess() {
      push("/")
    },
    ...settings
  })
}
