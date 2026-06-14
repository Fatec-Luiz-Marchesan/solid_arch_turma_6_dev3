const { validateBreedPayload } = require('../helpers/validateBreed');
class BreedController {
constructor({ createBreedUseCase, updateBreedUseCase, getBreedUseCase, listBreedsUseCase }) {
this.createBreedUseCase = createBreedUseCase;
this.updateBreedUseCase = updateBreedUseCase;
this.getBreedUseCase = getBreedUseCase;
this.listBreedsUseCase = listBreedsUseCase;
}
async create(req, res) {
const { valid, errors, data } = validateBreedPayload(req.body);
if (!valid) {
return res.status(400).json({ errors });
}
try {
const breed = await this.createBreedUseCase.execute(data);
return res.status(201).json(breed);
} catch (err) {
return res.status(400).json({ error: err.message });
}
}
async update(req, res) {
const { valid, errors, data } = validateBreedPayload(req.body);
if (!valid) {
return res.status(400).json({ errors });
}
try {
const updated = await this.updateBreedUseCase.execute({
id: req.params.id, ...data,
});
if (!updated) return res.status(404).json({ error: 'Breed nao encontrada' });
return res.json(updated);
} catch (err) {
return res.status(400).json({ error: err.message });
}
}
async getById(req, res) {
const breed = await this.getBreedUseCase.execute(req.params.id);
if (!breed) return res.status(404).json({ error: 'Breed nao encontrada' });
return res.json(breed);
}
async list(req, res) {
const breeds = await this.listBreedsUseCase.execute(req.query);
return res.json(breeds);
}
}
module.exports = BreedController;