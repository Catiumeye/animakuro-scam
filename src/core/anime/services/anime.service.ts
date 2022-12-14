import Database from '../../../database';
import { CreateAnimeInputType } from '../inputs/create-anime-input.type';
import { Anime } from '../schemas/anime.schema';
import { UpdateAnimeInputType } from '../inputs/update-anime-input.type';
import { PaginationInputType } from "../../../common/inputs/pagination-input.type";

export class AnimeService {
    private readonly prisma = Database.getInstance().logic;

    async getAnimeList(args: PaginationInputType): Promise<Anime[]> {
        return await this.prisma.anime.findMany({
            skip: args.skip,
            take: args.take,
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