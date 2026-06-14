const { validateBreedPayload } = require('../../src/interface/helpers/validateBreed');
describe('validateBreedPayload', () => {
it('aceita payload valido minimo', () => {
const { valid, errors, data } = validateBreedPayload({
name: 'Labrador', species: 'dog',
});
expect(valid).toBe(true);
expect(errors).toEqual([]);
expect(data).toEqual({ name: 'Labrador', species: 'dog' });
});
it('aceita payload com campos opcionais', () => {
const { valid, data } = validateBreedPayload({
name: 'Persa', species: 'cat',
origin: 'Persia', lifeExpectancy: 15,
});
expect(valid).toBe(true);
expect(data.origin).toBe('Persia');
expect(data.lifeExpectancy).toBe(15);
});
it('rejeita name muito curto', () => {
const { valid, errors } = validateBreedPayload({ name: 'A', species: 'dog' });
expect(valid).toBe(false);
expect(errors).toContain('name deve ter no minimo 2 caracteres');
});
it('rejeita species invalido', () => {
const { valid, errors } = validateBreedPayload({
name: 'Labrador', species: 'dinossauro',
});
expect(valid).toBe(false);
expect(errors).toContain('species invalido');
});
it('rejeita lifeExpectancy fora do range', () => {
const { valid, errors } = validateBreedPayload({
name: 'X', species: 'dog', lifeExpectancy: 100,
});
expect(valid).toBe(false);
expect(errors.some(e => e.includes('lifeExpectancy'))).toBe(true);
});
});