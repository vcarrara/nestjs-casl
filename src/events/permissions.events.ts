import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { DashboardDocument } from 'src/schemas/dashboard.schema'
import { Role } from 'src/schemas/role.type'
import { User, UserDocument } from 'src/schemas/user.schema'

export type DashboardCreatedEvent = {
    userId: string
    dashboard: DashboardDocument
}

export type DashboardRemovedEvent = DashboardCreatedEvent

export type DashboardGrantedEvent = DashboardCreatedEvent

export type DashboardRevokedEvent = DashboardCreatedEvent

function createOwnerRoles(dashboardId: string): Role[] {
    return [{ action: 'manage', subject: 'dashboard', conditions: { _id: dashboardId } }]
}

function createCollaboratorRoles(dashboardId: string): Role[] {
    return [
        {
            action: 'read',
            subject: 'dashboard',
            conditions: { _id: dashboardId },
        },
        {
            action: 'update',
            subject: 'dashboard',
            conditions: { _id: dashboardId },
            fields: ['description'],
        },
    ]
}

@Injectable()
export class PermissionsEvents {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    @OnEvent('dashboard.created')
    async grantOwner(dashboardCreatedEvent: DashboardCreatedEvent) {
        const { userId, dashboard } = dashboardCreatedEvent
        await this.userModel
            .updateOne(
                { _id: userId },
                {
                    $addToSet: {
                        roles: createOwnerRoles(dashboard._id),
                    },
                }
            )
            .exec()
    }

    @OnEvent('dashboard.removed')
    async revokeOwner(dashboardRemovedEvent: DashboardRemovedEvent) {
        const { userId, dashboard } = dashboardRemovedEvent
        await this.userModel.updateOne(
            { _id: userId },
            {
                $pullAll: {
                    roles: createOwnerRoles(dashboard._id),
                },
            }
        )
        await this.userModel.updateMany(
            {
                _id: {
                    $in: dashboard.collaborators,
                },
            },
            {
                $pullAll: {
                    roles: createCollaboratorRoles(dashboard._id),
                },
            }
        )
    }

    @OnEvent('dashboard.granted')
    async grantCollaborator(dashboardGrantedEvent: DashboardGrantedEvent) {
        const { userId, dashboard } = dashboardGrantedEvent
        await this.userModel.updateOne(
            { _id: userId },
            {
                $addToSet: {
                    roles: createCollaboratorRoles(dashboard._id),
                },
            }
        )
    }

    @OnEvent('dashboard.revoked')
    async revokeCollaborator(dashboardRevokedEvent: DashboardRevokedEvent) {
        const { userId, dashboard } = dashboardRevokedEvent
        await this.userModel.updateOne(
            { _id: userId },
            {
                $pullAll: {
                    roles: createCollaboratorRoles(dashboard._id),
                },
            }
        )
    }
}
