import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { CreateDashboardDto } from 'src/dto/create-dashboard.dto'
import { DashboardDto } from 'src/dto/dashboard.dto'
import { GrantDashboardDto } from 'src/dto/grant-dashboard.dto'
import { UpdateDashboardDto } from 'src/dto/update-dashboard.dto'
import { UserQueryDto } from 'src/dto/user-query.dto'
import { DashboardCreatedEvent, DashboardGrantedEvent, DashboardRemovedEvent, DashboardRevokedEvent } from 'src/events/permissions.events'
import { CheckPolicies, PoliciesGuard } from 'src/guards/PoliciesGuard'
import { DashboardsService } from './dashboards.service'

@Controller('dashboards')
export class DashboardsController {
    constructor(private readonly dashboardsService: DashboardsService, private eventEmitter: EventEmitter2) {}

    @Post()
    async createOne(@Body() createDashboardDto: CreateDashboardDto, @Query() { userId }: UserQueryDto) {
        const dashboard = await this.dashboardsService.createOne(userId, createDashboardDto)
        this.eventEmitter.emit('dashboard.created', {
            userId,
            dashboard,
        } as DashboardCreatedEvent)
        return dashboard
    }

    @Get()
    async findAll(@Query() { userId }: UserQueryDto) {
        return this.dashboardsService.findAll(userId)
    }

    @Get(':dashboardId')
    @UseGuards(PoliciesGuard)
    @CheckPolicies((request, ability) => {
        const { dashboardId } = request.params
        return ability.can('read', new DashboardDto({ _id: dashboardId }))
    })
    async findOne(@Param('dashboardId') dashboardId: string) {
        return this.dashboardsService.findOne(dashboardId)
    }

    @Delete(':dashboardId')
    @UseGuards(PoliciesGuard)
    @CheckPolicies((request, ability) => {
        const { dashboardId } = request.params
        return ability.can('delete', new DashboardDto({ _id: dashboardId }))
    })
    async deleteOne(@Param('dashboardId') dashboardId: string, @Query() { userId }: UserQueryDto) {
        const dashboard = await this.dashboardsService.deleteOne(dashboardId)
        this.eventEmitter.emit('dashboard.removed', {
            userId,
            dashboard,
        } as DashboardRemovedEvent)
        return dashboard
    }

    @Put(':dashboardId')
    @UseGuards(PoliciesGuard)
    @CheckPolicies((request, ability) => {
        const { dashboardId } = request.params
        const fields = Object.keys(request.body)
        return fields.every((field) => ability.can('update', new DashboardDto({ _id: dashboardId }), field))
    })
    async updateOne(@Param('dashboardId') dashboardId: string, @Body() updateDashboardDto: UpdateDashboardDto) {
        return this.dashboardsService.updateOne(dashboardId, updateDashboardDto)
    }

    @Post(':dashboardId/grant')
    @UseGuards(PoliciesGuard)
    @CheckPolicies((request, ability) => {
        const { dashboardId } = request.params
        return ability.can('manage', new DashboardDto({ _id: dashboardId }))
    })
    async grant(@Param('dashboardId') dashboardId: string, @Body() grantDashboardDto: GrantDashboardDto) {
        const dashboard = await this.dashboardsService.grant(dashboardId, grantDashboardDto)
        this.eventEmitter.emit('dashboard.granted', { dashboard, userId: grantDashboardDto.collaborator } as DashboardGrantedEvent)
        return dashboard
    }

    @Post(':dashboardId/revoke')
    @UseGuards(PoliciesGuard)
    @CheckPolicies((request, ability) => {
        const { dashboardId } = request.params
        return ability.can('manage', new DashboardDto({ _id: dashboardId }))
    })
    async revoke(@Param('dashboardId') dashboardId: string, @Body() grantDashboardDto: GrantDashboardDto) {
        const dashboard = await this.dashboardsService.revoke(dashboardId, grantDashboardDto)
        this.eventEmitter.emit('dashboard.revoked', { dashboard, userId: grantDashboardDto.collaborator } as DashboardRevokedEvent)
        return dashboard
    }
}
