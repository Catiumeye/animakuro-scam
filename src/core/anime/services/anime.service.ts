import Database from '../../../database';
import { CreateAnimeInputType } from '../models/inputs/create-anime-input.type';
import { UpdateAnimeInputType } from '../models/inputs/update-anime-input.type';
import { PaginationInputType } from '../../../common/models/inputs';
import { Anime } from '../models/anime.model';

export class AnimeService {
    private readonly prisma = Database.getInstance().logic;

    async getAnime(id: string): Promise<Anime | null> {
        return await this.prisma.anime.findUnique({
            where: {
                id,
            },
        });
    }

    async getAnimeList(args: PaginationInputType): Promise<Anime[]> {
        return await this.prisma.anime.findMany({
            skip: (args.page - 1) * args.perPage,
            take: args.perPage,
        });
    }

    async createAnime(args: CreateAnimeInputType): Promise<Anime> {
        return await this.prisma.anime.create({
            data: args,
        });
    }

    async updateAnime(args: UpdateAnimeInputType): Promise<Anime> {
        return await this.prisma.anime.update({
            where: { id: args.id },
            data: args,
        });
    }

    async deleteAnime(id: string) {
        return await this.prisma.anime.delete({
            where: { id },
        });
    }
}
