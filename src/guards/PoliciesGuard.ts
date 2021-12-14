import { BadRequestException, CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { AppAbility, CaslAbilityFactory } from 'src/casl/casl-ability.factory'
import { UsersService } from 'src/users/users.service'
import { PolicyHandler } from './IPolicyHandler'

export const CHECK_POLICIES_KEY = 'check_policy'
export const CheckPolicies = (...handlers: PolicyHandler[]) => SetMetadata(CHECK_POLICIES_KEY, handlers)

@Injectable()
export class PoliciesGuard implements CanActivate {
    constructor(private reflector: Reflector, private caslAbilityFactory: CaslAbilityFactory, private usersService: UsersService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const policyHandlers = this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, context.getHandler()) || []

        const request = context.switchToHttp().getRequest() as Request

        const { userId } = request.query

        if (!userId) {
            throw new BadRequestException('userId must be set as a query param')
        }

        const user = await this.usersService.findOne(userId as string)

        const ability = this.caslAbilityFactory.createForUser(user)

        return policyHandlers.every((handler) => this.execPolicyHandler(handler, request, ability))
    }

    private execPolicyHandler(handler: PolicyHandler, request: Request, ability: AppAbility) {
        if (typeof handler === 'function') {
            return handler(request, ability)
        }
        return handler.handle(request, ability)
    }
}
