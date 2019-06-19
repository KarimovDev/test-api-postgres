import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateObject implements PipeTransform<string> {
    async transform(value: string) {
        const id = Number(value);
        const isValid = id.toString().length === 7;
        if (!isValid) {
            throw new BadRequestException('Invalid ID!');
        }
        return value;
    }
}
