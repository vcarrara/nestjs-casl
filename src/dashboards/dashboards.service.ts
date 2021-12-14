import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateDashboardDto } from 'src/dto/create-dashboard.dto'
import { GrantDashboardDto } from 'src/dto/grant-dashboard.dto'
import { UpdateDashboardDto } from 'src/dto/update-dashboard.dto'
import { Dashboard, DashboardDocument } from 'src/schemas/dashboard.schema'
import { User, UserDocument } from 'src/schemas/user.schema'

@Injectable()
export class DashboardsService {
    constructor(
        @InjectModel(Dashboard.name) private dashboardModel: Model<DashboardDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    async findAll(userId: string): Promise<DashboardDocument[]> {
        const user = new this.userModel({ _id: userId })
        return this.dashboardModel
            .find({
                $or: [{ owner: user }, { collaborators: user }],
            })
            .populate('owner')
            .populate('collaborators')
    }

    async findOne(dashboardId: string): Promise<DashboardDocument> {
        const dashboard = await this.dashboardModel.findOne({ _id: dashboardId }).exec()
        if (!dashboard) {
            throw new NotFoundException()
        }
        return dashboard
    }

    async deleteOne(dashboardId: string): Promise<DashboardDocument> {
        const dashboard = await this.dashboardModel.findOneAndDelete({ _id: dashboardId }).exec()
        if (!dashboard) {
            throw new NotFoundException()
        }
        return dashboard
    }

    async updateOne(dashboardId: string, updateDashboardDto: UpdateDashboardDto): Promise<DashboardDocument> {
        const dashboard = await this.dashboardModel.findOneAndUpdate(
            { _id: dashboardId },
            {
                $set: updateDashboardDto,
            },
            {
                new: true,
            }
        )
        if (!dashboard) {
            throw new NotFoundException()
        }
        return dashboard
    }

    async createOne(owner: string, createDashboardDto: CreateDashboardDto): Promise<DashboardDocument> {
        return new this.dashboardModel({ owner, ...createDashboardDto }).save()
    }

    async grant(dashboardId: string, grantDashboardDto: GrantDashboardDto) {
        const { collaborator } = grantDashboardDto
        const dashboard = await this.dashboardModel.findOneAndUpdate(
            { _id: dashboardId },
            {
                $addToSet: {
                    collaborators: collaborator,
                },
            },
            { new: true }
        )
        if (!dashboard) {
            throw new NotFoundException()
        }
        return dashboard
    }

    async revoke(dashboardId: string, grantDashboardDto: GrantDashboardDto) {
        const { collaborator } = grantDashboardDto
        const dashboard = await this.dashboardModel.findOneAndUpdate(
            { _id: dashboardId },
            {
                $pull: {
                    collaborators: collaborator,
                },
            },
            { new: true }
        )
        if (!dashboard) {
            throw new NotFoundException()
        }
        return dashboard
    }
}
