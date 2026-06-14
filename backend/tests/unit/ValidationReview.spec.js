const { validateReviewPayload } = require("../../helpers/validateReview");

describe("validateReviewPayload", () => {
  const validPayload = {
    userId: "507f1f77bcf86cd799439011",
    petId: "507f1f77bcf86cd799439012",
    rating: 4,
    comment: "Super legal",
    recommend: true,
  };

  it("deve retornar valido = true para payload valido", () => {
    const { valid, errors, data } = validateReviewPayload(validPayload);
    expect(valid).toBe(true);
    expect(errors).toHaveLength(0);
    expect(data.rating).toBe(4);
  });

  it("deve aceitar payload sem comment e sem recommend", () => {
    const { valid, data } = validateReviewPayload({
      userId: "507f1f77bcf86cd799439011",
      petId: "507f1f77bcf86cd799439012",
      rating: 5,
    });
    expect(valid).toBe(true);
    expect(data.recommend).toBe(true);
  });

  it("deve falhar se userId for invalido ou ausente", () => {
    const { valid, errors } = validateReviewPayload({
      ...validPayload,
      userId: "invalido",
    });
    expect(valid).toBe(false);
    expect(errors).toContain("userId invalido");
  });

  it("deve falhar se rating for fora do range", () => {
    const { valid, errors } = validateReviewPayload({
      ...validPayload,
      rating: 6,
    });
    expect(valid).toBe(false);
    expect(errors).toContain("rating deve ser entre 1 e 5");
  });

  it("deve falhar se recommend nao for booleano", () => {
    const { valid, errors } = validateReviewPayload({
      ...validPayload,
      recommend: "sim",
    });
    expect(valid).toBe(false);
    expect(errors).toContain("recommend deve ser um booleano");
  });
});
