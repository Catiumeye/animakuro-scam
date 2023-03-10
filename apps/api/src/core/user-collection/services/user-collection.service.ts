import { Injectable } from '@nestjs/common';

import { PaginationInputType } from '@app/common/models/inputs';
import { FileUploadService } from '@app/common/services/file-upload.service';
import { PaginationService } from '@app/common/services/pagination.service';
import { PrismaService } from '@app/common/services/prisma.service';
import { StatisticService } from '@app/common/services/statistic.service';
import { entityUpdateUtil } from '@app/common/utils/entity-update.util';
import { transformPaginationUtil } from '@app/common/utils/transform-pagination.util';

import { CreateUserCollectionInputType } from '../models/inputs/create-user-collection-input.type';
import { UpdateUserCollectionInputType } from '../models/inputs/update-user-collection-input.type';
import { GetUserCollectionResultsType } from '../models/results/get-user-collection-results.type';
import { GetListUserCollectionResultsType } from '../models/results/get-list-user-collection-results.type';
import { CreateUserCollectionResultsType } from '../models/results/create-user-collection-results.type';
import { UpdateUserCollectionResultsType } from '../models/results/update-user-collection-results.type';
import { DeleteUserCollectionResultsType } from '../models/results/delete-user-collection-results.type';
import { GetMarkdownCollectionInputType } from '../models/inputs/get-markdown-collection-input.type';
import { CreateMarkdownCollectionInputType } from '../models/inputs/create-markdown-collection-input.type';
import { GetMarkdownCollectionResultsType } from '../models/results/get-markdown-collection-results.type';
import { Prisma } from '@prisma/client';
import { GetUserCollectionInputType } from '../models/inputs';
import { UpdateRatingUserCollectionResultsType } from '../models/results';
import { RatingUserCollection } from '../models/rating-user-collection.model';
import { createUserCollectionOptions } from '../utils/create-user-collection-options';
import { MarkdownService } from '@app/common/services/markdown.service';
import { CreateMarkdownCollectionResultsType } from '../models/results/create-markdown-collection-results.type';
import { UpdateMarkdownCollectionInputType } from '../models/inputs/update-markdown-collection-input.type';
import { UpdateMarkdownCollectionResultsType } from '../models/results/update-user-markdown-collection-results.type';
import { createUserStatisticOptions } from '../../user/utils/create-user-statistic-option.util';


@Injectable()
export class UserCollectionService {
    thumbnailFiles;
    constructor(
        private prisma: PrismaService,
        private paginationService: PaginationService,
        private fileUpload: FileUploadService,
        private statistics: StatisticService,
        private markdownService: MarkdownService,
    ) {
        this.thumbnailFiles = this.fileUpload.getStorageForOne(
            'userFolder',
            'thumbnail_id',
            'userCollectionThumbnails',
        );
    }

    async getUserCollection(id: string): Promise<GetUserCollectionResultsType> {
        const userCollection = await this.prisma.userFolder.findMany({
            where: {
                id,
                is_collection: true,
            },
            include: {
                user_profile: {
                    include: {
                        user_folders: {
                            include: {
                                animes: true,
                            },
                        },
                        user: {
                            include: {
                                auth: true,
                            },
                        },
                        favourite_animes: true,
                        favourite_authors: true,
                        favourite_genres: true,
                        favourite_characters: true,
                        favourite_studios: true,
                    },
                },
                animes: true,
            },
        });

        return {
            success: true,
            errors: [],
            userCollection: (await createUserStatisticOptions(
                userCollection[0],
            )) as any,
        };
    }

    async getUserCollectionListByProfileId(
        user_profile_id: string,
        args: PaginationInputType,
        input: GetUserCollectionInputType,
    ): Promise<GetListUserCollectionResultsType> {
        const prismaOptions = createUserCollectionOptions({
            user_profile_id,
            option: input,
        });
        const userCollectionList = await this.prisma.userFolder.findMany({
            ...transformPaginationUtil(args),
            ...prismaOptions,
        });

        const pagination = await this.paginationService.getPagination(
            'userFolder',
            args,
        );
        return {
            success: true,
            errors: [],
            userCollectionList: (await createUserStatisticOptions(
                userCollectionList,
            )) as any,
            pagination,
        };
    }

