import { Controller, Get, Query } from '@nestjs/common'
import { UserQueryDto } from 'src/dto/user-query.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('profile')
    getProfile(@Query() { userId }: UserQueryDto) {
        return this.usersService.findOne(userId)
    }
}
