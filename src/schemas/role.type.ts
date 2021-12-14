import { Action } from 'src/casl/casl-ability.factory'

export type Role = {
    action: Action
    subject: 'dashboard'
    conditions?: any
    fields?: string[]
}
