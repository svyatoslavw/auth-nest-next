import { Auth } from "@/auth/decorators/auth.decorator"
import { CurrentUser } from "@/auth/decorators/user.decorator"
import { Controller, Get } from "@nestjs/common"
import { UserService } from "./user.service"

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("profile")
  @Auth()
  async profile(@CurrentUser("id") id: string) {
    return this.userService.findById(id)
  }
}
