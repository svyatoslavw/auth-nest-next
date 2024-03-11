import { NestFactory } from "@nestjs/core"
import * as cookieParser from "cookie-parser"
import * as session from "express-session"
import * as passport from "passport"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())
  app.use(
    session({
      name: "sessionToken",
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 0
      }
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())
  app.enableCors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type, Authorization, Access-Control-Allow-Origin"],
    credentials: true,
    exposedHeaders: ["set-cookie"]
  })

  await app.listen(4000)
}
bootstrap()
