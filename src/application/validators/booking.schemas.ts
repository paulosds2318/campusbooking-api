
import { z } from 'zod';

const idSchema = z
  .number()
  .int('Deve ser um número inteiro.')
  .positive('Deve ser um número positivo.')
  .max(2147483647, 'Valor máximo permitido: 2147483647.');

const dateSchema = z
  .string()
  .regex(
    /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):[0-5]\d(?::00(?:\.000)?)?(?:Z|[+-](?:(?:0\d|1[0-3]):[0-5]\d|14:00))$/,
    'Informe uma data ISO válida, com offset explícito e precisão de minutos.'
  )
  .refine((value) => {
    const [datePart] = value.split('T');
    const [year, month, day] = datePart.split('-').map(Number);

    const leapYear =
      year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

    const daysInMonth = [
      31,
      leapYear ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31
    ];

    return (
      day <= daysInMonth[month - 1] &&
      !Number.isNaN(Date.parse(value))
    );
  }, 'Data inválida.');

const purposeSchema = z
  .string()
  .trim()
  .min(1, 'A finalidade é obrigatória.')
  .max(200, 'A finalidade deve ter no máximo 200 caracteres.');

export const createBookingSchema = z.object({
  userId: idSchema,
  roomId: idSchema,
  startAt: dateSchema,
  endAt: dateSchema,
  purpose: purposeSchema
}).strict();

export const updateBookingSchema = z.object({
  roomId: idSchema.optional(),
  startAt: dateSchema.optional(),
  endAt: dateSchema.optional(),
  purpose: purposeSchema.optional()
}).strict().refine(
  (data) => Object.values(data).some((value) => value !== undefined),
  {
    message: 'Informe pelo menos um campo para atualizar.'
  }
);

export const bookingIdSchema = z
  .string()
  .regex(/^[1-9]\d*$/, 'Informe um ID inteiro positivo.')
  .transform(Number)
  .pipe(
    z.number().int().max(2147483647, 'ID acima do limite permitido.')
  );



