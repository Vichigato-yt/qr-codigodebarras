type MockPaymentResult = {
  success: true;
  transactionId: string;
  amount: number;
  createdAt: string;
};

type PaymentRequest = {
  amount: number;
  idempotencyKey: string;
};

const completedPayments = new Map<string, MockPaymentResult>();
const pendingPayments = new Map<string, Promise<MockPaymentResult>>();

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const validateRequest = ({ amount, idempotencyKey }: PaymentRequest) => {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Monto inválido para procesar el pago");
  }

  if (!idempotencyKey.trim()) {
    throw new Error("Falta la clave de idempotencia");
  }
};

export const tokenizeMockCard = async () => {
  await wait(500);
  return `pm_mock_${Date.now()}`;
};

export const createMockPaymentIntent = async (_paymentMethodId: string, amount: number) => {
  await wait(700);
  return {
    clientSecret: `pi_mock_secret_${Date.now()}`,
    amount,
  };
};

export const confirmMockPayment = async (_clientSecret: string) => {
  await wait(900);

  const passed3DSecure = Math.random() > 0.08;

  if (!passed3DSecure) {
    throw new Error("Autenticación 3D Secure rechazada por el banco");
  }

  return { confirmed: true };
};

export const processMockPayment = async ({ amount, idempotencyKey }: PaymentRequest) => {
  validateRequest({ amount, idempotencyKey });

  const cachedPayment = completedPayments.get(idempotencyKey);
  if (cachedPayment) {
    return cachedPayment;
  }

  const pendingPayment = pendingPayments.get(idempotencyKey);
  if (pendingPayment) {
    return pendingPayment;
  }

  const operation = (async () => {
    await wait(2000);

    const isSuccess = Math.random() > 0.1;

    if (!isSuccess) {
      throw new Error("Fondos insuficientes o error de conexión");
    }

    const result: MockPaymentResult = {
      success: true,
      transactionId: `TX-${Date.now()}`,
      amount,
      createdAt: new Date().toISOString(),
    };

    completedPayments.set(idempotencyKey, result);
    return result;
  })();

  pendingPayments.set(idempotencyKey, operation);

  try {
    return await operation;
  } finally {
    pendingPayments.delete(idempotencyKey);
  }
};

export const notifyMockWebhook = async (transactionId: string) => {
  await wait(600);
  return {
    delivered: true,
    transactionId,
    status: "captured" as const,
  };
};
