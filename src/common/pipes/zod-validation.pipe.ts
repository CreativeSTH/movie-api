import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const formatted = result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join('; ');
      throw new BadRequestException(`Validación fallida: ${formatted}`);
    }

    return result.data; // Devuelve el objeto validado y tipado
  }
}