import { RegisterBodyDTO } from './auth.dto'
import { AuthService } from './auth.service'
import { Body, Controller, Post } from '@nestjs/common'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterBodyDTO) {
    console.log(body)
    return 'register'

    // return this.authService.register(body)
  }
}
