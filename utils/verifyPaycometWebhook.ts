// Función de ayuda para verificar webhooks de Paycomet
// utils/verifyPaycometWebhook.ts
import crypto from 'crypto';

interface PaycometWebhookPayload {
  order: string;
  amount: number;
  currency: string;
  [key: string]: unknown;
}

export function verifyPaycometWebhook(payload: PaycometWebhookPayload, signature: string, secretKey: string): boolean {
  // La implementación exacta dependerá de la documentación de Paycomet
  // Este es un ejemplo genérico de verificación HMAC-SHA256
  const calculatedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(calculatedSignature),
    Buffer.from(signature)
  );
}