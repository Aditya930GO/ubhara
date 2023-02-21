import { UserRecord } from "./general";

export interface Inmate {
  registration: string;
  name: string;
  alias: string;
  NIK: string;
  place_of_birth: string;
  date_of_birth: Date;
  address: string;
  city: string;
  district: string;
  sex: string;
  date_inside: Date;
  category: string;
  create_date: Date;
  image_url?: File[];
  notes: string;
}
export interface InmateRequest {
  registration: string;
  NIK: string;
  name: string;
  alias: string;
  place_of_birth: string;
  date_of_birth: Date;
  address: string;
  city: string;
  district: string;
  sex: string;
  date_inside: Date;
  category: string;
  file?: File[];
  file_delete?: string[];
  notes: string;
  _id?: string;
}
export interface InmateQuery {
  category: string;
  start_date: number;
  end_date: number;
  skip?: number;
  limit?: number;
}
