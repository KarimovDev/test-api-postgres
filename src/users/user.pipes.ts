import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateOrderDirection implements PipeTransform<string> {
    async transform(value: string) {
        const isValid = value === 'ASC' || value === 'DESC';
        if (!isValid) {
            throw new BadRequestException(
                'Invalid order direction! Must be ASC or DESC',
            );
        }
        return value;
    }
}
