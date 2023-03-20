import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const JWT_CONFIG = registerAs(
  'jwt',
  (): JwtModuleOptions => {
    return {
      // privateKey: privateKEY,
      // publicKey: publicKEY,
      secret: process.env.JWT_SECRET_KEY || '1qazXSW@3edcVFR$',
      signOptions: {
        expiresIn: (process.env.JWT_SECRET_LIFEDAYS || 180).toString() + 'd',
      },
    };
  },
);
