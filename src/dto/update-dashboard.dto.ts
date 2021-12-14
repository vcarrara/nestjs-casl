import { IsOptional, IsString, Length } from 'class-validator'

export class UpdateDashboardDto {
    @IsString()
    @Length(3, 10)
    @IsOptional()
    name?: string

    @IsString()
    @Length(0, 100)
    @IsOptional()
    description?: string
}
