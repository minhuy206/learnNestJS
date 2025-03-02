import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from './../../shared/services/prisma.service'
import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { LoginBodyDTO } from './auth.dto'
import { TokenService } from 'src/shared/services/token.service'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class AuthService {
  constructor(
    private readonly PrismaService: PrismaService,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
  ) {}

  async register(body: any) {
    try {
      const hashedPassword = await this.hashingService.hash(body.password)

      const user = await this.PrismaService.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          name: body.name,
        },
      })

      return user
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email already exists')
      }

      throw error
    }
  }

  async login(body: LoginBodyDTO) {
    const user = await this.PrismaService.user.findUnique({
      where: { email: body.email },
    })

    if (!user) {
      throw new UnauthorizedException('Account is not exist')
    }

    const isPasswordMatch = await this.hashingService.compare(body.password, user.password)

    if (!isPasswordMatch) {
      throw new UnprocessableEntityException([
        {
          field: 'password',
          error: 'Password is incorrect',
        },
      ])
    }

    const tokens = await this.generateTokens({ userId: user.id, uuid: uuidv4() })
    return tokens
  }

  async generateTokens(payload: { userId: number; uuid: string }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload),
    ])

    const decodeRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)

    await this.PrismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: payload.userId,
        expiresAt: new Date(decodeRefreshToken.exp * 1000),
      },
    })

    return { accessToken, refreshToken }
  }
}
