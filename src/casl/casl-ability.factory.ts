import { Injectable } from '@nestjs/common'
import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability'
import { UserDocument } from 'src/schemas/user.schema'
import { DashboardDto } from 'src/dto/dashboard.dto'

type Subjects = InferSubjects<typeof DashboardDto> | 'all'

export type Action = 'manage' | 'create' | 'update' | 'read' | 'delete'

export type AppAbility = Ability<[Action, Subjects]>

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: UserDocument) {
        const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>)

        for (const { action, subject, fields = [], conditions = {} } of user.roles) {
            switch (subject) {
                case 'dashboard': {
                    !!fields.length ? can(action as Action, DashboardDto, fields, conditions) : can(action as Action, DashboardDto, conditions)
                    break
                }
            }
        }

        // can('update', DashboardDto, 'description', { _id: '61b33602471018d6d8e3b3ea' })
        // can('update', DashboardDto, { name: 'fjdsifjds' })

        return build({
            detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
        })
    }
}
