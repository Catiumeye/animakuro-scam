import { Injectable } from "@nestjs/common";
import { MarkdownEntities } from "../models/enums/markdown.enum";
import { PrismaService } from "./prisma.service";


const entitySelect = {
    anime: {
        id: true,
        title: true,
        score: true,
        format: true,
        episodes: true,
        rating: true,
        //is_favourite
        cover: {
            select: {
                url: true
            }
        },
        date_start: true   
    },
    character: {
        id: true,
        name: true,
        cover: true,
        // is_favourite
    },
    studio: {
        id: true,
        name: true,
        rating: true,
        thumbnail: {
            select: {
                url: true
            }
        },
        anime_count: true,
        // is_favourite
    },
    author: {
        id: true,
        name: true,
        cover: {
            select: {
                url: true
            }
        }
        // is_favourite
    }
}
const AttrParams = ['columns', 'size', 'shape'];

@Injectable()
export class MarkdownService {
    private REGEX = new RegExp(`<(${Object.values(MarkdownEntities).join('|')}):(([a-f\\d-]{36},?)+)((\\s+(${AttrParams.join('|')})=(\\w+))*)>`, 'ig');
    private IMAGE_FIELDS = ['thumbnail', 'cover', 'banner'];
    private TITLE_FIELDS = ['name'];


    constructor(
        private readonly prisma: PrismaService
    ) {}

    public parseAttrs(markdown: string) {
        const tags = markdown.matchAll(this.REGEX);
        const arrayTags = [...tags];

        const parsedcollectionData = []
        for (let i = 0; i < arrayTags.length; i++) {
            const entity = arrayTags[i][1];
            const id_list = arrayTags[i][2].split(',');
            const args = arrayTags[i][4].trim().split(' ')
                .reduce((prev, current) => {
                    const [key, value] = current.split('=');
                    return key ?
                        {...prev, [key]: value} :
                        prev;       
                }, {});

            parsedcollectionData.push({
                entity: entity,
                id_list: id_list,
                args: args
            })
        }
        return parsedcollectionData;
    }

    public async receivingData(parsedcollectionData: any): Promise<Array<{[key: string]: any}>> {
        const promisesCollectionData = []
        for (let i = 0; i < parsedcollectionData.length; i++) {
            const entity = parsedcollectionData[i].entity;
            // @ts-ignore
            const primiseCollectionDataItem = this.prisma[entity].findMany({
                where: {
                    id: {
                        in: parsedcollectionData[i].id_list
                    }
                },
                // @ts-ignore
                select: entitySelect[entity]
            });
            promisesCollectionData.push(primiseCollectionDataItem)
        }

        return await Promise.all(promisesCollectionData);
    }


    /**
     * Transform all fields to single standard
     * Example:: 'cover.url' or 'thumbnail.url' to 'img_url'
     * Example:: 'name' to 'title'
     */
    private transformDataFields(data: Array<{[key: string]: any}>) {
        const transformedData = data.map(item => {
            const returnObj: {[key: string]: any} = {...item};
            
            //title field
            const foundTitleField = this.TITLE_FIELDS.find(titleField => item.hasOwnProperty(titleField));
            if (foundTitleField) {
                returnObj.title = item[foundTitleField];
                delete returnObj[foundTitleField];
            }

            //image field
            const foundImgField = this.IMAGE_FIELDS.find(imgField => item.hasOwnProperty(imgField));
            if (foundImgField) {
                returnObj.img_url = item[foundImgField]?.url || null;
                delete returnObj[foundImgField];
            } 

            return returnObj;  
        })
        
        return transformedData;
    }

    public async normalizeData(parsedData: Array<{[key: string]: any}>, receivedData: any) {
        const completeData = [];
        for (let i = 0; i < parsedData.length; i++) {
            const entity = parsedData[i].entity;
            const args = parsedData[i].args;
            const data = this.transformDataFields(receivedData[i]);
            
            completeData.push({entity, args, data});
        }

        return completeData;
    }

    public async getConverted(markdown?: string | null) {
        if (!markdown) return undefined;

        //Markdown to json form
        const parsedData = this.parseAttrs(markdown);
        
        //Getting data from tags
        const receivedData = await this.receivingData(parsedData);  

        //Prettify data
        const normalizedData = this.normalizeData(parsedData, receivedData);

        return normalizedData;
    }
}