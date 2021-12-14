import { IsMongoId } from 'class-validator'

export class GrantDashboardDto {
    @IsMongoId()
    collaborator: string
}
