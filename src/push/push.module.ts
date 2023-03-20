import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DbModule } from 'src/db/db.module';
import { PushController } from './push.controller';
import { PushService } from './push.service';

@Module({
    controllers: [PushController],
    providers: [PushService],
    imports: [AuthModule, DbModule],
    exports: [PushService]
})
export class PushModule {}
