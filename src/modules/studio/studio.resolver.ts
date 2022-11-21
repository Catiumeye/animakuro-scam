import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { prisma, redis } from '../../index'
import { Studio } from './studio.schema'
 
@Resolver()
export class StudioResolver {
    @Mutation(() => Studio)
    async studio() {
        console.log('create')

        return true
    }

    @Query(() => [Studio]) 
    async studios() {
        console.log('get')

        return prisma.studio.findMany()
    }
}
