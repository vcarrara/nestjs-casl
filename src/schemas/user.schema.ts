import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Role } from './role.type'

export type UserDocument = User & Document

@Schema({ versionKey: false })
export class User {
    @Prop()
    username: string

    @Prop()
    roles: Role[]
}

export const UserSchema = SchemaFactory.createForClass(User)
