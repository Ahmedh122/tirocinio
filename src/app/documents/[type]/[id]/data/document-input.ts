/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { parseToIsoDate } from '../../../../utils/date-parse';

dayjs.extend(customParseFormat);

export class DocumentInputType {
  label: string;
  path: string;
  field = '';
  type = 'string';
  mandatory?: boolean;
  isTableData?: boolean;
  readOnly?: boolean;
  rel: {
    path: string;
    field: string;
  };
  remoteValidation: {
    url: string;
    method: string;
    apiKey: string;
    apiSecret: string;
    key: string;
    input: {
      [key: string]: string;
    };
    params: {
      [key: string]: string;
    };
  };


  constructor(json: any) {
    this.label = json.etichetta || json.label;
    this.path = json.percorso || json.path;
    this.field = json.campo || json.field;
    this.type = json.tipo || json.type;
    this.mandatory = json.obbligatorio || json.mandatory;
    this.isTableData = json.datoTabella || json.isTableData;
    this.readOnly = json.solaLettura || json.readOnly;
    this.remoteValidation = json.validazioneRemota || json.remoteValidation;
    this.rel = json.relazione || json.rel;
  }


  parseValue(value: string): any {
    switch (this.type) {
      case 'number':
        return Number.parseFloat(value);
      case 'date':
        return parseToIsoDate(value);
      case 'string':
        return value;
    }
    return value;
  }

 
  formatValue(value: any): string {
    switch (this.type) {
      case 'number':
        return value.toString();
      case 'date':
        return value;
      case 'string':
        return value;
    }
    return value;
  }

  toJson(lang = 'it') {
    const jsonIt = {
      etichetta: this.label,
      percorso: this.path,
      campo: this.field,
      tipo: this.type,
    };
    if (lang === 'it') return jsonIt;
    return this;
  }
}