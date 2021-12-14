import { Dashboard } from 'src/schemas/dashboard.schema'

export class DashboardDto extends Dashboard {
    _id: string

    constructor(partial: Partial<DashboardDto> = {}) {
        super()
        Object.assign(this, partial)
    }
}
