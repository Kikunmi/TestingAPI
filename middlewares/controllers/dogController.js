import Dog from '../models/Dog.js';
import { celebrate, Joi, Segments } from 'celebrate';

export const validateRegisterDog = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(1).max(100).required(),
    description: Joi.string().min(1).max(1000).required(),
  })
});

export const validateAdoptDog = celebrate({
  [Segments.BODY]: Joi.object().keys({
    message: Joi.string().allow('', null).max(500)
  })
});

export const validateDogIdParam = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().hex().length(24).required()
  })
});

export const registerDog = async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) return res.status(400).json({ error: 'Name and description are required' });

  const dog = new Dog({ name, description, owner: req.user.id });
  await dog.save();
  res.status(201).json({ message: 'Dog registered', dog });
};

export const adoptDog = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  const dog = await Dog.findById(id);
  if (!dog) return res.status(404).json({ error: 'Dog not found' });
  if (dog.adoptedBy) return res.status(409).json({ error: 'Dog already adopted' });
  if (dog.owner.toString() === req.user.id) return res.status(403).json({ error: 'Cannot adopt your own dog' });

  dog.adoptedBy = req.user.id;
  dog.adoptedMessage = message || null;
  await dog.save();

  res.json({ message: 'Dog adopted', dog });
};

export const removeDog = async (req, res) => {
  const { id } = req.params;
  const dog = await Dog.findById(id);
  if (!dog) return res.status(404).json({ error: 'Dog not found' });
  if (dog.owner.toString() !== req.user.id) return res.status(403).json({ error: 'Not the owner' });
  if (dog.adoptedBy) return res.status(409).json({ error: 'Cannot remove adopted dog' });

  await dog.deleteOne();
  res.json({ message: 'Dog removed' });
};

export const listRegisteredDogs = async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const query = { owner: req.user.id };
  if (status === 'adopted') query.adoptedBy = { $ne: null };
  if (status === 'available') query.adoptedBy = null;

  const dogs = await Dog.find(query)
    .skip((page - 1) * limit)
    .limit(parseInt(limit, 10))
    .sort({ createdAt: -1 });

  const total = await Dog.countDocuments(query);
  res.json({ page: parseInt(page, 10), limit: parseInt(limit, 10), total, dogs });
};

export const listAdoptedDogs = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const query = { adoptedBy: req.user.id };

  const dogs = await Dog.find(query)
    .skip((page - 1) * limit)
    .limit(parseInt(limit, 10))
    .sort({ createdAt: -1 });

  const total = await Dog.countDocuments(query);
  res.json({ page: parseInt(page, 10), limit: parseInt(limit, 10), total, dogs });
};

// New: list all available dogs (not adopted) with pagination and optional name filter
export const listAvailableDogs = async (req, res) => {
  const { page = 1, limit = 10, name } = req.query;
  const query = { adoptedBy: null };
  if (name) {
    // case-insensitive substring match
    query.name = { $regex: name, $options: 'i' };
  }

  const dogs = await Dog.find(query)
    .skip((page - 1) * limit)
    .limit(parseInt(limit, 10))
    .sort({ createdAt: -1 });

  const total = await Dog.countDocuments(query);
  res.json({ page: parseInt(page, 10), limit: parseInt(limit, 10), total, dogs });
};

export const getDogById = async (req, res) => {
  const { id } = req.params;
  const dog = await Dog.findById(id).populate('owner', 'username').populate('adoptedBy', 'username');
  if (!dog) return res.status(404).json({ error: 'Dog not found' });
  res.json(dog);
};
