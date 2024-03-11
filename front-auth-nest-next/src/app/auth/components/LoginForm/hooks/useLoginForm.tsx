import { useEmailConfirmationMutation } from "@/api/mutations/useEmailConfirmationMutation"
import { removeValuesFromLS, setValuesToLS } from "@/api/services/auth-storage.service"
import { useStage } from "@/app/auth/contexts/useStage/useStage"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

export const LoginEmailSchema = z.object({
  credential: z.string().email({ message: "Invalid email address" })
})

export const LoginPasswordSchema = z.object({
  credential: z.string(),
  password: z.string().min(8, "Please enter your password")
})

export const useLoginForm = () => {
  const { setStage } = useStage()
  const { push } = useRouter()
  const [credential, setCredential] = React.useState<"login" | "email">("login")

  const loginForm = useForm<IAuthEmailConfirmationForm>({
    resolver: zodResolver(credential === "email" ? LoginEmailSchema : LoginPasswordSchema),
    defaultValues: {
      credential: "",
      password: ""
    }
  })

  const { mutate, isPending } = useEmailConfirmationMutation({
    onSuccess({ data }) {
      if ("accessToken" in data) {
        removeValuesFromLS("values")
        push("/")
        toast.success("Successfully login!", { cancel: { label: "Close" } })
      } else {
        credential === "email" ? setStage("confirmation") : setStage("setConfirmation")
        loginForm.reset()
        toast.warning("Verify your account!", { cancel: { label: "Close" } })
      }
    }
  })

  const login = loginForm.watch("credential")

  React.useEffect(() => {
    const email = z.string().email()
    const isEmail = email.safeParse(login)

    setCredential(isEmail.success ? "email" : "login")
  }, [login])

  const onSubmit = loginForm.handleSubmit((values: IAuthEmailConfirmationForm) => {
    console.log("@", values)
    setValuesToLS("values", values.credential)
    mutate(values)
  })

  const onSignup = () => setStage("register")

  return {
    state: {
      loading: isPending,
      isEmail: credential === "email"
    },
    form: loginForm,
    functions: { onSubmit, onSignup }
  }
}
