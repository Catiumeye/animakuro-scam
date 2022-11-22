import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { prisma } from '../../index'
import { Movie, MovieInput } from './movie.schema'
 
@Resolver()
export class MovieResolver {
    @Mutation(() => Movie)
    async createMovie(
        @Arg('data') data: MovieInput,
    ) {
        console.log(data)
        const movie = prisma.movie.create({
            data: {
                name: data.name,
                studio: {
                    connect: {
                        id: data.studio.id
                    }
                }
            },

        })


        return movie
    }

    @Query(() => [Movie]) 
    async movies() {
        return prisma.movie.findMany()
    }

    @Mutation(() => Movie)
    async deleteMovie(@Arg('id') id: string) {
        return prisma.movie.delete({
            where: {
                id
            }
        })
    }
}
