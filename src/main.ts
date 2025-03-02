import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import './shared/config'
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common'
import { LoggingInterceptor } from './shared/interceptor/logging.interceptor'
import { TransformInterceptor } from './shared/interceptor/transform.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties that do not have decorators
      forbidNonWhitelisted: true, // Throw an error if a property is not implement in the DTO
      transform: true, // Transform the payload to the DTO type
      transformOptions: {
        enableImplicitConversion: true, // Implicit conversion of the payload to the DTO type
      },
      exceptionFactory: (validationErrors) => {
        console.log(validationErrors)
        return new UnprocessableEntityException(
          validationErrors.map((error) => ({
            property: error.property,
            error: Object.values(error.constraints as any).join(', '),
          })),
        )
      },
    }),
  )
  app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalInterceptors(new TransformInterceptor())

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
