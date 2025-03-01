import { RegisterBodyDTO, RegisterResponseDTO } from './auth.dto'
import { AuthService } from './auth.service'
import { Body, Controller, Post, SerializeOptions } from '@nestjs/common'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SerializeOptions({ type: RegisterResponseDTO })
  @Post('register')
  async register(@Body() body: RegisterBodyDTO) {
    return await this.authService.register(body)
  }
}
