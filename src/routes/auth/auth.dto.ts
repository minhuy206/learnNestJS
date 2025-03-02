import { Exclude, Type } from 'class-transformer'
import { IsString } from 'class-validator'
import { SuccessResponseDTO } from 'src/shared/shared.dto'

export class LoginBodyDTO {
  @IsString()
  email: string

  @IsString()
  password: string
}

export class RegisterBodyDTO extends LoginBodyDTO {
  @IsString({ message: 'Name must be a string' })
  name: string

  @IsString()
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
