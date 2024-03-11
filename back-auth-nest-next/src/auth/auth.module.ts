import { PrismaService } from "@/prisma.service"
import { UserService } from "@/user/user.service"
import { MailerModule } from "@nestjs-modules/mailer"
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"
import { TwilioModule } from "nestjs-twilio"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { getJwtConfig } from "./config/jwt.config"
import { getMailConfig } from "./config/mail.config"
import { getPhoneConfig } from "./config/phone.config"
import { SessionSerializer } from "./serializers/session.serialize"
import { GoogleStrategy } from "./strategy/google.strategy"
import { JwtStrategy } from "./strategy/jwt.strategy"
import { ConfirmationService } from "@/confirmation/confirmation.service"

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMailConfig
    }),
    TwilioModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getPhoneConfig
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    UserService,
    ConfirmationService,
    JwtStrategy,
    GoogleStrategy,
    SessionSerializer
  ]
})
export class AuthModule {}
