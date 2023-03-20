import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DbModule } from 'src/db/db.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  providers: [UserService],
  imports: [
    forwardRef(() => AuthModule),
    DbModule
  ],
  exports: [
    UserService
  ],
  controllers: [UserController]
})
export class UserModule {}
