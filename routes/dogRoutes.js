import express from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { apiLimiter } from '../middlewares/rateLimit.js';
import { registerDog, adoptDog, removeDog, listRegisteredDogs, listAdoptedDogs, validateRegisterDog, validateAdoptDog, validateDogIdParam, listAvailableDogs, getDogById } from '../controllers/dogController.js';

const router = express.Router();

// Public
router.get('/', apiLimiter, listAvailableDogs);
router.get('/:id', apiLimiter, validateDogIdParam, getDogById);

// Authenticated
router.post('/', apiLimiter, authMiddleware, validateRegisterDog, registerDog);
router.post('/:id/adopt', apiLimiter, authMiddleware, validateAdoptDog, validateDogIdParam, adoptDog);
router.delete('/:id', apiLimiter, authMiddleware, validateDogIdParam, removeDog);
router.get('/registered', apiLimiter, authMiddleware, listRegisteredDogs);
router.get('/adopted', apiLimiter, authMiddleware, listAdoptedDogs);

export default router;
