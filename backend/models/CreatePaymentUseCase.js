import { CreatePaymentUseCase } from "./CreatePaymentUseCase";
import { Payment } from "../../../entities/Payment";
import { Order } from "../../../entities/Order";

describe("CreatePaymentUseCase (Unit Tests - JS)", () => {
  let sut;
  let mockPaymentRepository;
  let mockOrderRepository;

  beforeEach(() => {
    mockPaymentRepository = {
      save: jest.fn(),
      findById: jest.fn(),
    };

    mockOrderRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    };

    sut = new CreatePaymentUseCase(mockPaymentRepository, mockOrderRepository);
  });

  describe("Success Scenarios", () => {
    it("should successfully create a payment when the order exists and is valid", async () => {
      const mockOrder = new Order({
        id: "order-id-123",
        userId: "user-123",
        totalValue: 150.0,
        status: "PENDING",
        items: [],
      });
      mockOrderRepository.findById.mockResolvedValue(mockOrder);

      const requestData = {
        orderId: "order-id-123",
        paymentMethod: "PIX",
        amount: 150.0,
      };

      await sut.execute(requestData);

      expect(mockOrderRepository.findById).toHaveBeenCalledWith("order-id-123");
      expect(mockPaymentRepository.save).toHaveBeenCalled();
    });
  });

  describe("Failure Scenarios", () => {
    it("should throw an error if the order does not exist", async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      const requestData = {
        orderId: "invalid-order-id",
        paymentMethod: "CREDIT_CARD",
        amount: 50.0,
      };

      await expect(sut.execute(requestData)).rejects.toThrow("Order not found");
      expect(mockPaymentRepository.save).not.toHaveBeenCalled();
    });

    it("should throw an error if the payment amount does not match the order total", async () => {
      const mockOrder = new Order({
        id: "order-id-123",
        userId: "user-123",
        totalValue: 150.0,
        status: "PENDING",
        items: [],
      });
      mockOrderRepository.findById.mockResolvedValue(mockOrder);

      const requestData = {
        orderId: "order-id-123",
        paymentMethod: "PIX",
        amount: 100.0,
      };

      await expect(sut.execute(requestData)).rejects.toThrow();
      expect(mockPaymentRepository.save).not.toHaveBeenCalled();
    });
  });
});
