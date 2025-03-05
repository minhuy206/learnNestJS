import { plainToInstance } from 'class-transformer'
import { IsBoolean, IsNumber, IsString, validateSync } from 'class-validator'
import fs from 'fs'
import path from 'path'

// Kiểm tra coi thử có file .env chưa

if (!fs.existsSync(path.resolve('.env'))) {
  console.error('Không tìm thấy file .env')
  process.exit(1)
}

class ConfigSchema {
  @IsString()
  DATABASE_URL: string

  @IsString()
  SECRET_API_KEY: string

  @IsString()
  ACCESS_TOKEN_SECRET: string

  @IsString()
  REFRESH_TOKEN_SECRET: string

  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: string

  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: string

  // Bind `NUMBER` to a number to implicit it from string to number
  @IsNumber()
  NUMBER: number

  // Bind `BOOLEAN` to a boolean to implicit it from string to boolean. #This way always return true even if the value is 'false'
  @IsBoolean()
  BOOLEAN: boolean
}

const configServer = plainToInstance(ConfigSchema, process.env, {
  // Enable implicit conversion
  enableImplicitConversion: true,
})

const error = validateSync(configServer)

if (error.length > 0) {
  console.log('Values in .env are invalid')
  const errors = error.map((error) => {
    return {
      property: error.property,
      constraints: error.constraints,
      value: error.value,
    }
  })
  throw errors
}

const envConfig = configServer

export default envConfig
