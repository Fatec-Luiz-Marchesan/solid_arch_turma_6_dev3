const express = require('express');
const mongoose = require('mongoose');
const LocalStorageAdapter = require('./infrastructure/adapters/storage/LocalStorageAdapter');
const UploadMongoRepository = require('./infrastructure/repositories/UploadMongoRepository');
const UploadFileUseCase = require('./domain/usecases/UploadFileUseCase');
const UploadController = require('./interface/controllers/UploadController');
const makeUploadRouter = require('./interface/routes/uploadRoutes');
const LocationMongoRepository = require('./infrastructure/repositories/LocationMongoRepository');
const CreateLocationUseCase = require('./domain/usecases/CreateLocationUseCase');
const FindNearbyLocationsUseCase = require('./domain/usecases/FindNearbyLocationsUseCase');
const LocationController = require('./interface/controllers/LocationController');
const makeLocationRouter = require('./interface/routes/locationRoutes');

const app = express();

mongoose.connect('mongodb://localhost:27017/seu_db');

const storageGateway = new LocalStorageAdapter({ uploadDir: './uploads' });
const uploadRepository = new UploadMongoRepository();
const uploadFileUseCase = new UploadFileUseCase({ storageGateway, uploadRepository });
const uploadController = new UploadController({ uploadFileUseCase });
const locationRepository = new LocationMongoRepository();
const createLocationUseCase = new CreateLocationUseCase({ locationRepository });
const findNearbyLocationsUseCase = new FindNearbyLocationsUseCase({ locationRepository });
const locationController = new LocationController({
createLocationUseCase, findNearbyLocationsUseCase,});

app.use('/api/locations', makeLocationRouter(locationController));

app.use('/uploads', express.static('uploads'));

app.use('/api/uploads', makeUploadRouter(uploadController));

app.use(express.json());

module.exports = app;