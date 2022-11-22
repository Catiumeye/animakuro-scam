import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { prisma } from '../../index'
import { Series, SeriesInput } from './series.schema'
 
@Resolver()
export class SeriesResolver {
    @Mutation(() => Series)
    async createSeries(
        @Arg('data') data: SeriesInput,
    ) {
        const series = prisma.series.create({
            data: {
                ...data,
                studio: {
                    connect: data.studio
                }
            },
            include: {
                studio: true
            }
        })

        return series
    }

    @Query(() => [Series]) 
    async series() {
        return prisma.series.findMany()
    }

    @Mutation(() => Series)
    async deleteMovie(@Arg('id') id: string) {
        return prisma.series.delete({
            where: {
                id
            }
        })
    }
}
