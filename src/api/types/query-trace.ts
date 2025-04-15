export type QueryTrace = {
    _id?:string;
    name?: string;
    exportFormat?: string;
    fields?: Field[];

}

export type Field ={
    Campo: string;
    place: string;
    Descrizione: string;
    type: string;
    mandatory: boolean;
    length: number;
    decimals: number | string;
    start: number;
    end : number;

};