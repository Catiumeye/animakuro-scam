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

    @Mutation(() => Studio)
    async updateStudio(
        @Arg('id') id: string,
        @Arg('data') data: StudioInput
    ) {
        return prisma.studio.update({
            where: {
                id
            },
            data
        })
    }


    @Mutation(() => Studio)
    async deleteStudio(@Arg('id') id: string) {
        return prisma.studio.delete({
            where: {
                id
            }
        })
    }

    @Query(() => [Studio]) 
    async studios(
        @Arg('take', { nullable: true }) take: number,
        @Arg('skip', { nullable: true }) skip: number,
        @Arg('orderBy', { nullable: true }) orderBy: string,
        @Arg('order', { nullable: true }) order: string,
        @Arg('search', { nullable: true }) search: string,
    ) {
        const studios = await prisma.studio.findMany({
            take,
            skip,
            orderBy: {
                [orderBy]: order
            },
            where: {
                name: {
                    contains: search
                }
            },
            include: {
                series: true
            }
        })

        return studios
       
    }
}
