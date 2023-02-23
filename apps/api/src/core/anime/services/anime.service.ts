import { Injectable } from '@nestjs/common';

import { AnimeApproval, AnimeRelation } from '@app/common/models/enums';
import { PaginationInputType } from '@app/common/models/inputs';
import { FileUploadService } from '@app/common/services/file-upload.service';
import { PaginationService } from '@app/common/services/pagination.service';
import { PrismaService } from '@app/common/services/prisma.service';
import { StatisticService } from '@app/common/services/statistic.service';
import { entityUpdateUtil } from '@app/common/utils/entity-update.util';
import { transformPaginationUtil } from '@app/common/utils/transform-pagination.util';

import { CreateAnimeInputType } from '../models/inputs/create-anime-input.type';
import { UpdateAnimeInputType } from '../models/inputs/update-anime-input.type';
import { GetAnimeResultsType } from '../models/results/get-anime-results.type';
import { GetListAnimeResultsType } from '../models/results/get-list-anime-results.type';
import { CreateAnimeResultsType } from '../models/results/create-anime-results.type';
import { UpdateAnimeResultsType } from '../models/results/update-anime-results.type';
import { DeleteAnimeResultsType } from '../models/results/delete-anime-results.type';
import { GetListRelatedAnimeByAnimeIdResultsType } from '../models/results/get-list-related-anime-by-anime-id-results.type';
import { GetListSimilarAnimeByAnimeIdResultsType } from '../models/results/get-list-similar-anime-by-anime-id-results.type';
import { relationAnimeUpdateUtil } from '../utils/relation-anime-update.util';
import { GetAnimeByIdInputType } from '../models/inputs/get-anime-by-id-input.type';
import { Studio } from '../../studio/models/studio.model';
import { UpdateRatingAnimeResultsType } from '../models/results/update-rating-anime-result.type';
import { Rating } from '../models/rating.model';

@Injectable()
export class AnimeService {
    bannerFiles;
    coverFiles;

    constructor(
        private prisma: PrismaService,
        private fileUpload: FileUploadService,
        private paginationService: PaginationService,
        private statistics: StatisticService,
    ) {
        this.bannerFiles = this.fileUpload.getStorageForOne('anime', 'banner_id', 'animeBanners');
        this.coverFiles = this.fileUpload.getStorageForOne('anime', 'cover_id', 'animeCovers');
    }

