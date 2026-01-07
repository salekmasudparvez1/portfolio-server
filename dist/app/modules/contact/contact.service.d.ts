import { IContact } from "./contact.interface";
export declare const ContactService: {
    createContact: (payload: IContact) => Promise<import("mongoose").Document<unknown, {}, IContact, {}, import("mongoose").DefaultSchemaOptions> & IContact & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    getAllContacts: (query: Record<string, any>) => Promise<{
        contacts: (IContact & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getContactById: (id: string) => Promise<import("mongoose").Document<unknown, {}, IContact, {}, import("mongoose").DefaultSchemaOptions> & IContact & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    updateContact: (id: string, payload: Partial<IContact>) => Promise<import("mongoose").Document<unknown, {}, IContact, {}, import("mongoose").DefaultSchemaOptions> & IContact & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    deleteContact: (id: string) => Promise<import("mongoose").Document<unknown, {}, IContact, {}, import("mongoose").DefaultSchemaOptions> & IContact & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
};
//# sourceMappingURL=contact.service.d.ts.map