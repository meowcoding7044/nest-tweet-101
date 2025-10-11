// import { registerAs } from '@nestjs/config';

// export default registerAs('appConfig', () => ({
//   environment: process.env.NODE_ENV || 'PROD',
// }));
import { registerAs } from '@nestjs/config';
export default registerAs('app', () => ({
  env: process.env.NODE_ENV || 'development',
}));

