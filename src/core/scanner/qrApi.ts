const QR_API_BASE = 'https://api.qrserver.com/v1/read-qr-code/';

type QrApiSymbol = {
  data?: string | null;
  error?: string | null;
};

type QrApiPayload = Array<{
  type?: string;
  symbol?: QrApiSymbol[];
}>;

export type QrDecodeResult = {
  content: string | null;
  error: string | null;
  raw: QrApiPayload;
};

const normalizeResponse = (payload: QrApiPayload): QrDecodeResult => {
  const firstSymbol = payload?.[0]?.symbol?.[0];
  return {
    content: firstSymbol?.data ?? null,
    error: firstSymbol?.error ?? null,
    raw: payload,
  };
};

export const decodeQrFromUrl = async (
  fileUrl: string,
  outputFormat: 'json' | 'xml' = 'json'
): Promise<QrDecodeResult> => {
  const url = `${QR_API_BASE}?fileurl=${encodeURIComponent(fileUrl)}&outputformat=${outputFormat}`;
  const response = await fetch(url, { method: 'GET' });

  if (!response.ok) {
    throw new Error(`QR API request failed with status ${response.status}`);
  }

  const payload: QrApiPayload = await response.json();
  return normalizeResponse(payload);
};

export type QrFileInput =
  | File
  | Blob
  | {
      uri: string;
      name?: string;
      type?: string;
    };

export const decodeQrFromFile = async (
  file: QrFileInput,
  outputFormat: 'json' | 'xml' = 'json'
): Promise<QrDecodeResult> => {
  const formData = new FormData();

  if ('uri' in file) {
    formData.append('file', {
      uri: file.uri,
      name: file.name ?? 'qr-image.jpg',
      type: file.type ?? 'image/jpeg',
    } as any);
  } else {
    formData.append('file', file as any);
  }

  const url = `${QR_API_BASE}?outputformat=${outputFormat}`;
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`QR API upload failed with status ${response.status}`);
  }

  const payload: QrApiPayload = await response.json();
  return normalizeResponse(payload);
};
