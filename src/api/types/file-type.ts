/* eslint-disable @typescript-eslint/no-explicit-any */
import { DocumentInputType } from "../../app/documents/[type]/[id]/data/document-input";
import type { Query } from './query';
import type { QueryTrace } from './query-trace';

export type FileType = {
  _id: string;
  name: string;
  company_id?: string;
  providerSettings?: string;
  fields: string[];
  tracciato?: QueryTrace;
  query?: Query;
  groups?: string[];
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  edited?: Record<string, any>;
  priority?: number;
  model: {
    Intestazioni: {
      [key: string]: {
        nome: string;
        campi: [DocumentInputType];
      };
    };
    table: {
      columns: [DocumentInputType];
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
