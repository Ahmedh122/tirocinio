import type { FileType } from "./file-type";
import type { Result } from "./result";

export type ApiFile = {
  _id: string;
  type?: FileType;
  uploaded: string;
  file_name?: string;
  type_id: string;
  status: string;
  debug: string;
  pdf: {
    fieldname?: string;
    originalname?: string;
    encoding?: string;
    mimetype?: string;
    buffer?: string;
    size?: number;
  };
  result?: Result;
};
//
