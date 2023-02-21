import { ObjectId } from "mongodb";
import { ErrorMessage } from "../plugins/errors";

export type EventAction =
  | "create-user"
  | "update-user"
  | "delete-user"
  | "read-user"
  | "create-role"
  | "update-role"
  | "delete-role"
  | "read-role"
  | "create-product"
  | "update-product"
  | "delete-product"
  | "read-product"
  | "create-supplier"
  | "update-supplier"
  | "delete-supplier"
  | "read-supplier"
  | "create-customer"
  | "update-customer"
  | "delete-customer"
  | "read-customer"
  | "create-stock"
  | "update-stock"
  | "approve-sale"
  | "create-sale"
  | "update-sale"
  | "delete-sale"
  | "read-sale"
  | "approve-purchase"
  | "create-purchase"
  | "update-purchase"
  | "delete-purchase"
  | "read-purchase";

interface EventUser {
  _id: ObjectId;
  role_id: ObjectId[];
  name: string;
}

export interface EventBase {
  type: "action" | "system";
  date: Date;
  action?: EventAction;
  before_data?: any;
  after_data?: any;
  error_message?: ErrorMessage;
  error_stack?: any;
  user?: EventUser;
}

export interface Event extends EventBase {
  _id: ObjectId;
}
