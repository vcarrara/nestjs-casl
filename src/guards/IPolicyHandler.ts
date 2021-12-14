import { AppAbility } from '../casl/casl-ability.factory'
import { Request } from 'express'

interface IPolicyHandler {
    handle(request: Request, ability: AppAbility): boolean
}

type PolicyHandlerCallback = (request: Request, ability: AppAbility) => boolean

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback
