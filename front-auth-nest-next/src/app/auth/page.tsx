import { FormContainer } from "./components/FormContainer/FormContainer"
import { StageProvider } from "./contexts/useStage/useStage"

export default function Auth() {
  return (
    <StageProvider>
      <FormContainer />
    </StageProvider>
  )
}
