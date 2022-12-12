import { ErrorObjectInterface } from '../types/error-object.interface';

export abstract class Checker<S, I, C> {
    protected readonly _sourceValue: S;
    protected readonly _inputValue: I;
    protected readonly _errorsList: Array<ErrorObjectInterface> = [];

    protected constructor(inputValue: I, sourceValue: S) {
        this._inputValue = inputValue;
        this._sourceValue = sourceValue;
    }

    abstract validate(): Promise<void>;

    get errorsList(): Array<ErrorObjectInterface> {
        return this._errorsList;
    }

    abstract get value(): C;
}