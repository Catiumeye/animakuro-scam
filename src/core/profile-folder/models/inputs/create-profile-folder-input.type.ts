import { IsUUID, Length } from '@nestjs/class-validator';
import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ArgsType()
export class CreateProfileFolderInputType {
    @IsUUID()
    @Field(() => ID)
    profile_id: string;

    @IsString()
    @Length(1, 25)
    @Field(() => String)
    name: string;

    @IsString()
    @Field(() => String)
    description: string;

    @IsOptional()
    @IsUUID(4, { each: true })
    @Field(() => [ID], { nullable: true })
    animes_add: string;

    /*@IsOptional()
    @IsNumber()
    @Field(() => Int, { nullable: true, description: 'какой эпизод(серию)' })
    episode?: number;

    @IsOptional()
    @IsNumber()
    @Field(() => Int, {
        nullable: true,
        description: 'секунды: продолжительность этого эпизода',
    })
    episode_duration?: number;                                                                     СТАТИСТИКИ НЕТ!!!!

    @IsOptional()
    @IsNumber()
    @Field(() => Int, {
        nullable: true,
        description: 'секунды: сколько просмотрел из этой серии',
    })
    watched_duration?: number;*/
}
