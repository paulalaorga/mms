// services/paycomet-service.ts

import axios, { AxiosResponse } from "axios";

// Define las respuestas de Paycomet
interface PaycometFormResponse {
  errorCode: number;
  challengeUrl?: string;
}

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

// Payload para FORM/Initialize
interface PaycometFormPayload {
  operationType: number;
  language: string;
  terminal: number;
  payment: {
    terminal: number;
    methods: any[];
    excludedMethods: any[];
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
    merchantData: Record<string, any>;
  };
}

// Payload para Info/Operation
interface PaycometInfoPayload {
  payment: {
    terminal: number;
  };
}

// Opciones de inicialización de pago
interface InitializePaymentOptions {
  amount: number;
  orderId: string;
  userEmail?: string;
  description?: string;
  subscriptionDetails?: {
    periodicity: string;
    duration: number;
  };
}

class PaycometService {
  private apiUrl: string;
  private apiToken: string;
  private terminal: string;
  private urlOk: string;
  private urlKo: string;

  constructor() {
    this.apiUrl = process.env.PAYCOMET_BASE_URL || "https://rest.paycomet.com";
    this.apiToken = process.env.PAYCOMET_API_KEY || "";
    this.terminal = process.env.PAYCOMET_TERMINAL || "";
    this.urlOk = process.env.PAYCOMET_URL_OK || "";
    this.urlKo = process.env.PAYCOMET_URL_KO || "";

    if (!this.apiToken || !this.terminal) {
      console.error("❌ Configuración de PAYCOMET incompleta en variables de entorno");
    }
  }

  /**
   * Inicializa un pago y devuelve la URL para el formulario de pago
   */
  async initializePayment(options: InitializePaymentOptions): Promise<string> {
    const { amount, orderId, userEmail, description, subscriptionDetails } = options;

    // Validación de entrada
    if (!amount || !orderId) {
      throw new Error("El monto y el ID de orden son obligatorios.");
    }

    // Preparar payload según especificación de Paycomet
    const payload: PaycometFormPayload = {
      operationType: 1, // Autorización
      language: "es",
      terminal: Number(this.terminal),
      payment: {
        terminal: Number(this.terminal),
        methods: [], // Array vacío según la documentación
        excludedMethods: [],
        order: orderId,
        amount: Math.round(amount * 100).toString(), // Convertir a céntimos
        currency: "EUR",
        secure: 1, // Forzar 3DS
        scoring: "0",
        productDescription: description || `Pago de ${amount}€ para la orden ${orderId}${userEmail ? ` de ${userEmail}` : ""}`,
        merchantDescriptor: "",
        userInteraction: 1,
        trxType: "",
        scaException: "",
        urlOk: this.urlOk,
        urlKo: this.urlKo,
        tokenize: 0,
        merchantData: {},
      },
    };

    // Si es una suscripción y tenemos detalles, agregar información de suscripción
    if (subscriptionDetails) {
      payload.payment['subscription'] = {
        periodicity: subscriptionDetails.periodicity,
        cycles: subscriptionDetails.duration.toString()
      };
    }

    try {
      console.log("🔹 Enviando solicitud de inicialización a Paycomet:", JSON.stringify(payload, null, 2));

      // Llamar a la API de Paycomet
      const response = await axios.post<PaycometFormResponse>(
        `${this.apiUrl}/v1/form`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "PAYCOMET-API-TOKEN": this.apiToken,
          },
        }
      );

      const { errorCode, challengeUrl } = response.data;

      if (errorCode !== 0) {
        throw new Error(`Error Paycomet (${errorCode}): Fallo en la inicialización del pago`);
      }

      if (!challengeUrl) {
        throw new Error("No se recibió URL de pago desde Paycomet");
      }

      console.log("✅ Pago inicializado correctamente, URL:", challengeUrl);
      return challengeUrl;
    } catch (error) {
      console.error("❌ Error al inicializar pago en Paycomet:", error);
      
      if (axios.isAxiosError(error) && error.response) {
        console.error("Respuesta de error Paycomet:", error.response.data);
        throw new Error(`Error de Paycomet: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      }
      
      throw error; // Re-lanzar para manejo en el controlador
    }
  }

  /**
   * Obtener información de un pago específico por número de orden
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
      
      if (axios.isAxiosError(error) && error.response) {
        console.error("Respuesta de error Paycomet:", error.response.data);
        throw new Error(`Error de Paycomet: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      }
      
      throw error;
    }
  }

  /**
   * Obtiene el listado de operaciones/pagos realizados
   */
  async getPaymentList(fromDate?: Date, toDate?: Date, limit = 100): Promise<any> {
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
    };

    try {
      console.log("📢 Consultando listado de pagos en Paycomet:", payload);

      const response = await axios.post(
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
      
      if (axios.isAxiosError(error) && error.response) {
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
}

// Exportamos una instancia única del servicio
export const paycometService = new PaycometService();