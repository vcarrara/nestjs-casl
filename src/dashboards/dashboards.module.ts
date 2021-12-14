import { Module } from '@nestjs/common'
import { DashboardsService } from './dashboards.service'
import { DashboardsController } from './dashboards.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Dashboard, DashboardSchema } from 'src/schemas/dashboard.schema'
import { CaslModule } from 'src/casl/casl.module'
import { UsersModule } from 'src/users/users.module'
import { User, UserSchema } from 'src/schemas/user.schema'

@Module({
    imports: [
        CaslModule,
        MongooseModule.forFeature([{ name: Dashboard.name, schema: DashboardSchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        UsersModule,
    ],
    controllers: [DashboardsController],
    providers: [DashboardsService],
})
export class DashboardsModule {}
