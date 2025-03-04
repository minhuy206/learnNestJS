import {
  LoginBodyDTO,
  LoginResponseDTO,
  RefreshTokenResponseDTO,
  RegisterBodyDTO,
  RegisterResponseDTO,
} from './auth.dto'
import { AuthService } from './auth.service'
import { Body, Controller, HttpCode, HttpStatus, Post, SerializeOptions } from '@nestjs/common'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SerializeOptions({ type: RegisterResponseDTO })
  @Post('register')
  async register(@Body() body: RegisterBodyDTO) {
    // return new RegisterResponseDTO(await this.authService.register(body)) // This is the original code
    return await this.authService.register(body)
  }

  @Post('login')
  async login(@Body() body: LoginBodyDTO) {
    return new LoginResponseDTO(await this.authService.login(body))
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: RefreshTokenResponseDTO) {
    return new RefreshTokenResponseDTO(await this.authService.refreshToken(body.refreshToken))
  }
}
