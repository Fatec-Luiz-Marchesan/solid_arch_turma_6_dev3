function validateBreedPayload(payload = {}) {
const errors = [];
const data = {};

if (!payload.name || typeof payload.name !== 'string') {
errors.push('name e obrigatorio');
} else {
const name = payload.name.trim();
if (name.length < 2) errors.push('name deve ter no minimo 2 caracteres');
if (name.length > 50) errors.push('name nao pode passar de 50 caracteres');
data.name = name;
}

if (!payload.species) {
errors.push('species e obrigatorio');
} else if (!['dog', 'cat', 'rabbit', 'bird', 'other'].includes(payload.species)) {
errors.push('species invalido');
} else {
data.species = payload.species;
}

if (payload.origin !== undefined) {
if (typeof payload.origin !== 'string' || payload.origin.trim().length === 0) {
errors.push('origin deve ser uma string nao vazia');
} else {
data.origin = payload.origin.trim();
}
}

if (payload.lifeExpectancy !== undefined) {
const le = Number(payload.lifeExpectancy);
if (Number.isNaN(le) || le < 1 || le > 30) {
errors.push('lifeExpectancy deve ser um numero entre 1 e 30');
} else {
data.lifeExpectancy = le;
}
}
return { valid: errors.length === 0, errors, data };
}
module.exports = { validateBreedPayload };