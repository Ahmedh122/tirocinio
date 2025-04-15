
import type { Query } from "./query";
import  type { QueryTrace } from "./query-trace";

export type FileType = {
  _id: string;
  name: string;
  company_id?: string;
  providerSettings?: string;
  fields: string[];
  tracciato?: QueryTrace;
  query?: Query;
  groups?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  edited?: Record<string, any>;
  priority?: number;
  model: {
    intestazioni: {
      [key: string]: {
        nome: string;
        campi: [{ [key: string]: string | boolean | number }];
      };
    };
    table: {
      columns: [{ [key: string]: string | boolean | number }];
    };
  };
  image?: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: string;
  };
};