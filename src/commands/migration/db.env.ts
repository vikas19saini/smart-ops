import 'dotenv/config';

export const dbEnv = {
  hostname: process.env.DB_HOST_NAME || 'localhost',
  port: (process.env.DB_PORT_NUMBER || 3306) as number,
  database: process.env.DB_NAME || '',
  username: process.env.DB_USER_NAME || '',
  password: process.env.DB_PASSWORD || '',
};
