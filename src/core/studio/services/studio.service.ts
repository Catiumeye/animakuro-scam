import { Database } from '../../../loaders';
import { PaginationInputType } from '../../../common/models/inputs';
import { PaginationService } from '../../../common/services';
import { ICustomContext } from '../../../common/models/interfaces';
import { DeleteStudioResultsType } from '../models/results/delete-studio-results.type';
import { GetStudioResultsType } from '../models/results/get-studio-results.type';
import { GetListStudioResultsType } from '../models/results/get-list-studio-results.type';
import { UpdateStudioInputType } from '../models/inputs/update-studio-input.type';
import { UpdateStudioResultsType } from '../models/results/update-studio-results.type';
import { CreateStudioInputType } from '../models/inputs/create-studio-input.type';
import { CreateStudioResultsType } from '../models/results/create-studio-results.type';
import { entityUpdateUtil } from '../../../common/utils/entity-update.util';
import { transformPaginationUtil } from '../../../common/utils/transform-pagination.util';
import { Studio } from '../models/studio.model';

export class StudioService {
    private readonly prisma = new Database().logic;
    protected readonly paginationService: PaginationService =
        new PaginationService('studio');

    async getStudio(id: string): Promise<GetStudioResultsType> {
        const studio = await this.prisma.studio.findUnique({
            where: {
                id,
            },
            include: {
                anime: {
                    include: {
                        genres: true,
                        authors: true,
                        characters: true,
                    },
                },
            },
        });
        if (!studio) {
            return {
                success: false,
                studio: null,
            };
        }
        return {
            success: true,
            studio: studio as any,
            errors: [],
        };
    }

    async getStudioList(
        args: PaginationInputType,
    ): Promise<GetListStudioResultsType> {
        const studioList = await this.prisma.studio.findMany({
            ...transformPaginationUtil(args),
            include: {
                anime: {
                    include: {
                        genres: true,
                        authors: true,
                        characters: true,
                    },
                },
            },
        });
        const pagination = await this.paginationService.getPagination(args);
        return {
            success: true,
            errors: [],
            studioList: studioList as Array<Studio>,
            pagination,
        };
    }

    async createStudio(
        args: CreateStudioInputType,
        ctx: ICustomContext,
    ): Promise<CreateStudioResultsType> {
        const studio = await this.prisma.studio.create({
            data: {
                ...await this.calculateAdditionalFields(args),
                ...entityUpdateUtil('anime', args),
                ...args,
            },
            include: {
                anime: {
                    include: {
                        genres: true,
                        authors: true,
                        characters: true,
                    },
                },
            },
        });
        return {
            success: true,
            studio: studio as any,
        };
    }

    async updateStudio(
        args: UpdateStudioInputType,
        ctx: ICustomContext,
    ): Promise<UpdateStudioResultsType> {
        const studio = await this.prisma.studio.update({
            where: { id: args.id },
            data: {
                ...await this.calculateAdditionalFields(args),
                ...entityUpdateUtil('anime', args),
                ...args,
            },
            include: {
                anime: {
                    include: {
                        genres: true,
                        authors: true,
                        characters: true,
                    },
                },
            },
        });
        if (!studio) {
            return {
                success: false,
                studio: null,
            };
        }
        return {
            success: true,
            studio: studio as any,
        };
    }

    async deleteStudio(
        id: string,
        ctx: ICustomContext,
    ): Promise<DeleteStudioResultsType> {
        const studio = await this.prisma.studio.delete({
            where: { id },
            include: {
                anime: {
                    include: {
                        genres: true,
                        authors: true,
                        characters: true,
                    },
                },
            },
        });
        return {
            success: true,
            studio: studio as Studio
        };
    }

    private async calculateAdditionalFields(
        args: CreateStudioInputType | UpdateStudioInputType
    ) {
        let animeCount: number;
        if (args instanceof CreateStudioInputType) {
            animeCount = args.animeToAdd.length;
        }
        if (args instanceof UpdateStudioInputType) {
            animeCount = await this.prisma.studio
                .findUnique({
                    where: { id: args.id },
                    include: {
                        _count: {
                            select: {
                                anime: true
                            }
                        }
                    }
                })
                .then((item) => item?._count.anime ?? 0);
        }
        const animeYearArray: number[] = await this.prisma.anime
            .findMany({
                where: { id: { in: args.animeToAdd } },
                orderBy: { year: "asc" }
            })
            .then((array) => array.map((item) => item.year));
        return {
            // @ts-ignore
            anime_count: animeCount,
            anime_starts: animeYearArray[0],
            anime_ends: animeYearArray[animeYearArray?.length - 1]
        };
    }
}