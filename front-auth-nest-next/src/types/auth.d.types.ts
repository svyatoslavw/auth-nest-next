interface IAuthEmailLoginForm {
  credential: string
  code: string
}

interface IAuthPhoneLoginForm {
  credential: string
  code: string
}

interface IAuthPhoneConfirmationForm {
  credential: string
}

interface IAuthEmailConfirmationForm {
  credential: string
  password?: string
}

interface IAuthRegisterForm {
  email: string
  login: string
  phone: string
  password: string
}

interface IAuthTokenResponse {
  accessToken: string
  user: IUser
}

interface IAuthMessageResponse {
  message: string
}

interface IAuthCodeResponse {
  code: string
  expiration: Date
}

type TAuthResponse = IAuthTokenResponse | IAuthMessageResponse

interface IUser {
  id: string

  login: string
  email: string
  phone: string

  code?: string
  codeExpiration?: string
}
