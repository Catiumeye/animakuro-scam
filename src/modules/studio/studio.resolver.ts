import { GqlHttpException, HttpStatus } from 'errors/errors';
import { Max } from 'class-validator'
import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { prisma, redis } from '../../index'
import { Studio, StudioInput, StudiosArgs, UpdateStudioInput } from './studio.schema'
 
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
        @Arg('data') data: UpdateStudioInput
    ) {
        const isStudioExists = await prisma.studio.findFirst({
            where: {
                id,
            }
        })
    
        if (!isStudioExists) {
            throw new GqlHttpException(`Studio ${id} not found`, HttpStatus.NOT_FOUND)
        }


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
        @Args() { skip, take, search }: StudiosArgs
    ) {
        const studios = await prisma.studio.findMany({
            take,
            skip,
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
