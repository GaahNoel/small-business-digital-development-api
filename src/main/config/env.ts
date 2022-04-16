import 'dotenv/config';

export const env = {
  databaseUrl: process.env.DATABASE_URL,
  testDatabaseUrl: process.env.TEST_DATABASE_URL,
  port: process.env.PORT || 3333,
  emailAccount: process.env.EMAIL_ACCOUNT,
  emailPassword: process.env.EMAIL_PASSWORD,
  jwtSecret: process.env.JWT_SECRET,
};
