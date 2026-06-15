const express = require('express');
const mongoose = require('mongoose');
const LocalStorageAdapter = require('./infrastructure/adapters/storage/LocalStorageAdapter');
const UploadMongoRepository = require('./infrastructure/repositories/UploadMongoRepository');
const UploadFileUseCase = require('./domain/usecases/UploadFileUseCase');
const UploadController = require('./interface/controllers/UploadController');
const makeUploadRouter = require('./interface/routes/uploadRoutes');

const app = express();

mongoose.connect('mongodb://localhost:27017/seu_db');

const storageGateway = new LocalStorageAdapter({ uploadDir: './uploads' });
const uploadRepository = new UploadMongoRepository();
const uploadFileUseCase = new UploadFileUseCase({ storageGateway, uploadRepository });
const uploadController = new UploadController({ uploadFileUseCase });

app.use('/uploads', express.static('uploads'));

app.use('/api/uploads', makeUploadRouter(uploadController));

app.use(express.json());

module.exports = app;