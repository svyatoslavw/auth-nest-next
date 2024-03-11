import { PrismaService } from "@/prisma.service"
import { Injectable, NotFoundException } from "@nestjs/common"

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        createdAt: true,
        email: true,
        login: true,
        phone: true
      }
    })

    if (!user) throw new NotFoundException("User not found")
    return user
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    return user
  }

  async findByPhone(phone: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        phone
      }
    })

    if (!user) throw new NotFoundException("User not found")
    return user
  }

  async findByCredentials(loginOrEmail: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: loginOrEmail }, { login: loginOrEmail }, { phone: loginOrEmail }]
      }
    })

    return user
  }

  async getProfile(id: string) {
    return this.findById(id)
  }
}
