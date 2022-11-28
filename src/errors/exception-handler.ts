import { ArgumentValidationError } from "type-graphql";
import type { ServerResponse } from 'http';

import { GqlHttpException, HttpStatus } from "./errors";
import type { ExtendedGraphQLError } from "./types";
import { formatClassValidatorErrors } from "./utilts";


const handleExceptions = (error: ExtendedGraphQLError) => {
    if (error.originalError instanceof GqlHttpException) {
        return error.originalError
    }

    if (error.originalError instanceof ArgumentValidationError) {
        const validationErrors = error.originalError.validationErrors;

        return new GqlHttpException(
            formatClassValidatorErrors(validationErrors), HttpStatus.BAD_REQUEST, 'validationErrors'
        );
    }
}

const exceptionsHandler = (error: ExtendedGraphQLError, response: ServerResponse): GqlHttpException => {
    const exception = handleExceptions(error);

    // unexpected errors
    if (!exception) {
        console.error(error);

        return new GqlHttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR, 'Unexpected error');
    }

    response.statusCode = exception.statusCode;

    return exception;
}
 

export default exceptionsHandler;

