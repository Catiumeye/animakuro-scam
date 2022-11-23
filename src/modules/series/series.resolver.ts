import { Prisma } from '@prisma/client'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { prisma } from '../../index'
import { Series, SeriesInput } from './series.schema'
 
@Resolver()
export class SeriesResolver {
    @Mutation(() => Series)
    async createSeries(
        @Arg('data') data: SeriesInput,
    ) {

        return prisma.series.create({
            data: {
                ...data,
                studio: {
                    connect: data.studio
                }
            },
            include: {
                studio: !!data.studio
            }
        })
    }

    @Mutation(() => Series)
    async updateSeries(
        @Arg('id') id: string,
        @Arg('data') data: SeriesInput,
    ) {
        return prisma.series.update({
            where: {
                id
            },
            data: {
                ...data,
                studio: {
                    connect: data.studio
                }
            },
            include: {
                studio: !!data.studio
            }
        })
    }

    @Mutation(() => Series)
    async deleteMovie(@Arg('id') id: string) {
        return prisma.series.delete({
            where: {
                id
            }
        })
    }


    @Query(() => [Series]) 
    async series() {
        return prisma.series.findMany({
            include: {
                studio: true
            },
        })
    }

}
