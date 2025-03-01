import { IsString } from 'class-validator'

export class LoginBodyDTO {
  @IsString()
  email: string

  @IsString()
  password: string
}

export class RegisterBodyDTO extends LoginBodyDTO {
  @IsString({ message: 'Name must be a string' })
  name: string

  // @IsString()
  confirmPassword: string
}
