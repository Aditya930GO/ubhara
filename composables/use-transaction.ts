import { ProductStockMin } from "~~/interfaces/product";
import {
  TransactionBase,
  InmateRequest,
  TransactionQuery,
  Transaction,
  TransactionDelivery,
  TransactionPayment,
  TransactionOverview,
} from "~~/interfaces/transaction";

export default () => {
  const { $fetch } = useNuxtApp();
  const config = useRuntimeConfig();

  const transactions = useState<TransactionBase[]>("transactions", () => null);
  const loading = useState<boolean>("transactions-loading", () => false);
  const query = useState<TransactionQuery>("transactions-query", () => {
    return {
      type: "all",
      status: "all",
      start_date: null,
      end_date: null,
      skip: 0,
      limit: 0,
    };
  });

  const addInmate = async (payload: InmateRequest): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/inmates`,
        "post",
        JSON.stringify({
          registration: payload.registration,
          name: payload.name,
          category: payload.category,
          NIK: payload.NIK,
          place_of_birth: payload.place_of_birth,
          date_of_birth: payload.date_of_birth,
          date: payload.date,
          address: payload.address,
          notes: payload.notes,
          city: payload.city,
          district: payload.district,
          sex: payload.sex,
        })
      );
      if (response.status !== 201) throw new Error("");
      const result: string = await response.text();
      console.log(result);
      if (result && payload.file.length) {
        const data: FormData = new FormData();
        for (let i: number = 0; i < payload.file.length; i++) {
          data.append("image", payload.file[i]);
        }
        await $fetch(
          `${config.public.apiBase}/products/image/${result}`,
          "put",
          data
        );
      }

      return result;
    } catch (e) {
      // console.log(e);
      return null;
    }
  };

  const addTransactionDelivery = async (
    id: string,
    payload: { _id: string; quantity: number }[]
  ): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/transactions/deliver/${id}`,
        "put",
        JSON.stringify({
          items: payload,
        })
      );
      if (response.status !== 200) throw new Error("");

      const result: string = await response.text();
      return result;
    } catch (e) {
      return null;
    }
  };

  const addTransactionAcceptance = async (
    id: string,
    payload: { _id: string; quantity: number }[]
  ): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/transactions/receive/${id}`,
        "put",
        JSON.stringify({
          items: payload,
        })
      );
      if (response.status !== 200) throw new Error("");

      const result: string = await response.text();
      return result;
    } catch (e) {
      return null;
    }
  };

  const addTransactionPayment = async (
    id: string,
    payload: {
      type: Transaction["type"];
      document_id: string;
      due_date?: number;
      acknowledge_date?: number;
      number: string;
      file?: File;
      invoice_number?: string;
      invoice_file?: File;
    }
  ): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/transactions/payment/create/${id}`,
        "put",
        JSON.stringify({
          document_id: payload.document_id,
          due_date: payload.due_date,
          acknowledge_date: payload.acknowledge_date,
          number: payload.type === "purchase" ? payload.invoice_number : null,
        })
      );
      if (response.status !== 200) throw new Error("");

      const result: string = await response.text();

      if (payload.file && payload.number) {
        const data: FormData = new FormData();
        if (payload.type === "purchase")
          data.append(
            "file",
            payload.invoice_file,
            `invoice.${payload.file.name.split(".").reverse()[0]}`
          );
        data.append(
          "file",
          payload.file,
          `tax_invoice.${payload.file.name.split(".").reverse()[0]}`
        );
        data.append("document_id", result);
        data.append("number", payload.number);
        await $fetch(
          `${config.public.apiBase}/transactions/file/${id}`,
          "put",
          data
        );
      }

      return result;
    } catch (e) {
      return null;
    }
  };

  const addTransactionPaymentFulfillment = async (
    id: string,
    payload: { amount: number; document_id: string; file?: File }
  ): Promise<string> => {
    try {
      const data: FormData = new FormData();
      data.append("amount", payload.amount.toString());
      data.append("document_id", payload.document_id);
      if (payload.file)
        data.append(
          "file",
          payload.file,
          `payment_document.${payload.file.name.split(".").reverse()[0]}`
        );

      const response: Response = await $fetch(
        `${config.public.apiBase}/transactions/payment/fulfill/${id}`,
        "put",
        data
      );
      if (response.status !== 200) throw new Error("");

      const result: string = await response.text();
      return result;
    } catch (e) {
      return null;
    }
  };

  const addTransactionPaymentWarning = async (
    id: string,
    payload: { document_id: string }
  ): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/transactions/payment/warn/${id}`,
        "put",
        JSON.stringify({
          document_id: payload.document_id,
        })
      );
      if (response.status !== 200) throw new Error("");

      const result: string = await response.text();
      return result;
    } catch (e) {
      return null;
    }
  };

  const getTransactions = async (text?: string): Promise<TransactionBase[]> => {
    try {
      const urlString: string = `${config.public.apiBase}/transactions?${
        text ? `text=${text}&` : ""
      }${query.value.type !== "all" ? `type=${query.value.type}&` : ""}${
        query.value.status !== "all" ? `status=${query.value.status}&` : ""
      }${
        query.value.start_date ? `start_date=${query.value.start_date}&` : ""
      }${query.value.end_date ? `end_date=${query.value.end_date}&` : ""}${
        query.value.skip ? `skip=${query.value.skip}&` : ""
      }${query.value.limit ? `limit=${query.value.limit}&` : ""}`;
      const response: Response = await $fetch(urlString, "get");
      if (response.status !== 200) throw new Error("");

      const result: TransactionBase[] = await response.json();
      return (transactions.value = result);
    } catch (e) {
      return null;
    }
  };

  const getTransactionDeliveries = async (
    id: string
  ): Promise<ProductStockMin[]> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/transactions/deliveries/${id}`,
        "get"
      );
      if (response.status !== 200) throw new Error("");
      const result: ProductStockMin[] = await response.json();
      return result;
    } catch (e) {
      return null;
    }
  };

  const getTransactionDeliveriesAvailable = async (
    id: string
  ): Promise<TransactionDelivery[]> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/transactions/deliveries/available/${id}`,
        "get"
      );
      if (response.status !== 200) throw new Error("");
      const result: TransactionDelivery[] = await response.json();
      return result;
    } catch (e) {
      return null;
    }
  };

  const getTransactionPayments = async (
    id: string
  ): Promise<TransactionPayment[]> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/transactions/payments/${id}`,
        "get"
      );
      if (response.status !== 200) throw new Error("");
      const result: TransactionPayment[] = await response.json();
      return result;
    } catch (e) {
      return null;
    }
  };

  const getTransactionDetails = async (id: string): Promise<Transaction> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/transactions/${id}`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result: Transaction = await response.json();
      return result;
    } catch (e) {
      return null;
    }
  };

  const getTransactionOverview = async (): Promise<TransactionOverview[]> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/transactions/overview?range=weekly`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result: TransactionOverview[] = await response.json();
      return result;
    } catch (e) {
      return null;
    }
  };

  const getTransactionUnfinished = async (): Promise<TransactionBase[]> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/transactions/unfinished`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result: TransactionBase[] = await response.json();
      return result;
    } catch (e) {
      return null;
    }
  };

  const cancelTransaction = async (
    id: string,
    payload: { message: string }
  ): Promise<string> => {
    try {
      const response: Response = await $fetch(
        `${config.public.apiBase}/transactions/cancel/${id}`,
        "put",
        JSON.stringify({
          message: payload.message,
        })
      );
      if (response.status !== 200) throw new Error("");

      const result: string = await response.text();
      return result;
    } catch (e) {
      return null;
    }
  };
  return {
    transactions,
    loading,
    query,
    addInmate,
    addTransactionDelivery,
    addTransactionAcceptance,
    addTransactionPayment,
    addTransactionPaymentFulfillment,
    addTransactionPaymentWarning,
    getTransactions,
    getTransactionDeliveries,
    getTransactionDeliveriesAvailable,
    getTransactionPayments,
    getTransactionDetails,
    getTransactionOverview,
    getTransactionUnfinished,
    cancelTransaction,
  };
};
