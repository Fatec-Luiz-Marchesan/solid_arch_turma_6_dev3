const {
  validateProfilePayload,
  isValidUrl,
  isValidBRPhone,
} = require("../../src/interface/helpers/validateProfile");

describe("isValidUrl", () => {
  it("aceita URL HTTPS", () => {
    expect(isValidUrl("https://instagram.com/usuario")).toBe(true);
  });
  it("aceita URL HTTP", () => {
    expect(isValidUrl("http://exemplo.com")).toBe(true);
  });
  it("rejeita URL sem protocolo", () => {
    expect(isValidUrl("instagram.com/usuario")).toBe(false);
  });
  it("rejeita string que nao e URL", () => {
    expect(isValidUrl("nao-e-url")).toBe(false);
  });
});

describe("validateProfilePayload — Task 77", () => {
  const validBase = {
    userId: "user-1",
    bio: "Bio valida",
    phone: "(11) 99999-1234",
  };

  describe("bio com limite de 500 chars", () => {
    it("aceita bio com 500 caracteres exatos", () => {
      const { valid } = validateProfilePayload({
        ...validBase,
        bio: "x".repeat(500),
      });
      expect(valid).toBe(true);
    });
    it("rejeita bio com 501 caracteres", () => {
      const { valid, errors } = validateProfilePayload({
        ...validBase,
        bio: "x".repeat(501),
      });
      expect(valid).toBe(false);
      expect(errors.some((e) => e.includes("500 caracteres"))).toBe(true);
    });
  });

  describe("socialLinks", () => {
    it("aceita socialLinks valido", () => {
      const { valid, data } = validateProfilePayload({
        ...validBase,
        socialLinks: { instagram: "https://instagram.com/user" },
      });
      expect(valid).toBe(true);
      expect(data.socialLinks.instagram).toBe("https://instagram.com/user");
    });
    it("rejeita socialLinks com chave nao permitida", () => {
      const { valid, errors } = validateProfilePayload({
        ...validBase,
        socialLinks: { twitter: "https://twitter.com/user" },
      });
      expect(valid).toBe(false);
      expect(errors.some((e) => e.includes("twitter"))).toBe(true);
    });
    it("rejeita socialLinks com URL invalida", () => {
      const { valid, errors } = validateProfilePayload({
        ...validBase,
        socialLinks: { instagram: "nao-e-url" },
      });
      expect(valid).toBe(false);
      expect(errors.some((e) => e.includes("URL valida"))).toBe(true);
    });
    it("aceita varias redes sociais", () => {
      const { valid, data } = validateProfilePayload({
        ...validBase,
        socialLinks: {
          instagram: "https://instagram.com/u",
          facebook: "https://fb.com/u",
          linkedin: "https://linkedin.com/in/u",
        },
      });
      expect(valid).toBe(true);
      expect(Object.keys(data.socialLinks)).toHaveLength(3);
    });
  });

  describe("preferredContactMethod", () => {
    it("aceita email sem exigir phone", () => {
      const { valid } = validateProfilePayload({
        userId: "u1",
        bio: "Bio",
        preferredContactMethod: "email",
      });
      expect(valid).toBe(true);
    });
    it("rejeita method invalido", () => {
      const { valid } = validateProfilePayload({
        ...validBase,
        preferredContactMethod: "pombo-correio",
      });
      expect(valid).toBe(false);
    });
    it("rejeita phone como method sem phone informado", () => {
      const { valid, errors } = validateProfilePayload({
        userId: "u1",
        preferredContactMethod: "phone",
      });
      expect(valid).toBe(false);
      expect(errors.some((e) => e.includes("phone e obrigatorio"))).toBe(true);
    });
    it("aceita whatsapp se phone foi informado", () => {
      const { valid } = validateProfilePayload({
        userId: "u1",
        phone: "(11) 99999-9999",
        preferredContactMethod: "whatsapp",
      });
      expect(valid).toBe(true);
    });
  });
});
