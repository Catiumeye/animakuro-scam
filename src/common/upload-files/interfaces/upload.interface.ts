import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { GraphQLUpload } from 'graphql-upload';
import { ArgsType, Field } from '@nestjs/graphql';
import { Stream } from '@animakuro/animakuro-cdn';

@ValidatorConstraint()
class imageUpload implements ValidatorConstraintInterface {
    async validate(image: IUpload) {
        const { mimetype } = await image;

        const mimeTypes: string[] = ['image/gif', 'image/png', 'image/jpeg'];
        if (mimeTypes.includes(mimetype)) {
            return true;
        }
        return false;
    }
}

export function isImage(validationOptions?: ValidationOptions) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: imageUpload,
        });
    };
}

export interface IUpload {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => Stream;
}

@ArgsType()
export class FileUploadDto {
    @Field(() => GraphQLUpload)
    @isImage({ message: 'Only png,jpeg and gif images are allowed' })
    file: IUpload;
}

@ArgsType()
export class FilesUploadDto {
    @Field(() => [GraphQLUpload])
    @isImage({
        message: 'Only png,jpeg and gif images are allowed',
        each: true,
    })
    files: [IUpload];
}
