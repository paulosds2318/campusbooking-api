
import type { Request, Response } from 'express';
import { z } from 'zod';
import { BuildingService } from '../../infrastructure/services/building.service.js';

const buildingIdSchema = z
  .string()
  .regex(/^[1-9]\d*$/, 'Informe um ID inteiro positivo.')
  .transform(Number)
  .pipe(
    z.number().int().max(2147483647, 'ID acima do limite permitido.')
  );

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Informe a data no formato YYYY-MM-DD.')
  .refine((value) => {
    const [year, month, day] = value.split('-').map(Number);

    const date = new Date(`${value}T00:00:00-03:00`);

    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  }, 'Informe uma data válida.');

const usageQuerySchema = z.object({
  date: dateSchema
}).strict();

export class BuildingController {
  private service = new BuildingService();

  usage = async (req: Request, res: Response): Promise<void> => {
    const buildingId = buildingIdSchema.parse(req.params.buildingId);
    const { date } = usageQuerySchema.parse(req.query);

    const result = await this.service.usage(buildingId, date);

    res.status(200).json(result);
  };
}

