import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CaslModule } from './casl/casl.module'
import { DashboardsModule } from './dashboards/dashboards.module'
import { PermissionsEvents } from './events/permissions.events'
import { User, UserSchema } from './schemas/user.schema'
import { UsersModule } from './users/users.module'

@Module({
    imports: [
        MongooseModule.forRoot('mongodb+srv://olympe-data:WQ9grtEFoEk4OPZ6@test-cluster.j2rt3.mongodb.net/casl'),
        EventEmitterModule.forRoot(),
        CaslModule,
        DashboardsModule,
        UsersModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [AppController],
    providers: [AppService, PermissionsEvents],
})
export class AppModule {}
