import { useEmailConfirmationMutation } from "@/api/mutations/useEmailConfirmationMutation"
import { useLoginMutation } from "@/api/mutations/useLoginMutation"
import { usePhoneConfirmationMutation } from "@/api/mutations/usePhoneConfirmationMutation"
import { getValuesFromLS, removeValuesFromLS } from "@/api/services/auth-storage.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

export const ConfirmationSchema = z.object({
  credential: z.string(),
  code: z.string().min(6, "Please enter your code")
})

const useConfirmationForm = () => {
  const { push } = useRouter()

  const countDownRef = React.useRef<NodeJS.Timeout>()
  const [seconds, setSeconds] = React.useState(20)

  React.useEffect(() => {
    if (!seconds) return
    countDownRef.current = setInterval(() => setSeconds((seconds) => seconds - 1), 1000)
    return () => clearInterval(countDownRef.current)
  }, [!!seconds])

  React.useEffect(() => {
    if (!seconds) clearInterval(countDownRef.current)
  }, [seconds])

  const confirmationForm = useForm<IAuthEmailLoginForm>({
    resolver: zodResolver(ConfirmationSchema),
    defaultValues: {
      credential: getValuesFromLS("values") || "",
      code: ""
    }
  })

  const { mutate, isPending } = useLoginMutation({
    onSuccess() {
      removeValuesFromLS("values")
      push("/")
      toast.success("Successfully login!", { cancel: { label: "Close" } })
    }
  })

  const { mutate: mutateEmail, isPending: loadingEmail } = useEmailConfirmationMutation()
  const { mutate: mutatePhone, isPending: loadingPhone } = usePhoneConfirmationMutation()

  const onSubmit = confirmationForm.handleSubmit((values: IAuthEmailLoginForm) => {
    mutate(values)
    console.log("@values", values)
  })

  const onConfirmation = () => {
    const values = getValuesFromLS("values")
    values && values.startsWith("+")
      ? mutatePhone({ credential: values })
      : mutateEmail({ credential: values || "" })
  }

  return {
    state: {
      loading: isPending || loadingEmail || loadingPhone,
      seconds
    },
    form: confirmationForm,
    functions: { onSubmit, onConfirmation }
  }
}

export { useConfirmationForm }
