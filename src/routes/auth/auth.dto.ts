import { Exclude, Type } from 'class-transformer'
import { IsString } from 'class-validator'
import { IsMatch } from 'src/shared/decorators/IsMatch.decorator'
import { SuccessResponseDTO } from 'src/shared/shared.dto'

export class LoginBodyDTO {
  @IsString()
  email: string

  @IsString()
  password: string
}

export class LoginResponseDTO {
  accessToken: string

  @IsString()
  refreshToken: string

  constructor(partial: Partial<LoginResponseDTO>) {
    Object.assign(this, partial)
  }
}

export class RegisterBodyDTO extends LoginBodyDTO {
  @IsString({ message: 'Name must be a string' })
  name: string

  @IsString()
  @IsMatch('password', { message: 'Password does not match' })
  confirmPassword: string
}

export class RegisterData {
  id: number
  email: string
  name: string
  @Exclude() password: string
  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<RegisterData>) {
    Object.assign(this, partial)
  }
}

export class RegisterResponseDTO extends SuccessResponseDTO {
  @Type(() => RegisterData)
  data: RegisterData

  constructor(partial: Partial<RegisterResponseDTO>) {
    super(partial)
    Object.assign(this, partial)
  }
}

export class RefreshTokenResponseDTO extends LoginResponseDTO {}

export class LogoutBodyDTO extends RefreshTokenResponseDTO {}

export class LogoutResDTO {
  message: string

  constructor(partial: Partial<LogoutResDTO>) {
    Object.assign(this, partial)
  }
}
