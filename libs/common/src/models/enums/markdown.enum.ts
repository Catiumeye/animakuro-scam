import { registerEnumType } from "@nestjs/graphql"

export enum MarkdownArgsSize {
    SMALL = 'small',
    MEDIUM = 'large',
    LARGE = 'large',
}

registerEnumType(MarkdownArgsSize, {
    name: 'MarkdownArgsSize'
})

export enum MarkdownArgsShape {
    CIRCLE = 'circle',
    SQUARE = 'square',
    RHOMBUS = 'rhombus',
}

registerEnumType(MarkdownArgsShape, {
    name: 'MarkdownArgsShape'
})

export enum MarkdownEntities {
    ANIME = 'anime', 
    STUDIO = 'studio', 
    AUTHOR = 'author', 
    CHARACTER = 'character',
}

registerEnumType(MarkdownEntities, {
    name: 'MarkdownEntities'
})