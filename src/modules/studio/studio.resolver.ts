import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { prisma, redis } from '../../index'
import { Studio, StudioInput } from './studio.schema'
 
@Resolver()
export class StudioResolver {
    @Mutation(() => Studio)
    async createStudio(
        @Arg('data') data: StudioInput
    ) {
        const studio = prisma.studio.create({
            data,
        })

        return studio
    }

    @Query(() => [Studio]) 
    async studios() {
        return prisma.studio.findMany()
    }

    @Mutation(() => Studio)
    async deleteStudio(@Arg('id') id: string) {
        return prisma.studio.delete({
            where: {
                id
            }
        })
    }
}
