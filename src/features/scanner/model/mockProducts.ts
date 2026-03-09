import type { MockProduct } from "./types";

export const MOCK_PRODUCTS: Record<string, MockProduct> = {
  "SKU-9920": {
    code: "SKU-9920",
    name: "Municion energetica 500g",
    description: "Blend ficticio premium para operaciones intensas.",
    priceCents: 1290,
  },
  "SKU-1101": {
    code: "SKU-1101",
    name: "Racion tactica 1L",
    description: "Bebida lactea ficticia para recuperacion rapida.",
    priceCents: 165,
  },
  "SKU-2007": {
    code: "SKU-2007",
    name: "Kit crujiente integral",
    description: "Snack ficticio de mision con fibra y energia.",
    priceCents: 240,
  },
  "5901234123457": {
    code: "5901234123457",
    name: "Botiquin compacto",
    description: "Consumible ficticio escaneado por EAN-13.",
    priceCents: 799,
  },
};

export const FAST_SCAN_CODE = "TF2-CHECKOUT-FAST";