    async getUserCollectionList(
        args: PaginationInputType,
        input: GetUserCollectionInputType,
    ): Promise<GetListUserCollectionResultsType> {
        const prismaOptions = createUserCollectionOptions({
            option: input,
        });
        const userCollectionList = await this.prisma.userFolder.findMany({
            ...transformPaginationUtil(args),
            ...prismaOptions,
        });
        const pagination = await this.paginationService.getPagination(
            'userFolder',
            args,
        );
        return {
            success: true,
            errors: [],
            userCollectionList: (await createUserStatisticOptions(
                userCollectionList,
            )) as any,
            pagination,
        };
    }

    async createUserCollection(
        args: CreateUserCollectionInputType,
        user_profile_id: string,
        user_id: string,
    ): Promise<CreateUserCollectionResultsType> {
        const userCollection = await this.prisma.userFolder.create({
            data: {
                ...entityUpdateUtil('animes', args),
                ...args,
                is_collection: true,
                user_profile: {
                    connect: {
                        id: user_profile_id,
                    },
                },
                thumbnail: await this.thumbnailFiles.tryCreate(
                    args.thumbnail,
                    user_id,
                ),
            },
            include: {
                user_profile: {
                    include: {
                        user_folders: {
                            include: {
                                animes: true,
                            },
                        },
                        user: {
                            include: {
                                auth: true,
                            },
                        },
                        favourite_animes: true,
                        favourite_authors: true,
                        favourite_genres: true,
                        favourite_characters: true,
                        favourite_studios: true,
                    },
                },
                animes: true,
                thumbnail: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        return {
            success: true,
            errors: [],
            userCollection: userCollection as any,
        };
    }

    async updateUserCollection(
        args: UpdateUserCollectionInputType,
        user_profile_id: string,
        user_id: string,
    ): Promise<UpdateUserCollectionResultsType> {
        const userCollection = await this.prisma.userFolder.update({
            where: { id: args.id },
            data: {
                ...entityUpdateUtil('animes', args),
                ...args,
                user_profile: {
                    connect: {
                        id: user_profile_id,
                    },
                },
                thumbnail: await this.thumbnailFiles.tryUpdate(
                    { id: args.id },
                    args.thumbnail,
                    undefined,
                    user_id,
                ),
            },
            include: {
                user_profile: {
                    include: {
                        user_folders: {
                            include: {
                                animes: true,
                            },
                        },
                        user: {
                            include: {
                                auth: true,
                            },
                        },
                        favourite_animes: true,
                        favourite_authors: true,
                        favourite_genres: true,
                        favourite_characters: true,
                        favourite_studios: true,
                    },
                },
                animes: true,
                thumbnail: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        return {
            success: true,
            errors: [],
            userCollection: userCollection as any,
        };
    }

    async deleteUserCollection(
        id: string,
    ): Promise<DeleteUserCollectionResultsType> {
        await this.thumbnailFiles.tryDeleteAll({ id });
        const userCollection = await this.prisma.userFolder.delete({
            where: { id },
            include: {
                user_profile: {
                    include: {
                        user_folders: {
                            include: {
                                animes: true,
                            },
                        },
                        user: {
                            include: {
                                auth: true,
                            },
                        },
                        favourite_animes: true,
                        favourite_authors: true,
                        favourite_genres: true,
                        favourite_characters: true,
                        favourite_studios: true,
                    },
                },
                animes: true,
                thumbnail: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        return {
            success: true,
            errors: [],
            userCollection: userCollection as any,
        };
    }

    async getMarkdownCollection(
        args: GetMarkdownCollectionInputType,
        user_id: string,
    ): Promise<GetMarkdownCollectionResultsType> {
        const str =
            '**?????? ???????????? ?????????? **\n' +
            '<anime:02bfd954-3cf5-47a1-953b-daad7054c6d6,59b92892-1258-43a9-8d68-3db4f3b076b5 columns=8 size=large>' +
            '<studio:2a968ac7-b82a-41ce-beb6-25f790a4b31b,e34522f4-6656-4d97-a0f5-728089494bef columns=3 shape=circle>' +
            '<character:6b2c741d-ed72-4c38-a0f6-53c9f0f69daf>' +
            '<author:75f855d1-9148-434c-8552-07fdb1c277a4,bc9ee071-5935-4d1f-a99f-9f2c1a0646e3>';
        let markdown: any = '';
        if (args.id) {
            markdown = await this.prisma.userCollectionMardown.findUnique({
                where: {
                    id: args.id,
                },
            });
        }

        if (!args.id) {
            markdown = await this.prisma.userCollectionMardown.findUnique({
                where: {
                    user_id,
                },
            });
        }

        markdown = markdown?.markdown || '';

        const data = await this.markdownService.getConverted(str);
        
        return {
            success: true,
            markdown: markdown || str,
            data: data as any,
        };
    }

    async createMarkdownCollection(
        args: CreateMarkdownCollectionInputType,
        user_id: string,
    ): Promise<CreateMarkdownCollectionResultsType> {
        console.log('args', args);
        console.log('userid', user_id);

        const createdMarkdown = await this.prisma.userCollectionMardown.create({
            data: {
                markdown: args.markdown,
                user_id: user_id,
            },
        });

        const parsedMarkdown = await this.markdownService.getConverted(
            createdMarkdown.markdown,
        );
        
        return {
            success: true,
            markdown: args.markdown,
            data: parsedMarkdown,
        };
    }

    async updateMarkdownCollection(
        args: UpdateMarkdownCollectionInputType,
        user_id: string,
    ): Promise<UpdateMarkdownCollectionResultsType> {
        let updatedMarkdown: any = null;

        console.log(args);

        if (args.id) {
            console.log('ID');

            updatedMarkdown = await this.prisma.userCollectionMardown.update({
                where: {
                    id: args.id,
                },
                data: {
                    markdown: args.markdown,
                },
            });
        }

        if (!args.id) {
            console.log('TOKEN');

            updatedMarkdown = await this.prisma.userCollectionMardown.update({
                where: {
                    user_id,
                },
                data: {
                    markdown: args.markdown,
                },
            });
        }

        const parsedMarkdown = await this.markdownService.getConverted(
            updatedMarkdown.markdown,
        );

        return {
            success: true,
            markdown: args.markdown,
            data: JSON.stringify(parsedMarkdown),
        };
    }

    async updateRatingUserCollection(
        args: RatingUserCollection,
    ): Promise<UpdateRatingUserCollectionResultsType> {
        let ratingUserCollection: RatingUserCollection;

        const existRating = await this.prisma.ratingUserCollection.findUnique({
            where: {
                user_profile_id_collection_id: {
                    collection_id: args.collection_id,
                    user_profile_id: args.user_profile_id,
                },
            },
        });
        if (existRating) {
            ratingUserCollection =
                await this.prisma.ratingUserCollection.update({
                    data: args,
                    where: {
                        user_profile_id_collection_id: {
                            collection_id: args.collection_id,
                            user_profile_id: args.user_profile_id,
                        },
                    },
                });
            this.statistics.fireEvent(
                'userCollectionRate',
                {
                    collectionId: args.collection_id,
                    stars: existRating.rating,
                },
                -1,
            );
        } else {
            ratingUserCollection =
                await this.prisma.ratingUserCollection.create({
                    data: args,
                });
        }
        this.statistics.fireEvent(
            'userCollectionRate',
            {
                collectionId: args.collection_id,
                stars: args.rating,
            },
            1,
        );

        return {
            success: true,
            errors: [],
            rating: ratingUserCollection.rating,
        };
    }
}
