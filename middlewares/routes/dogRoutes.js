import express from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { apiLimiter } from '../middlewares/rateLimit.js';
import { registerDog, adoptDog, removeDog, listRegisteredDogs, listAdoptedDogs, validateRegisterDog, validateAdoptDog, validateDogIdParam, listAvailableDogs, getDogById } from '../controllers/dogController.js';

const router = express.Router();

/**
 * @openapi
 * /api/dogs:
 *   get:
 *     summary: List available dogs
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', apiLimiter, listAvailableDogs);

/**
 * @openapi
 * /api/dogs/{id}:
 *   get:
 *     summary: Get dog by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/:id', apiLimiter, validateDogIdParam, getDogById);

/**
 * @openapi
 * /api/dogs:
 *   post:
 *     summary: Register a new dog (authenticated)
 */
router.post('/', apiLimiter, authMiddleware, validateRegisterDog, registerDog);
router.post('/:id/adopt', apiLimiter, authMiddleware, validateAdoptDog, validateDogIdParam, adoptDog);
router.delete('/:id', apiLimiter, authMiddleware, validateDogIdParam, removeDog);
router.get('/registered', apiLimiter, authMiddleware, listRegisteredDogs);
router.get('/adopted', apiLimiter, authMiddleware, listAdoptedDogs);

export default router;
