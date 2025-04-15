export type Query ={
    _id: string;
    name?: string;
    text?: string;
    provider?: string;
    external_fields?: Record<string, string>;
};