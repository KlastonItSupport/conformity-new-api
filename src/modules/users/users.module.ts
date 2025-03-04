import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersServices } from './services/users.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { Company } from '../companies/entities/company.entity';
import { Groups } from '../permissions/entities/groups.entity';
import { PermissionsModule } from '../permissions/permissions.module';
import { PermissionsServices } from '../permissions/services/permissions.service';
import { Permissions } from '../permissions/entities/permissions.entity';
import { GroupModulePermission } from '../permissions/entities/group_module_permissions.entity';
import { SharedModule } from '../shared/shared.module';
import { AuditModule } from '../audit/audit.module';
import { MailerModule } from '../mailer/mailer.module';
import { UserToken } from './entities/user-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
      UserToken,
      User,
      Groups,
      Permissions,
      GroupModulePermission,
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_TOKEN,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_SECRET_TOKEN },
    }),
    PermissionsModule,
    SharedModule,
    AuditModule,
    MailerModule,
  ],
  providers: [UsersServices, PermissionsServices],
  controllers: [UsersController],
  exports: [UsersServices],
})
export class UsersModule {}
