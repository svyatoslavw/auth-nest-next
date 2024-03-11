import { useEmailConfirmationMutation } from "@/api/mutations/useEmailConfirmationMutation"
import { usePhoneConfirmationMutation } from "@/api/mutations/usePhoneConfirmationMutation"
import { setValuesToLS } from "@/api/services/auth-storage.service"
import { useStage } from "@/app/auth/contexts/useStage/useStage"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckedState } from "@radix-ui/react-checkbox"
import React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export const selectConfirmationPhoneSchema = z.object({
  credential: z.string()
})

export const selectConfirmationEmailSchema = z.object({
  credential: z.string().email()
})

const useSetConfirmationForm = () => {
  const { setStage } = useStage()

  const [formStage, setFormStage] = React.useState<"select" | "confirm">("select")
  const [credential, setCredential] = React.useState<"phone" | "email">("phone")
  const [checked, setChecked] = React.useState<CheckedState>(false)

  const onSelectContinue = () => setFormStage("confirm")

  const selectConfirmationForm = useForm<IAuthPhoneConfirmationForm>({
    resolver: zodResolver(
      credential === "email" ? selectConfirmationEmailSchema : selectConfirmationPhoneSchema
    )
  })
  const { mutate: mutateEmail, isPending: loadingEmail } = useEmailConfirmationMutation({
    onSuccess() {
      setStage("confirmation")
    }
  })
  const { mutate: mutatePhone, isPending: loadingPhone } = usePhoneConfirmationMutation({
    onSuccess() {
      setStage("confirmation")
    }
  })

  const onFormBack = () => {
    selectConfirmationForm.reset()
    setFormStage("select")
  }
  const onSubmit = selectConfirmationForm.handleSubmit(async (values) => {
    console.log("@", values)
    setValuesToLS("values", values.credential)
    if (credential === "email") {
      mutateEmail(values)
    } else {
      mutatePhone(values)
    }
  })

  return {
    form: selectConfirmationForm,
    state: {
      checked,
      credential,
      formStage,
      loading: loadingEmail || loadingPhone
    },
    functions: { setChecked, setCredential, onSelectContinue, onFormBack, onSubmit }
  }
}

export { useSetConfirmationForm }
