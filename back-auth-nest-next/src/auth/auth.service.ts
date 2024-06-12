import { ConfirmationService } from "@/confirmation/confirmation.service"
import { PrismaService } from "@/prisma.service"
import { UserService } from "@/user/user.service"
import { getEmailHtml } from "@/utils/mail-template"
import { MailerService } from "@nestjs-modules/mailer"
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import { User } from "@prisma/client"
import { hash, verify } from "argon2"
import { Response } from "express"
import { TwilioService } from "nestjs-twilio"
import { ConfirmationDto, EmailLoginDto, GoogleDto, RegisterDto } from "./dto/auth.dto"

@Injectable()
export class AuthService {
  EXPIRE_DAY = 1
  REFRESH_TOKEN = "refreshToken"

  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtServise: JwtService,
    private mailerService: MailerService,
    private confirmationService: ConfirmationService,
    private twilioService: TwilioService,
    private configService: ConfigService
  ) {}

  async loginOrEmailConfirmation(dto: ConfirmationDto) {
    if (this.isTwoFactorRequired(dto)) {
      const user = await this.validateUser(dto)
      if (dto.credential === user.login) return { message: "Need virefication" }

      if (dto.credential === user.email) {
        const { code, expiration } = await this.confirmationService.generateCode()

        await this.confirmationService.saveCode(user.id, code, expiration)

        await this.mailerService.sendMail({
          to: user.email,
          from: "auth.nest.next@gmail.com",
          subject: "Login Confirmation",
          html: getEmailHtml(code)
        })

        return { code, expiration }
      }
    } else {
      const user = await this.validateUser(dto)
      const tokens = await this.issueTokens(user.id)

      return { user: this.returnUserFields(user), ...tokens }
    }
  }

  async phoneConfirmation(credential: string) {
    const user = await this.userService.findByPhone(credential)
    const serviceSid = this.configService.get("TWILIO_VERIFICATION_SERVICE_SID")

    const { code, expiration } = await this.confirmationService.generateCode()

    await this.confirmationService.saveCode(user.id, code, expiration)

    await this.twilioService.client.verify.v2.services(serviceSid).verifications.create({
      to: credential,
      channel: "sms"
    })

    return { message: "Need virefication" }
  }

  async login(dto: EmailLoginDto) {
    const user = await this.userService.findByCredentials(dto.credential)
    if (!user) throw new NotFoundException("User not found")

    if (dto.credential.startsWith("+")) {
      const serviceSid = this.configService.get("TWILIO_VERIFICATION_SERVICE_SID")

      const result = await this.twilioService.client.verify.v2
        .services(serviceSid)
        .verificationChecks.create({ to: dto.credential, code: dto.code })

      if (!result.valid || result.status !== "approved") {
        throw new BadRequestException("Wrong code provided")
      }
    } else {
      const verification = await this.confirmationService.getCode(user.id)

      if (!verification || verification.code !== dto.code || verification.expiration < new Date())
        throw new UnauthorizedException("Invalid or expired code")

      await this.confirmationService.deleteCode(user.id)
    }

    const tokens = await this.issueTokens(user.id)
    return { user: this.returnUserFields(user), ...tokens }
  }

  async register(dto: RegisterDto) {
    const existUser = await this.userService.findByEmail(dto.email)

    if (existUser) throw new BadRequestException("User already exist")

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        login: dto.login,
        phone: dto.phone,
        password: await hash(dto.password)
      }
    })

    const tokens = await this.issueTokens(user.id)

    return { user: this.returnUserFields(user), ...tokens }
  }

  async google(dto: GoogleDto) {
    const oldUser = await this.prisma.user.findUnique({
      where: { email: dto.email }
    })

    if (oldUser) {
      return oldUser
    }
    const newUser = await this.prisma.user.create({
      data: {
        id: dto.id,
        email: dto.email,
        login: dto.login,
        phone: "",
        password: ""
      }
    })

    const { password, ...response } = newUser

    return response
  }

  private returnUserFields(user: Partial<User>) {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      login: user.login,
      code: user.code
    }
  }

  async issueTokens(userId: string) {
    const data = { id: userId }

    const accessToken = this.jwtServise.sign(data, {
      expiresIn: "1d"
    })

    const refreshToken = this.jwtServise.sign(data, {
      expiresIn: "3d"
    })

    return { accessToken, refreshToken }
  }

  private isTwoFactorRequired(dto: ConfirmationDto) {
    if (dto.password) {
      //return true
      return Math.random() <= 0.5 // 50 % na to, chto proizoidet 2-factorka
    } else {
      return true
    }
  }

  async getNewTokens(refreshToken: string) {
    const oldToken = await this.jwtServise.verifyAsync(refreshToken)
    if (!oldToken) throw new UnauthorizedException("Invalid refresh token")

    const user = await this.userService.findById(oldToken.id)

    const tokens = await this.issueTokens(user.id)

    return { user: this.returnUserFields(user), ...tokens }
  }

  async validateUser(dto: ConfirmationDto) {
    const user = await this.userService.findByCredentials(dto.credential)
    if (!user) throw new NotFoundException("User not found!")

    if (dto.password) {
      const isValid = await verify(user.password, dto.password)

      if (!isValid) throw new UnauthorizedException("Invalid password")
    }

    return this.returnUserFields(user)
  }

  addRefreshToken(res: Response, refreshToken: string) {
    const expiresIn = new Date()
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY)

    res.cookie(this.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      domain: "localhost",
      expires: expiresIn,
      secure: true,
      sameSite: "none"
    })
  }

  removeRefreshToken(res: Response) {
    res.cookie(this.REFRESH_TOKEN, "", {
      httpOnly: true,
      domain: "localhost",
      expires: new Date(0),
      secure: true,
      sameSite: "none"
    })
  }
}
