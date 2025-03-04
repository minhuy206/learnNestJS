import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from './../../shared/services/prisma.service'
import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { LoginBodyDTO } from './auth.dto'
import { TokenService } from 'src/shared/services/token.service'
import { v4 as uuidv4 } from 'uuid'
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helpers'

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
      if (isUniqueConstraintPrismaError(error)) {
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

  async refreshToken(refreshToken: string) {
    try {
      // 1. Verify refresh token
      const { userId } = await this.tokenService.verifyRefreshToken(refreshToken)

      // 2. Find refresh token in database
      await this.PrismaService.refreshToken.findFirstOrThrow({
        where: {
          token: refreshToken,
        },
      })

      // 3. Delete refresh token in database
      await this.PrismaService.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      })

      // 4. Generate new tokens
      return this.generateTokens({ userId, uuid: uuidv4() })
    } catch (error) {
      // In case the token is refreshed, announce to user that their refresh token is robbed
      if (isNotFoundPrismaError(error)) {
        throw new UnauthorizedException('Refresh token has been revoked')
      }

      throw new UnauthorizedException()
    }
  }
}
