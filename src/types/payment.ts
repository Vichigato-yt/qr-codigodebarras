export type PaymentStatus = "idle" | "loading" | "success" | "error";

export type PaymentResult = {
  status: "success" | "error" | "canceled";
  paymentIntentId?: string;
  message?: string;
};

export type PaymentSheetParams = {
  paymentIntent: string;
  ephemeralKey: string;
  customer: string;
  publishableKey: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  currency: string;
  description?: string;
};
