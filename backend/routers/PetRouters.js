const router = require('express').Router();
const PetController = require('../controllers/PetController');
const verifyToken = require('../helpers/check-token');
const { imageUpload } = require('../helpers/image-upload');
const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Muitas requisições, tente novamente em alguns minutos.' },
});

const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Muitas buscas, aguarde um momento.' },
});

router.post(
  '/create',
  generalLimiter,
  verifyToken,
  imageUpload.array('images'),
  PetController.create
);

router.get(
  '/',
  generalLimiter,
  PetController.getAll
);

router.get(
  '/mypets',
  generalLimiter,
  PetController.getAllUserPets
);

router.get(
  '/myadoptions',
  generalLimiter,
  verifyToken,
  PetController.getAllUserAdoptions
);

router.get(
  '/search',
  searchLimiter,
  PetController.search
);

router.get(
  '/:id',
  generalLimiter,
  PetController.getPetById
);

router.delete(
  '/:id',
  generalLimiter,
  verifyToken,
  PetController.removePetById
);

router.patch(
  '/:id',
  generalLimiter,
  verifyToken,
  imageUpload.array('images'),
  PetController.updatePet
);

router.patch(
  '/schedule/:id',
  generalLimiter,
  verifyToken,
  PetController.schedule
);

router.patch(
  '/conclude/:id',
  generalLimiter,
  verifyToken,
  PetController.concludeAdoption
);

module.exports = router;