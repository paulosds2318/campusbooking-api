
import type { Request, Response } from 'express';
import { z } from 'zod';
import { RoomService } from '../../infrastructure/services/room.service.js';

const positiveIntSchema = z
  .string()
  .regex(/^[1-9]\d*$/, 'Informe um número inteiro positivo.')
  .transform(Number)
  .pipe(z.number().int().max(2147483647));

const roomFiltersSchema = z.object({
  buildingId: positiveIntSchema.optional(),
  type: z.enum(['STUDY_ROOM', 'LAB', 'MEETING_ROOM']).optional(),
  minCapacity: positiveIntSchema.optional(),
  active: z.enum(['true', 'false']).transform(value => value === 'true').optional(),
  name: z.string().trim().min(1).optional()
}).strict();

export class RoomController {
  private service = new RoomService();

  list = async (req: Request, res: Response): Promise<void> => {
    const filters = roomFiltersSchema.parse(req.query);
    const rooms = await this.service.list(filters);

    res.status(200).json(rooms);
  };
}

