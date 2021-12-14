import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from 'src/schemas/user.schema'

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async findOne(userId: string): Promise<UserDocument> {
        const user = await this.userModel.findOne({ _id: userId }).exec()
        if (!user) {
            throw new NotFoundException()
        }
        return user
    }
}
