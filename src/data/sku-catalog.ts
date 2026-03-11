import type { BarcodeType } from "expo-camera";

import type { Product } from "../types/payment";

export type SkuCatalogItem = Product & {
  code: string;
  symbology: BarcodeType;
  description: string;
};

export const SKU_CATALOG: SkuCatalogItem[] = [
  {
    id: "SKU-9920",
    code: "SKU-9920",
    name: "Cafe en grano 500g",
    price: 1290,
    currency: "usd",
    symbology: "qr",
    description: "Tueste medio con notas de cacao.",
  },
  {
    id: "SKU-1101",
    code: "SKU-1101",
    name: "Leche deslactosada 1L",
    price: 165,
    currency: "usd",
    symbology: "ean13",
    description: "Lacteo para consumo diario.",
  },
  {
    id: "SKU-2007",
    code: "SKU-2007",
    name: "Galletas integrales",
    price: 240,
    currency: "usd",
    symbology: "code128",
    description: "Snack ligero de avena.",
  },
];

export const SKU_CATALOG_MAP: Record<string, SkuCatalogItem> =
  Object.fromEntries(SKU_CATALOG.map((item) => [item.code, item]));

export const READER_INFO = {
  supportedTypes: ["qr", "ean13", "code128"] as BarcodeType[],
  helperText: "Admite QR, EAN-13 y Code128. Escanea un SKU valido del catalogo.",
};
