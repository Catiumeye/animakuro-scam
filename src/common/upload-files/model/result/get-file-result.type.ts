import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetFileResultType {
    @Field(() => String)
    uploader: string;

    @Field(() => String)
    file_id: string;

    @Field(() => String)
    cdn_bucket: string;

    @Field(() => String)
    url: string;
}

@ObjectType('GetFilesResults')
export class GetFilesResultsType {
    @Field(() => [GetFileResultType])
    files: GetFileResultType[];
}
