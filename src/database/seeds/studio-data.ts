import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const studioData = async () => {
    return [
        {
            id: 'ac9ab0e3-2d72-4e7c-9255-d1a20e49b113',
            created_at: new Date(Date.now()),
            name: 'Anime International',
            rating: 3.2,
            thumbnail: 'https://foo.bar.jpg',
            anime_count: 2,
            anime_starts: 1999,
            anime_ends: 2010,
        },
        {
            id: '9acd2bf7-6fcf-4648-bd03-5e6dbf68a244',
            created_at: new Date(Date.now()),
            name: 'Anime China',
            rating: 5.4,
            thumbnail: 'https://foo.else.jpg',
            anime_count: 1,
            anime_starts: 1999,
            anime_ends: 2010,
        },
    ];
};

export const studioDependencies = async () => {
    const animeList = await prisma.anime.findMany();
    return [
        {
            id: 'ac9ab0e3-2d72-4e7c-9255-d1a20e49b113',
            anime: {
                set: [
                    {
                        id: animeList[0].id,
                    },
                    {
                        id: animeList[1].id,
                    },
                ],
            },
        },
        {
            id: '9acd2bf7-6fcf-4648-bd03-5e6dbf68a244',
            anime: {
                set: [
                    {
                        id: animeList[2].id,
                    },
                ],
            },
        },
    ];
};
