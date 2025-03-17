import { z } from 'zod';

export const ClubInfoSchema = z.object({
  name: z.string().min(1, "Vereinsname ist erforderlich"),
  iban: z.string().min(15, "IBAN ist erforderlich"),
  bic: z.string().min(8, "BIC ist erforderlich"),
  creditorId: z.string().min(1, "Gläubiger-ID ist erforderlich"),
  executionDaysInFuture: z.number().int().min(1),
  purpose: z.string().min(1, "Verwendungszweck ist erforderlich"),
  reference: z.string().min(1, "Referenz ist erforderlich"),
  membershipFee: z.number().min(0.01, "Mitgliedsbeitrag muss größer als 0 sein"),
});

export type ClubInfo = z.infer<typeof ClubInfoSchema>;

export const MemberSchema = z.object({
  name: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  iban: z.string().min(15, "IBAN ist erforderlich"),
  mandateDate: z.string().min(1, "Datum des Lastschriftmandats ist erforderlich"),
  mandateReference: z.string().min(1, "Mandatsreferenz ist erforderlich"),
  fee: z.number().optional(),
}).refine(data => (data.name !== undefined) || (data.firstName !== undefined && data.lastName !== undefined), {
  message: "Entweder Name oder Vorname und Nachname müssen angegeben werden",
  path: ["name"],
});

export type Member = z.infer<typeof MemberSchema>;

export interface ColumnMapping {
  name?: number;
  firstName?: number;
  lastName?: number;
  iban: number;
  mandateDate: number;
  mandateReference: number;
  fee?: number;
}
