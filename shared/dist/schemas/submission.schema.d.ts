import { z } from "zod";
export declare const ResponseItemSchema: z.ZodObject<{
    questionId: z.ZodString;
    value: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
}, "strip", z.ZodTypeAny, {
    value: string | number;
    questionId: string;
}, {
    value: string | number;
    questionId: string;
}>;
export type ResponseItem = z.infer<typeof ResponseItemSchema>;
export declare const ScoresSchema: z.ZodObject<{
    globalHealth: z.ZodNumber;
    physicalFunctioning: z.ZodNumber;
    roleFunctioning: z.ZodNumber;
    emotionalFunctioning: z.ZodNumber;
    cognitiveFunctioning: z.ZodNumber;
    socialFunctioning: z.ZodNumber;
    fatigue: z.ZodNumber;
    nauseaVomiting: z.ZodNumber;
    pain: z.ZodNumber;
    financialImpact: z.ZodNumber;
    dyspnoea: z.ZodOptional<z.ZodNumber>;
    insomnia: z.ZodOptional<z.ZodNumber>;
    appetiteLoss: z.ZodOptional<z.ZodNumber>;
    constipation: z.ZodOptional<z.ZodNumber>;
    diarrhoea: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    globalHealth: number;
    physicalFunctioning: number;
    roleFunctioning: number;
    emotionalFunctioning: number;
    cognitiveFunctioning: number;
    socialFunctioning: number;
    fatigue: number;
    nauseaVomiting: number;
    pain: number;
    financialImpact: number;
    dyspnoea?: number | undefined;
    insomnia?: number | undefined;
    appetiteLoss?: number | undefined;
    constipation?: number | undefined;
    diarrhoea?: number | undefined;
}, {
    globalHealth: number;
    physicalFunctioning: number;
    roleFunctioning: number;
    emotionalFunctioning: number;
    cognitiveFunctioning: number;
    socialFunctioning: number;
    fatigue: number;
    nauseaVomiting: number;
    pain: number;
    financialImpact: number;
    dyspnoea?: number | undefined;
    insomnia?: number | undefined;
    appetiteLoss?: number | undefined;
    constipation?: number | undefined;
    diarrhoea?: number | undefined;
}>;
export type Scores = z.infer<typeof ScoresSchema>;
export declare const SubmissionSchema: z.ZodObject<{
    patientId: z.ZodString;
    templateId: z.ZodString;
    visitDate: z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodDate]>, Date, string | Date>;
    status: z.ZodEnum<["draft", "complete", "invalid"]>;
    responses: z.ZodArray<z.ZodObject<{
        questionId: z.ZodString;
        value: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
    }, "strip", z.ZodTypeAny, {
        value: string | number;
        questionId: string;
    }, {
        value: string | number;
        questionId: string;
    }>, "many">;
    scores: z.ZodOptional<z.ZodObject<{
        globalHealth: z.ZodNumber;
        physicalFunctioning: z.ZodNumber;
        roleFunctioning: z.ZodNumber;
        emotionalFunctioning: z.ZodNumber;
        cognitiveFunctioning: z.ZodNumber;
        socialFunctioning: z.ZodNumber;
        fatigue: z.ZodNumber;
        nauseaVomiting: z.ZodNumber;
        pain: z.ZodNumber;
        financialImpact: z.ZodNumber;
        dyspnoea: z.ZodOptional<z.ZodNumber>;
        insomnia: z.ZodOptional<z.ZodNumber>;
        appetiteLoss: z.ZodOptional<z.ZodNumber>;
        constipation: z.ZodOptional<z.ZodNumber>;
        diarrhoea: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        globalHealth: number;
        physicalFunctioning: number;
        roleFunctioning: number;
        emotionalFunctioning: number;
        cognitiveFunctioning: number;
        socialFunctioning: number;
        fatigue: number;
        nauseaVomiting: number;
        pain: number;
        financialImpact: number;
        dyspnoea?: number | undefined;
        insomnia?: number | undefined;
        appetiteLoss?: number | undefined;
        constipation?: number | undefined;
        diarrhoea?: number | undefined;
    }, {
        globalHealth: number;
        physicalFunctioning: number;
        roleFunctioning: number;
        emotionalFunctioning: number;
        cognitiveFunctioning: number;
        socialFunctioning: number;
        fatigue: number;
        nauseaVomiting: number;
        pain: number;
        financialImpact: number;
        dyspnoea?: number | undefined;
        insomnia?: number | undefined;
        appetiteLoss?: number | undefined;
        constipation?: number | undefined;
        diarrhoea?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    patientId: string;
    status: "draft" | "complete" | "invalid";
    templateId: string;
    visitDate: Date;
    responses: {
        value: string | number;
        questionId: string;
    }[];
    scores?: {
        globalHealth: number;
        physicalFunctioning: number;
        roleFunctioning: number;
        emotionalFunctioning: number;
        cognitiveFunctioning: number;
        socialFunctioning: number;
        fatigue: number;
        nauseaVomiting: number;
        pain: number;
        financialImpact: number;
        dyspnoea?: number | undefined;
        insomnia?: number | undefined;
        appetiteLoss?: number | undefined;
        constipation?: number | undefined;
        diarrhoea?: number | undefined;
    } | undefined;
}, {
    patientId: string;
    status: "draft" | "complete" | "invalid";
    templateId: string;
    visitDate: string | Date;
    responses: {
        value: string | number;
        questionId: string;
    }[];
    scores?: {
        globalHealth: number;
        physicalFunctioning: number;
        roleFunctioning: number;
        emotionalFunctioning: number;
        cognitiveFunctioning: number;
        socialFunctioning: number;
        fatigue: number;
        nauseaVomiting: number;
        pain: number;
        financialImpact: number;
        dyspnoea?: number | undefined;
        insomnia?: number | undefined;
        appetiteLoss?: number | undefined;
        constipation?: number | undefined;
        diarrhoea?: number | undefined;
    } | undefined;
}>;
export type Submission = z.infer<typeof SubmissionSchema>;
export declare const CreateSubmissionInputSchema: z.ZodObject<{
    patientId: z.ZodString;
    templateId: z.ZodString;
    visitDate: z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodDate]>, Date, string | Date>;
    status: z.ZodEnum<["draft", "complete", "invalid"]>;
    responses: z.ZodArray<z.ZodObject<{
        questionId: z.ZodString;
        value: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
    }, "strip", z.ZodTypeAny, {
        value: string | number;
        questionId: string;
    }, {
        value: string | number;
        questionId: string;
    }>, "many">;
    scores: z.ZodOptional<z.ZodObject<{
        globalHealth: z.ZodNumber;
        physicalFunctioning: z.ZodNumber;
        roleFunctioning: z.ZodNumber;
        emotionalFunctioning: z.ZodNumber;
        cognitiveFunctioning: z.ZodNumber;
        socialFunctioning: z.ZodNumber;
        fatigue: z.ZodNumber;
        nauseaVomiting: z.ZodNumber;
        pain: z.ZodNumber;
        financialImpact: z.ZodNumber;
        dyspnoea: z.ZodOptional<z.ZodNumber>;
        insomnia: z.ZodOptional<z.ZodNumber>;
        appetiteLoss: z.ZodOptional<z.ZodNumber>;
        constipation: z.ZodOptional<z.ZodNumber>;
        diarrhoea: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        globalHealth: number;
        physicalFunctioning: number;
        roleFunctioning: number;
        emotionalFunctioning: number;
        cognitiveFunctioning: number;
        socialFunctioning: number;
        fatigue: number;
        nauseaVomiting: number;
        pain: number;
        financialImpact: number;
        dyspnoea?: number | undefined;
        insomnia?: number | undefined;
        appetiteLoss?: number | undefined;
        constipation?: number | undefined;
        diarrhoea?: number | undefined;
    }, {
        globalHealth: number;
        physicalFunctioning: number;
        roleFunctioning: number;
        emotionalFunctioning: number;
        cognitiveFunctioning: number;
        socialFunctioning: number;
        fatigue: number;
        nauseaVomiting: number;
        pain: number;
        financialImpact: number;
        dyspnoea?: number | undefined;
        insomnia?: number | undefined;
        appetiteLoss?: number | undefined;
        constipation?: number | undefined;
        diarrhoea?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    patientId: string;
    status: "draft" | "complete" | "invalid";
    templateId: string;
    visitDate: Date;
    responses: {
        value: string | number;
        questionId: string;
    }[];
    scores?: {
        globalHealth: number;
        physicalFunctioning: number;
        roleFunctioning: number;
        emotionalFunctioning: number;
        cognitiveFunctioning: number;
        socialFunctioning: number;
        fatigue: number;
        nauseaVomiting: number;
        pain: number;
        financialImpact: number;
        dyspnoea?: number | undefined;
        insomnia?: number | undefined;
        appetiteLoss?: number | undefined;
        constipation?: number | undefined;
        diarrhoea?: number | undefined;
    } | undefined;
}, {
    patientId: string;
    status: "draft" | "complete" | "invalid";
    templateId: string;
    visitDate: string | Date;
    responses: {
        value: string | number;
        questionId: string;
    }[];
    scores?: {
        globalHealth: number;
        physicalFunctioning: number;
        roleFunctioning: number;
        emotionalFunctioning: number;
        cognitiveFunctioning: number;
        socialFunctioning: number;
        fatigue: number;
        nauseaVomiting: number;
        pain: number;
        financialImpact: number;
        dyspnoea?: number | undefined;
        insomnia?: number | undefined;
        appetiteLoss?: number | undefined;
        constipation?: number | undefined;
        diarrhoea?: number | undefined;
    } | undefined;
}>;
export type CreateSubmissionInput = z.infer<typeof CreateSubmissionInputSchema>;
export declare const UpdateSubmissionInputSchema: z.ZodObject<{
    patientId: z.ZodOptional<z.ZodString>;
    templateId: z.ZodOptional<z.ZodString>;
    visitDate: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodDate]>, Date, string | Date>>;
    status: z.ZodOptional<z.ZodEnum<["draft", "complete", "invalid"]>>;
    responses: z.ZodOptional<z.ZodArray<z.ZodObject<{
        questionId: z.ZodString;
        value: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
    }, "strip", z.ZodTypeAny, {
        value: string | number;
        questionId: string;
    }, {
        value: string | number;
        questionId: string;
    }>, "many">>;
    scores: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        globalHealth: z.ZodNumber;
        physicalFunctioning: z.ZodNumber;
        roleFunctioning: z.ZodNumber;
        emotionalFunctioning: z.ZodNumber;
        cognitiveFunctioning: z.ZodNumber;
        socialFunctioning: z.ZodNumber;
        fatigue: z.ZodNumber;
        nauseaVomiting: z.ZodNumber;
        pain: z.ZodNumber;
        financialImpact: z.ZodNumber;
        dyspnoea: z.ZodOptional<z.ZodNumber>;
        insomnia: z.ZodOptional<z.ZodNumber>;
        appetiteLoss: z.ZodOptional<z.ZodNumber>;
        constipation: z.ZodOptional<z.ZodNumber>;
        diarrhoea: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        globalHealth: number;
        physicalFunctioning: number;
        roleFunctioning: number;
        emotionalFunctioning: number;
        cognitiveFunctioning: number;
        socialFunctioning: number;
        fatigue: number;
        nauseaVomiting: number;
        pain: number;
        financialImpact: number;
        dyspnoea?: number | undefined;
        insomnia?: number | undefined;
        appetiteLoss?: number | undefined;
        constipation?: number | undefined;
        diarrhoea?: number | undefined;
    }, {
        globalHealth: number;
        physicalFunctioning: number;
        roleFunctioning: number;
        emotionalFunctioning: number;
        cognitiveFunctioning: number;
        socialFunctioning: number;
        fatigue: number;
        nauseaVomiting: number;
        pain: number;
        financialImpact: number;
        dyspnoea?: number | undefined;
        insomnia?: number | undefined;
        appetiteLoss?: number | undefined;
        constipation?: number | undefined;
        diarrhoea?: number | undefined;
    }>>>;
}, "strip", z.ZodTypeAny, {
    patientId?: string | undefined;
    status?: "draft" | "complete" | "invalid" | undefined;
    templateId?: string | undefined;
    visitDate?: Date | undefined;
    responses?: {
        value: string | number;
        questionId: string;
    }[] | undefined;
    scores?: {
        globalHealth: number;
        physicalFunctioning: number;
        roleFunctioning: number;
        emotionalFunctioning: number;
        cognitiveFunctioning: number;
        socialFunctioning: number;
        fatigue: number;
        nauseaVomiting: number;
        pain: number;
        financialImpact: number;
        dyspnoea?: number | undefined;
        insomnia?: number | undefined;
        appetiteLoss?: number | undefined;
        constipation?: number | undefined;
        diarrhoea?: number | undefined;
    } | undefined;
}, {
    patientId?: string | undefined;
    status?: "draft" | "complete" | "invalid" | undefined;
    templateId?: string | undefined;
    visitDate?: string | Date | undefined;
    responses?: {
        value: string | number;
        questionId: string;
    }[] | undefined;
    scores?: {
        globalHealth: number;
        physicalFunctioning: number;
        roleFunctioning: number;
        emotionalFunctioning: number;
        cognitiveFunctioning: number;
        socialFunctioning: number;
        fatigue: number;
        nauseaVomiting: number;
        pain: number;
        financialImpact: number;
        dyspnoea?: number | undefined;
        insomnia?: number | undefined;
        appetiteLoss?: number | undefined;
        constipation?: number | undefined;
        diarrhoea?: number | undefined;
    } | undefined;
}>;
export type UpdateSubmissionInput = z.infer<typeof UpdateSubmissionInputSchema>;
