import { IsMongoId, IsNotEmpty } from 'class-validator'

export class UserQueryDto {
    @IsMongoId()
    userId: string
}
