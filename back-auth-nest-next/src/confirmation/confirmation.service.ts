import { PrismaService } from "@/prisma.service"
import { Injectable } from "@nestjs/common"

@Injectable()
export class ConfirmationService {
  constructor(private prisma: PrismaService) {}

  async generateCode() {
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    const expiration = new Date(Date.now() + 5 * 60000)

    return { code, expiration }
  }

  async saveCode(userId: string, code: string, expiration: Date) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { code, codeExpiration: expiration }
    })
  }

  async getCode(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { code: true, codeExpiration: true }
    })

    if (user && user.code && user.codeExpiration > new Date())
      return { code: user.code, expiration: user.codeExpiration }

    return null
  }

  async deleteCode(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { code: null, codeExpiration: null }
    })
  }
}
