import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { CustomValidationPipe } from './filters/custom-validation.pipe';
import { AppModule } from './app.module';
import { urlencoded } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getUId } from './utils/common.helper';
import { UserModel } from './db/models/user.model';
import { hashSync } from 'bcryptjs';

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

(async () => {
  const userData = [
    {
      userID: getUId(),
      username: 'Axat Developer',
      emailID: 'axat.sachani+user@propelius.tech',
      password: hashSync('Axat@2024', 10),
      roleID: 3,
    },
    {
      userID: getUId(),
      username: 'Axat Administrator',
      emailID: 'axat.sachani+admin@propelius.tech',
      password: hashSync('Axat@2024', 10),
      roleID: 1,
    },
    {
      userID: getUId(),
      username: 'Axat Manager',
      emailID: 'axat.sachani+manager@propelius.tech',
      password: hashSync('Axat@2024', 10),
      roleID: 2,
    },
  ];

  // const data = await UserModel.query().insert(userData);
  // console.log(data);
  
})();
