import { z } from "zod";
export declare const PatientSchema: z.ZodObject<{
    patientId: z.ZodString;
    name: z.ZodObject<{
        first: z.ZodString;
        last: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        first: string;
        last: string;
    }, {
        first: string;
        last: string;
    }>;
    dateOfBirth: z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodDate]>, Date, string | Date>;
    gender: z.ZodEnum<["male", "female", "other", "prefer_not_to_say"]>;
    contact: z.ZodObject<{
        phone: z.ZodString;
        email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    }, "strip", z.ZodTypeAny, {
        phone: string;
        email?: string | undefined;
    }, {
        phone: string;
        email?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    patientId: string;
    name: {
        first: string;
        last: string;
    };
    dateOfBirth: Date;
    gender: "male" | "female" | "other" | "prefer_not_to_say";
    contact: {
        phone: string;
        email?: string | undefined;
    };
}, {
    patientId: string;
    name: {
        first: string;
        last: string;
    };
    dateOfBirth: string | Date;
    gender: "male" | "female" | "other" | "prefer_not_to_say";
    contact: {
        phone: string;
        email?: string | undefined;
    };
}>;
export type Patient = z.infer<typeof PatientSchema>;
export declare const PatientUpdateSchema: z.ZodObject<Omit<{
    patientId: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodObject<{
        first: z.ZodString;
        last: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        first: string;
        last: string;
    }, {
        first: string;
        last: string;
    }>>;
    dateOfBirth: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodDate]>, Date, string | Date>>;
    gender: z.ZodOptional<z.ZodEnum<["male", "female", "other", "prefer_not_to_say"]>>;
    contact: z.ZodOptional<z.ZodObject<{
        phone: z.ZodString;
        email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    }, "strip", z.ZodTypeAny, {
        phone: string;
        email?: string | undefined;
    }, {
        phone: string;
        email?: string | undefined;
    }>>;
}, "patientId">, "strip", z.ZodTypeAny, {
    name?: {
        first: string;
        last: string;
    } | undefined;
    dateOfBirth?: Date | undefined;
    gender?: "male" | "female" | "other" | "prefer_not_to_say" | undefined;
    contact?: {
        phone: string;
        email?: string | undefined;
    } | undefined;
}, {
    name?: {
        first: string;
        last: string;
    } | undefined;
    dateOfBirth?: string | Date | undefined;
    gender?: "male" | "female" | "other" | "prefer_not_to_say" | undefined;
    contact?: {
        phone: string;
        email?: string | undefined;
    } | undefined;
}>;
export type PatientUpdate = z.infer<typeof PatientUpdateSchema>;
