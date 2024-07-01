import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { CustomValidationPipe } from './filters/custom-validation.pipe';
import { AppModule } from './app.module';
import { urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.useGlobalPipes(
    new CustomValidationPipe({
      whitelist: true, // Automatically strip non-whitelisted properties
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are passed
    }),
  );

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
  });

  await app.listen(3000);
}
bootstrap();

//npx knex migrate:make users_datatype_update --knexfile ./knexfile.ts --env local

//npx knex migrate:latest --knexfile ./knexfile.ts --env local

// knex seed:run --env local

process.on('uncaughtException', (err) => console.log(err));