    async getAnime(
        args: GetAnimeByIdInputType,
        user_id: string,
    ): Promise<GetAnimeResultsType> {
        const {
            id,
            max_authors_count,
            max_characters_count,
            max_similar_by_animes_count,
            max_related_by_animes_count,
            max_openings_count,
            max_endings_count,
            min_opening_start,
            min_ending_start,
        } = args;

        const anime = await this.prisma.anime.findUnique({
            where: {
                id,
            },
            include: {
                genres: true,
                authors: {
                    take: max_authors_count,
                },
                characters: {
                    take: max_characters_count,
                },
                studios: true,
                related_by_animes: {
                    take: max_similar_by_animes_count,
                    include: {
                        child_anime: true,
                    },
                },
                similar_by_animes: {
                    take: max_related_by_animes_count,
                    include: {
                        child_anime: true,
                    },
                },
                airing_schedule: true,
                favourite_by: {
                    select: {
                        id: true,
                    },
                },
                banner: {
                    include: {
                        user: true,
                    },
                },
                cover: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        let openings;
        let endings;

        if (max_openings_count) {
            openings = await this.prisma.openingEnding.findMany({
                where: {
                    anime_id: id,
                    type: 'OPENING',
                    episode_end: { gte: min_opening_start },
                },
                orderBy: { episode_start: 'asc' },
                take: max_openings_count,
            });
        }
        if (max_endings_count) {
            endings = await this.prisma.openingEnding.findMany({
                where: {
                    anime_id: id,
                    type: 'ENDING',
                    episode_end: { gte: min_ending_start },
                },
                orderBy: { episode_start: 'asc' },
                take: max_endings_count,
            });
        }

        const opening_ending = [];
        if (openings) opening_ending.push(...openings);
        if (endings) opening_ending.push(...endings);

        const favourite = anime?.favourite_by.find((el) => el.id == user_id);
        if (favourite) {
            return {
                success: true,
                errors: [],
                anime: {
                    ...anime,
                    opening_ending,
                    openings,
                    endings,
                    is_favourite: true,
                } as any,
            };
        }

        return {
            success: true,
            errors: [],
            anime: {
                ...anime,
                opening_ending,
                openings,
                endings,
            } as any,
        };
    }

    async getAnimeList(
        args: PaginationInputType,
        user_id: string,
    ): Promise<GetListAnimeResultsType> {
        const animeList: any = await this.prisma.anime.findMany({
            ...transformPaginationUtil(args),
            include: {
                genres: true,
                authors: true,
                characters: true,
                studios: true,
                related_by_animes: {
                    include: {
                        child_anime: true,
                    },
                },
                similar_by_animes: {
                    include: {
                        child_anime: true,
                    },
                },
                airing_schedule: true,
                opening_ending: {
                    orderBy: { episode_start: 'asc' },
                    take: 2,
                },
                favourite_by: {
                    select: {
                        id: true,
                    },
                },
                banner: {
                    include: {
                        user: true,
                    },
                },
                cover: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        const pagination = await this.paginationService.getPagination(
            'anime',
            args,
        );

        for await (const anime of animeList) {
            const favourite = anime?.favourite_by?.find(
                (el: any) => el.id == user_id,
            );
            if (favourite) {
                anime.is_favourite = true;
            }
        }
        return {
            success: true,
            errors: [],
            anime_list: animeList,
            pagination,
        };
    }

    async getRelatedAnimeListByAnimeId(
        id: string,
        args: PaginationInputType,
        user_id: string,
    ): Promise<GetListRelatedAnimeByAnimeIdResultsType> {
        const animeList: any = await this.prisma.relatingAnime.findMany({
            where: { parent_anime_id: id },
            ...transformPaginationUtil(args),
            include: {
                parent_anime: true,
                child_anime: true,
                favourite_by: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        const pagination = await this.paginationService.getPagination(
            'relatingAnime',
            args,
            // {
            //     nested_field: 'animes',
            //     search_property: 'id',
            //     search_value: id,
            // },
        );

        for await (const anime of animeList) {
            const favourite = anime?.favourite_by.find(
                (el: any) => el.id == user_id,
            );
            if (favourite) {
                anime.is_favourite = true;
            }
        }

        return {
            success: true,
            errors: [],
            anime_list: animeList as any,
            pagination,
        };
    }

    async getSimilarAnimeListByAnimeId(
        id: string,
        args: PaginationInputType,
        user_id: string,
    ): Promise<GetListSimilarAnimeByAnimeIdResultsType> {
        const animeList: any = await this.prisma.similarAnime.findMany({
            where: { parent_anime_id: id },
            ...transformPaginationUtil(args),
            include: {
                parent_anime: true,
                child_anime: true,
                favourite_by: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        const pagination = await this.paginationService.getPagination(
            'similarAnime',
            args,
            // {
            //     nested_field: 'animes',
            //     search_property: 'id',
            //     search_value: id,
            // },
        );

        for await (const anime of animeList) {
            const favourite = anime?.favourite_by.find(
                (el: any) => el.id == user_id,
            );
            if (favourite) {
                anime.is_favourite = true;
            }
        }

        return {
            success: true,
            errors: [],
            anime_list: animeList as any,
            pagination,
        };
    }

    async createAnime(
        args: CreateAnimeInputType,
        user_id: string,
    ): Promise<CreateAnimeResultsType> {
        const anime = await this.prisma.anime.create({
            data: {
                ...entityUpdateUtil('genres', args),
                ...entityUpdateUtil('authors', args),
                ...entityUpdateUtil('characters', args),
                ...entityUpdateUtil('studios', args),
                ...relationAnimeUpdateUtil('related_by_animes', args),
                ...relationAnimeUpdateUtil('similar_by_animes', args),
                ...args,
                banner: await this.bannerFiles.tryCreate(args.banner, user_id),
                cover: await this.coverFiles.tryCreate(args.cover, user_id),
            },
            include: {
                genres: true,
                authors: true,
                characters: true,
                studios: {
                    include: {
                        animes: true,
                    },
                },
                related_by_animes: {
                    include: {
                        child_anime: true,
                    },
                },
                similar_by_animes: {
                    include: {
                        child_anime: true,
                    },
                },
                airing_schedule: true,
                banner: {
                    include: {
                        user: true,
                    },
                },
                cover: {
                    include: {
                        user: true,
                    },
                },
            } as any,
        });

        if (anime && anime.studios) {
            await this.updateStudioData(anime.studios);
        }

        return {
            success: true,
            anime: anime as any,
        };
    }

    async updateAnime(
        args: UpdateAnimeInputType,
        user_id: string,
    ): Promise<UpdateAnimeResultsType> {
        const anime = await this.prisma.anime.update({
            where: { id: args.id },
            data: {
                ...entityUpdateUtil('genres', args),
                ...entityUpdateUtil('authors', args),
                ...entityUpdateUtil('characters', args),
                ...entityUpdateUtil('studios', args),
                ...relationAnimeUpdateUtil('related_by_animes', args),
                ...relationAnimeUpdateUtil('similar_by_animes', args),
                ...args,
                banner: await this.bannerFiles.tryUpdate({ id: args.id }, args.banner, undefined, user_id),
                cover: await this.coverFiles.tryUpdate({ id: args.id }, args.cover, undefined, user_id),
            },
            include: {
                genres: true,
                authors: true,
                characters: true,
                studios: {
                    include: {
                        animes: true,
                    },
                },
                related_by_animes: {
                    include: {
                        child_anime: true,
                    },
                },
                similar_by_animes: {
                    include: {
                        child_anime: true,
                    },
                },
                airing_schedule: true,
                banner: {
                    include: {
                        user: true,
                    },
                },
                cover: {
                    include: {
                        user: true,
                    },
                },
            } as any,
        });

        if (anime && anime.studios) {
            await this.updateStudioData(anime.studios);
        }

        // TODO: [statistic] change of type and/or genres

        return {
            success: true,
            errors: [],
            anime: anime as any,
        };
    }

    async addRelatedAnime(
        id: string,
        relating_animes_add: string[],
        related_status: AnimeRelation[],
    ): Promise<UpdateAnimeResultsType> {
        for (let i = 0; i < relating_animes_add.length; i++) {
            await this.prisma.relatingAnime.create({
                data: {
                    parent_anime_id: id,
                    child_anime_id: relating_animes_add[i],
                    status: related_status[i],
                },
            });
        }

        const anime = await this.prisma.anime.findUnique({
            where: { id },
            include: {
                related_by_animes: {
                    include: {
                        child_anime: true,
                    },
                },
            } as any,
        });

        return {
            success: true,
            errors: [],
            anime: anime as any,
        };
    }

    async updateRelatedAnime(
        id: string,
        relating_animes_add: string[],
        related_status: AnimeRelation[],
    ): Promise<UpdateAnimeResultsType> {
        for (let i = 0; i < relating_animes_add.length; i++) {
            await this.prisma.relatingAnime.update({
                where: {
                    child_anime_id_parent_anime_id: {
                        parent_anime_id: id,
                        child_anime_id: relating_animes_add[i],
                    },
                },
                data: {
                    status: related_status[i],
                },
            });
        }

        const anime = await this.prisma.anime.findUnique({
            where: { id },
            include: {
                related_by_animes: {
                    include: {
                        child_anime: true,
                    },
                },
            },
        });

        return {
            success: true,
            errors: [],
            anime: anime as any,
        };
    }

    async deleteRelatedAnime(
        id: string,
        relating_animes_remove: string[],
    ): Promise<UpdateAnimeResultsType> {
        for (const relating of relating_animes_remove) {
            await this.prisma.relatingAnime.delete({
                where: {
                    child_anime_id_parent_anime_id: {
                        child_anime_id: relating,
                        parent_anime_id: id,
                    },
                },
            });
        }

        const anime = await this.prisma.anime.findUnique({
            where: { id },
        });

        return {
            success: true,
            errors: [],
            anime: anime as any,
        };
    }

    async addSimilarAnime(
        id: string,
        similar_animes_add: string[],
    ): Promise<UpdateAnimeResultsType> {
        for (let i = 0; i < similar_animes_add.length; i++) {
            await this.prisma.similarAnime.create({
                data: {
                    parent_anime_id: id,
                    child_anime_id: similar_animes_add[i],
                    status: AnimeApproval.PENDING,
                },
            });
        }

        const anime = await this.prisma.anime.findUnique({
            where: { id },
            include: {
                similar_by_animes: {
                    include: {
                        child_anime: true,
                    },
                },
            } as any,
        });

        return {
            success: true,
            errors: [],
            anime: anime as any,
        };
    }

    async updateSimilarAnime(
        id: string,
        similar_animes_add: string[],
        status: AnimeApproval[],
    ): Promise<UpdateAnimeResultsType> {
        for (let i = 0; i < similar_animes_add.length; i++) {
            await this.prisma.similarAnime.update({
                where: {
                    child_anime_id_parent_anime_id: {
                        parent_anime_id: id,
                        child_anime_id: similar_animes_add[i],
                    },
                },
                data: {
                    status: status[i],
                },
            });
        }

        const anime = await this.prisma.anime.findUnique({
            where: { id },
            include: {
                similar_by_animes: {
                    include: {
                        child_anime: true,
                    },
                },
            },
        });

        return {
            success: true,
            errors: [],
            anime: anime as any,
        };
    }

    async deleteSimilarAnime(
        id: string,
        similar_animes_remove: string[],
    ): Promise<UpdateAnimeResultsType> {
        for (const similar of similar_animes_remove) {
            await this.prisma.similarAnime.delete({
                where: {
                    child_anime_id_parent_anime_id: {
                        child_anime_id: similar,
                        parent_anime_id: id,
                    },
                },
            });
        }

        const anime = await this.prisma.anime.findUnique({
            where: { id },
        });

        return {
            success: true,
            errors: [],
            anime: anime as any,
        };
    }

    async deleteAnime(id: string): Promise<DeleteAnimeResultsType> {
        await Promise.all([
            this.bannerFiles.tryDeleteAll({ id }),
            this.coverFiles.tryDeleteAll({ id }),
        ]);
        const anime = (await this.prisma.anime.delete({
            where: { id },
            include: {
                genres: true,
                authors: true,
                characters: true,
                studios: {
                    include: {
                        animes: true,
                    },
                },
                relating_animes: true,
                similar_animes: true,
                airing_schedule: true,
                banner: {
                    include: {
                        user: true,
                    },
                },
                cover: {
                    include: {
                        user: true,
                    },
                },
            },
        })) as any;

        if (anime && anime.studios) {
            await this.updateStudioData(anime.studios);
        }

        return {
            success: true,
            errors: [],
            anime: anime as any,
        };
    }

    private async updateStudioData(studios: any[]) {
        studios.map(async (studio) => {
            const anime_count = await this.prisma.studio
                .findUnique({
                    where: { id: studio.id },
                    include: {
                        _count: {
                            select: {
                                animes: true,
                            },
                        },
                    },
                })
                .then((item) => item?._count.animes ?? 0);

            const animeYearArray: number[] = await this.prisma.anime
                .findMany({
                    where: {
                        id: {
                            in: studio.animes.map((anime: any) => anime.id),
                        },
                    },
                    orderBy: { year: 'asc' },
                })
                .then((animes) => animes.map((anime) => anime.year));

            await this.prisma.studio.update({
                where: {
                    id: studio.id,
                },
                data: {
                    anime_count,
                    anime_starts: animeYearArray[0],
                    anime_ends: animeYearArray[animeYearArray?.length - 1],
                },
            });
        });
    }

    async updateRatingAnime(
        data: Rating,
    ): Promise<UpdateRatingAnimeResultsType> {
        let ratingResult: Rating;

        const existRating = await this.prisma.ratingAnime.findUnique({
            where: {
                anime_id_user_id: {
                    anime_id: data.anime_id,
                    user_id: data.user_id,
                },
            },
        });

        if (existRating) {
            ratingResult = await this.prisma.ratingAnime.update({
                data,
                where: {
                    anime_id_user_id: {
                        anime_id: data.anime_id,
                        user_id: data.user_id,
                    },
                },
            });
            this.statistics.fireEvent('animeRate', {
                animeId: data.anime_id,
                stars: existRating.rating,
            }, -1);
        } else {
            ratingResult = await this.prisma.ratingAnime.create({
                data,
            });
        }

        this.statistics.fireEvent('animeRate', {
            animeId: data.anime_id,
            stars: data.rating,
        }, 1);

        return {
            success: true,
            errors: [],
            rating: ratingResult.rating,
        };
    }
}