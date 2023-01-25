import {
    IsDate,
    IsEnum,
    IsJSON,
    IsOptional,
    IsString,
    IsUUID,
} from '@nestjs/class-validator';
import { ArgsType, Field, ID } from '@nestjs/graphql';
import {
    Gender,
    ProfileCountries,
    ProfileLanguages,
    ProfileType,
    SiteTheme,
    SubscribeTier,
} from '../../../../common/models/enums';
import {
    Gender as GenderPrisma,
    ProfileCountries as ProfileCountriesPrisma,
    ProfileLanguages as ProfileLanguagesPrisma,
    ProfileType as ProfileTypePrisma,
    SiteTheme as SiteThemePrisma,
    SubscribeTier as SubscribeTierPrisma,
} from '@prisma/client';
import { IsArray, Length } from 'class-validator';
import { Integration } from '../integration.model';

@ArgsType()
export class UpdateProfileSettingsInputType {
    @IsUUID()
    @Field(() => ID)
    id: string;

    @IsOptional()
    @IsString()
    @Field(() => String)
    displayed_name: string;

    @IsOptional()
    @IsEnum(Gender)
    @Field(() => Gender)
    gender: GenderPrisma;

    @IsOptional()
    @IsDate()
    @Field(() => Date)
    birthday: Date;

    @IsOptional()
    @IsEnum(SiteTheme)
    @Field(() => SiteTheme)
    site_theme: SiteThemePrisma;

    @IsOptional()
    @IsString()
    @Field(() => String)
    avatar: string;

    @IsOptional()
    @IsString()
    @Field(() => String)
    cover: string;

    @IsOptional()
    @IsEnum(ProfileCountries)
    @Field(() => ProfileCountries)
    country: ProfileCountriesPrisma;

    @IsOptional()
    @IsEnum(ProfileLanguages)
    @Field(() => ProfileLanguages)
    language: ProfileLanguagesPrisma;

    @IsOptional()
    @IsString()
    @Length(1, 10)
    @Field(() => String)
    timezone: string;

    @IsOptional()
    @IsEnum(ProfileType)
    @Field(() => ProfileType)
    profile_type: ProfileTypePrisma;

    @IsOptional()
    @IsArray()
    @Field(() => [Integration])
    integrations: string[];

    @IsOptional()
    @IsEnum(SubscribeTier)
    @Field(() => SubscribeTier)
    subscribe_tier: SubscribeTierPrisma;
}
