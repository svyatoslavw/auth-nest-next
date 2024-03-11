import { ZodValidationPipe } from "@/utils/zod-validation.pipe"
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UsePipes
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Request, Response } from "express"
import { AuthService } from "./auth.service"
import {
  ConfirmationDto,
  EmailLoginDto,
  RegisterDto,
  confirmationDto,
  emailLoginDto,
  registerDto
} from "./dto/auth.dto"
import { GoogleGuard } from "./guards/google.guard"

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtServise: JwtService
  ) {}

  @UsePipes(new ZodValidationPipe(registerDto))
  @HttpCode(200)
  @Post("register")
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.register(dto)
    this.authService.addRefreshToken(res, refreshToken)

    return response
  }

  @UsePipes(new ZodValidationPipe(confirmationDto))
  @HttpCode(200)
  @Post("confirmation-email")
  async confirmation(@Body() dto: ConfirmationDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.loginOrEmailConfirmation(dto)

    if ("refreshToken" in result) {
      const { refreshToken, ...response } = result
      this.authService.addRefreshToken(res, refreshToken)

      return response
    } else {
      return result
    }
  }

  @HttpCode(200)
  @Post("confirmation-phone")
  async phoneConfirmation(@Body("credential") credential: string) {
    return this.authService.phoneConfirmation(credential)
  }

  @UsePipes(new ZodValidationPipe(emailLoginDto))
  @HttpCode(200)
  @Post("login")
  async EmailLogin(@Body() dto: EmailLoginDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.login(dto)
    this.authService.addRefreshToken(res, refreshToken)

    return response
  }

  @UseGuards(GoogleGuard)
  @Get("google-init")
  async googleLogin(@Req() req: Request, @Res() res: Response) {
    return { message: "Google Auth" }
  }
  @UseGuards(GoogleGuard)
  @Get("google-login")
  async googleRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user
    //@ts-ignore
    const tokens = await this.authService.issueTokens(user.id)

    res.cookie("accessToken", tokens.accessToken, {
      sameSite: "strict",
      secure: false,
      httpOnly: false
    })
    this.authService.addRefreshToken(res, tokens.refreshToken)

    res.redirect("http://localhost:3000")
  }

  @HttpCode(200)
  @Post("login/access-token")
  async getNewTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const tokenFromCookies = req.cookies[this.authService.REFRESH_TOKEN]

    if (!tokenFromCookies) {
      this.authService.removeRefreshToken(res)
      throw new UnauthorizedException("Refresh token not passed")
    }

    const { refreshToken, ...response } = await this.authService.getNewTokens(tokenFromCookies)

    this.authService.addRefreshToken(res, refreshToken)

    return response
  }

  @HttpCode(200)
  @Post("logout")
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshToken(res)
    return true
  }
}
