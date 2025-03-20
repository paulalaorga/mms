import axios from "axios";
import * as crypto from "crypto";

// Define type for subscription details
type SubscriptionDetails = {
  periodicity?: "monthly" | "yearly";
  duration?: number;
};

// Define an interface for the Paycomet API response
interface PaycometResponse {
  errorCode?: number;
  challengeUrl?: string;
  payment?: {
    errorCode?: number;
    stateName?: string;
    amountEur?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

// Define las respuestas de Paycomet
interface PaycometStatusResponse {
  payment: {
    amount: string;
    amountDisplay: string;
    amountEur: string;
    amountEurDisplay: string;
    authCode: string;
    bicCode: string;
    cardBrand: string;
    cardCategory: string;
    cardCountry: string;
    cardType: string;
    costumerCountry: string;
    currency: string;
    errorCode: number;
    errorDescription: string;
    issuerBank: string;
    methodId: string;
    operationId: number;
    operationName: string;
    operationType: number;
    order: string;
    originalIp: string;
    pan: string;
    paycometId: string;
    response: string;
    secure: number;
    settlementDate: string;
    state: number;
    stateName: string;
    terminal: number;
    terminalCurrency: string;
    terminalName: string;
    timestamp: string;
    user: string;
  }
}

// Payload for Info/Operation
interface PaycometInfoPayload {
  payment: {
    terminal: number;
  };
}

interface PaycometSearchResponse {
  errorCode: number;
  errorMessage: string;
  operations: Array<{
    order: string;
    paycometId: string;
    amountEur: string;
    state: number;
    stateName: string;
    timestamp: string;
    [key: string]: unknown; 
  }>;
}

// Type for payment initialization options
interface PaymentInitializationOptions {
  amount: number;
  orderId: string;
  userEmail?: string;
  description?: string;
  subscriptionDetails?: SubscriptionDetails;
}

// Type for Paycomet payload
interface PaycometPayload {
  operationType: number; // Autorización
  language: string;
  terminal: number;
  payment: {
    terminal: number;
    methods: [];
    excludedMethods: [];
    order: string;
    amount: string;
    currency: string;
    secure: number;
    scoring: string;
    productDescription: string;
    merchantDescriptor: string;
    userInteraction: number;
    trxType: string;
    scaException: string;
    urlOk: string;
    urlKo: string;
    tokenize: number;
    merchantData: { email: string };
  }
}

interface AxiosErrorResponse {
  response?: {
    status: number;
    data: PaycometResponse | PaycometStatusResponse | PaycometSearchResponse;
  };
}

// Type guard customized for Axios errors
function isAxiosError(error: unknown): error is AxiosErrorResponse {
  return typeof error === 'object' && 
         error !== null && 
         'response' in error;
}

export class PaycometService {
  private apiUrl: string;
  private apiToken: string;
  private terminal: string;
  private urlOk: string;
  private urlKo: string;
  private webhookSecretKey: string;

  constructor() {
    this.apiUrl = process.env.PAYCOMET_BASE_URL || "https://rest.paycomet.com";
    this.apiToken = process.env.PAYCOMET_API_KEY || "";
    this.terminal = process.env.PAYCOMET_TERMINAL || "";
    this.urlOk = process.env.PAYCOMET_URL_OK || "";
    this.urlKo = process.env.PAYCOMET_URL_KO || "";
    this.webhookSecretKey = process.env.PAYCOMET_WEBHOOK_SECRET || "";
  }

  /**
 * Obtiene información de un pago específico por número de orden
 */
async getPaymentInfo(orderId: string): Promise<PaycometStatusResponse> {
  if (!orderId) {
    throw new Error("El número de orden es obligatorio.");
  }

  const payload: PaycometInfoPayload = {
    payment: {
      terminal: Number(this.terminal),
    },
  };

  try {
    console.log(`📢 Consultando estado del pago para orden: ${orderId}`);

    const response = await axios.post<PaycometStatusResponse>(
      `${this.apiUrl}/v1/payments/${orderId}/info`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "PAYCOMET-API-TOKEN": this.apiToken,
        },
      }
    );

    console.log("✅ Información del pago recibida:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error(`❌ Error al consultar información del pago ${orderId}:`, error);
    
    if (isAxiosError(error) && error.response) {
      console.error("Respuesta de error Paycomet:", error.response.data);
      throw new Error(`Error de Paycomet: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    
    throw error;
  }
}

/**
 * Obtiene el listado de operaciones/pagos realizados
 */
async getPaymentList(fromDate?: Date, toDate?: Date, limit = 100): Promise<PaycometSearchResponse> {
  const now = new Date();
  const fiveMonthsAgo = new Date();
  fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);
  
  const formattedToDate = this.formatDateToPaycomet(toDate || now);
  const formattedFromDate = this.formatDateToPaycomet(fromDate || fiveMonthsAgo);
  
  const payload = {
    currency: "EUR",
    fromDate: formattedFromDate,
    toDate: formattedToDate,
    terminal: Number(this.terminal),
    operations: [1, 3, 9], // 1 = Authorization, 3 = Preauthorization, 9 = Subscription
    sortOrder: "DESC",
    sortType: 1, // Por fecha
    limit: limit,
    minAmount: 0,
    maxAmount: 1000000, // Un millón de euros debería ser suficiente como máximo
    state: 2, // Todos los estados
  };

  try {
    console.log("📢 Consultando listado de pagos en Paycomet:", payload);

    const response = await axios.post<PaycometSearchResponse>(
      `${this.apiUrl}/v1/payments/search`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "PAYCOMET-API-TOKEN": this.apiToken,
        },
      }
    );

    console.log(`✅ Lista de pagos recibida, total: ${response.data?.operations?.length || 0}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al consultar listado de pagos:", error);
    
    if (isAxiosError(error) && error.response) {
      console.error("Respuesta de error Paycomet:", error.response.data);
      throw new Error(`Error de Paycomet: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    
    throw error;
  }
}

/**
 * Formatea una fecha en el formato requerido por Paycomet: YYYYMMDDHHmmss
 */
private formatDateToPaycomet(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  
  const year = date.getFullYear().toString();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}


  /**
   * Initialize a payment with Paycomet
   */
  async initializePayment(options: PaymentInitializationOptions) {
    try {
      const { amount, orderId, userEmail, description } =
        options;

      if (!amount || !orderId) {
        throw new Error("Faltan parámetros obligatorios: amount y orderId");
      }

      // Prepare payload with correct structure
      const payload: PaycometPayload = {
        operationType: 1, // Autorización
        language: "es",
        terminal: Number(this.terminal),
        payment: {
          terminal: Number(this.terminal),
          methods: [], // Array vacío según la documentación
          excludedMethods: [],
          order: orderId,
          amount: Math.round(amount * 100).toString(), // Convertir a céntimos y asegurar que sea string
          currency: "EUR",
          secure: 1, // Forzar 3DS
          scoring: "0",
          productDescription:
            description || `Pago de ${amount}€ para la orden ${orderId}`,
          merchantDescriptor: "",
          userInteraction: 1,
          trxType: "",
          scaException: "",
          urlOk: this.urlOk,
          urlKo: this.urlKo,
          tokenize: 0,
          merchantData: { email: userEmail || "" },
        },
      };
      console.log("🔹 Enviando solicitud a Paycomet:", payload);

      const response = await axios.post<PaycometResponse>(
        `${this.apiUrl}/v1/form`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "PAYCOMET-API-TOKEN": this.apiToken,
          },
        }
      );

      const responseData = response.data;

      if (responseData?.errorCode === 0 && responseData?.challengeUrl) {
        return {
          status: "success",
          paymentUrl: responseData.challengeUrl,
          orderId,
        };
      }

      throw new Error(
        `Paycomet Error: ${responseData?.errorCode || "Unknown error"}`
      );
    } catch (error) {
      console.error("❌ Error al inicializar pago en Paycomet:", error);

      const axiosError = error;
      if (axiosError.response && axiosError.response.status) {
        console.error("Respuesta de error Paycomet:", {
          status: axiosError.response.status,
          data: axiosError.response.data,
        });

        throw new Error(
          `Error de Paycomet: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`
        );
      }

      throw error;
    }
  }

    /**
   * Verifica la firma de un webhook entrante de Paycomet
   * @param payload El cuerpo del webhook
   * @param signature La firma proporcionada en el encabezado X-Paycomet-Signature
   * @returns boolean Indica si la firma es válida
   */
    verifyWebhookSignature(payload, signature: string): boolean {
      try {
        // Si no hay una clave secreta configurada, no se puede verificar
        if (!this.webhookSecretKey) {
          console.warn("⚠️ No se ha configurado PAYCOMET_WEBHOOK_SECRET, se omite la verificación de firma");
          return true; // Podrías devolver false en producción
        }
  
        // Creamos un hash HMAC SHA256 del payload usando la clave secreta
        const calculatedSignature = crypto
          .createHmac('sha256', this.webhookSecretKey)
          .update(JSON.stringify(payload))
          .digest('hex');
        
        // Comparamos la firma calculada con la recibida
        // Usamos timingSafeEqual para evitar ataques de timing
        return crypto.timingSafeEqual(
          Buffer.from(calculatedSignature, 'hex'),
          Buffer.from(signature, 'hex')
        );
      } catch (error) {
        console.error("❌ Error al verificar la firma del webhook:", error);
        return false;
      }
    }
  

  /**
   * Check payment status
   */
  async checkPaymentStatus(orderId: string): Promise<PaycometResponse> {
    try {
      if (!orderId) {
        throw new Error(
          "El ID de la orden es obligatorio para verificar el estado del pago."
        );
      }

      const response = await axios.post<PaycometResponse>(
        `${this.apiUrl}/v1/payments/${orderId}/info`,
        {
          payment: {
            terminal: Number(this.terminal),
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "PAYCOMET-API-TOKEN": this.apiToken,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Error al verificar estado del pago:", error);
      throw error;
    }
  }

  /**
   * Search for payments by order ID
   */
  async getPayments(orderId: string): Promise<PaycometSearchResponse> {
    try {
      if (!orderId) {
        throw new Error(
          "El ID de la orden es obligatorio para buscar pagos."
        );
      }

      const response = await axios.get<PaycometSearchResponse>(
        `${this.apiUrl}/v1/payments/search/${orderId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "PAYCOMET-API-TOKEN": this.apiToken,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Error al buscar pagos:", error);
      throw error;
    }
  }
}

export const paycometService = new PaycometService();
