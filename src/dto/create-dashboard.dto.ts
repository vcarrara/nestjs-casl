import { IsOptional, IsString, Length } from 'class-validator'

export class CreateDashboardDto {
    @IsString()
    @Length(3, 10)
    name: string

    @IsString()
    @Length(0, 100)
    @IsOptional()
    description?: string
}
