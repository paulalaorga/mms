import axios from "axios";

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
  terminal: number;
  order: string;
  amount: number;
  currency: string;
  userInteraction: number;
  secure: number;
  productDescription: string;
  urlOk: string;
  urlKo: string;
  methods: string[];
  merchantData: { email?: string };
  subscription?: {
    periodicity?: string;
    cycles?: string;
  };
}

export class PaycometService {
  private apiUrl: string;
  private apiToken: string;
  private terminal: string;

  constructor() {
    this.apiUrl = process.env.PAYCOMET_BASE_URL || "https://rest.paycomet.com";
    this.apiToken = process.env.PAYCOMET_API_KEY || "";
    this.terminal = process.env.PAYCOMET_TERMINAL || "";
  }

  /**
   * Initialize a payment with Paycomet
   */
  async initializePayment(options: PaymentInitializationOptions) {
    try {
      const { amount, orderId, userEmail, description, subscriptionDetails } = options;

      if (!amount || !orderId) {
        throw new Error("Faltan parámetros obligatorios: amount y orderId");
      }

      // Prepare payload with correct structure
      const payload: PaycometPayload = {
        terminal: Number(this.terminal) || 77729,
        order: orderId,
        amount: amount * 100,
        currency: "EUR",
        userInteraction: 1,
        secure: 1,
        productDescription: description?.substring(0, 50) || "",
        urlOk: process.env.PAYCOMET_SUCCESS_URL || "https://tuservicio.com/payment-success",
        urlKo: process.env.PAYCOMET_ERROR_URL || "https://tuservicio.com/payment-failed",
        methods: ["card"],
        merchantData: { email: userEmail }
      };

      if (subscriptionDetails) {
        payload.subscription = {
          periodicity: subscriptionDetails.periodicity,
          cycles: subscriptionDetails.duration?.toString()
        };
      }

      console.log("🔹 Enviando solicitud a Paycomet:", payload);

      const response = await axios.post<PaycometResponse>(
        `${this.apiUrl}/v1/form`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "PAYCOMET-API-TOKEN": this.apiToken
          }
        }
      );

      const responseData = response.data;

      if (responseData?.errorCode === 0 && responseData?.challengeUrl) {
        return {
          status: "success",
          paymentUrl: responseData.challengeUrl,
          orderId
        };
      }

      throw new Error(`Paycomet Error: ${responseData?.errorCode || "Unknown error"}`);

    } catch (error) {
      console.error("❌ Error al inicializar pago en Paycomet:", error);

      if (error instanceof error) {
        console.error("Detalles del error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });

        throw new Error(
          `Error de Paycomet: ${error.response?.status || "Unknown"} - ${JSON.stringify(error.response?.data)}`
        );
      }

      throw error;
    }
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(orderId: string): Promise<PaycometResponse> {
    try {
      if (!orderId) {
        throw new Error("El ID de la orden es obligatorio para verificar el estado del pago.");
      }

      const response = await axios.post<PaycometResponse>(
        `${this.apiUrl}/v1/payments/${orderId}/info`,
        {
          payment: {
            terminal: Number(this.terminal)
          }
        },
        {
          headers: {
            "Content-Type": "application/json",
            "PAYCOMET-API-TOKEN": this.apiToken
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Error al verificar estado del pago:", error);
      throw error;
    }
  }
}

export const paycometService = new PaycometService();
