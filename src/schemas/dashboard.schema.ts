import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import * as mongoose from 'mongoose'
import { User } from './user.schema'

export type DashboardDocument = Dashboard & Document

@Schema({ versionKey: false })
export class Dashboard {
    @Prop()
    name: string

    @Prop()
    description: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    owner: User

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    collaborators: User[]
}

export const DashboardSchema = SchemaFactory.createForClass(Dashboard)
