import { Router } from 'express';
import { asyncHandler } from '../../shared/middlewares/errors.js';
import { RoomController } from '../controllers/RoomController.js';
import { BuildingController } from '../controllers/BuildingController.js';
import { BookingController } from '../controllers/BookingController.js';

export const routes = Router();
const list = new RoomController();
const summary = new BuildingController();
const operations = new BookingController();

routes.get('/rooms', asyncHandler(list.list));
routes.get('/buildings/:buildingId/usage', asyncHandler(summary.usage));
routes.post('/bookings', asyncHandler(operations.create));
routes.patch('/bookings/:id', asyncHandler(operations.update));
routes.delete('/bookings/:id', asyncHandler(operations.delete));
