import type { ValidationError } from "class-validator";

export function formatClassValidatorErrors(errors: ValidationError[], parentProp="", formatedErrors: string[] = []): string[] {
    for (const error of errors) {
        if (error.constraints) {
            if (parentProp) {
                for (const key in error.constraints) {
                    formatedErrors.push(`${parentProp}.${error.constraints[key]}`)
                }
            } else {
                formatedErrors.push(...Object.values(error.constraints))
            }
            
        } else {
            return formatClassValidatorErrors(error.children, error.property, formatedErrors)
        }
    }
    return formatedErrors;
}