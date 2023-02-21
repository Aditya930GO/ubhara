import { UserRecord } from "./general";

interface TransactionPaymentStatus {
  file_url?: string;
  amount: number;
  remaining: number;
  date: Date;
  user: UserRecord;
}

export interface TransactionPayment {
  transaction_id?: string;
  amount: number;
  paid: number;
  date: Date;
  status: TransactionPaymentStatus[];
  user: UserRecord;
  document: TransactionDocument;
  finished: boolean;
}

export interface TransactionStatus {
  type: "waiting" | "processing" | "finished" | "rejected" | "cancelled";
  date: Date;
  user: UserRecord;
}

export interface TransactionItem {
  _id: string;
  quantity: number;
  name?: string;
  price?: number;
  discount?: number;
}

interface TransactionSubject {
  _id: string;
  name: string;
}

export interface TransactionDocument {
  _id?: string;
  number: string;
  type?:
    | "acceptance_document"
    | "purchase_order"
    | "delivery_document"
    | "warning_document"
    | "invoice"
    | "tax_invoice";
  file?: File;
  file_url?: string;
}

interface TransactionDeliveryItem {
  _id: string;
  quantity: number;
  price?: number;
  discount?: number;
}

export interface TransactionDelivery {
  document: {
    _id: string;
    number: string;
  };
  item: TransactionDeliveryItem[];
  user: UserRecord;
  date: Date;
}

interface TransactionActivity {
  type: "status" | "delivery" | "payment";
  date: Date;
  user?: UserRecord;
  document?: TransactionDocument[];
  status_type?: TransactionStatus["type"];
  message?: string;
}

export interface TransactionQuery {
  type: Transaction["type"] | "all";
  start_date: number;
  end_date: number;
  status: TransactionStatus["type"] | "all";
  skip?: number;
  limit?: number;
}

export interface InmateRequest {
  registration: string;
  name: string;
  NIK: string;
  place_of_birth: string;
  date_of_birth: Date;
  address: string;
  city: string;
  district: string;
  sex: string;
  date: Date;
  category: string;
  file?: File[];
  notes: string;
}

export interface TransactionRequest {
  type: TransactionBase["type"];
  item: TransactionItem[];
  tax: number;
  branch_id: string;
  subject_id: string;
  purchase_order?: TransactionDocument;
}

export interface TransactionBase {
  _id: string;
  total: number;
  subject: TransactionSubject;
  status: TransactionStatus[];
  purchase_order: TransactionDocument;
  create_date: Date;
  type: "purchase" | "sale";
}

export interface Transaction {
  _id: string;
  branch_id: string;
  type: TransactionBase["type"];
  sub_total: number;
  total: number;
  tax: number;
  subject: TransactionSubject;
  purchase_order: TransactionDocument;
  item: TransactionItem[];
  status: TransactionStatus[];
  activity: TransactionActivity[];
  create_date: Date;
}

export interface TransactionOverview {
  type: "income" | "outcome" | "profit";
  value: number;
}
