import { z } from "zod";
export declare const QuestionOptionSchema: z.ZodObject<{
    value: z.ZodNumber;
    label: z.ZodString;
    labelHi: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    value: number;
    label: string;
    labelHi?: string | undefined;
}, {
    value: number;
    label: string;
    labelHi?: string | undefined;
}>;
export declare const FormQuestionSchema: z.ZodObject<{
    questionId: z.ZodString;
    text: z.ZodString;
    textHi: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<["radio", "scale", "numeric", "text"]>;
    options: z.ZodOptional<z.ZodArray<z.ZodObject<{
        value: z.ZodNumber;
        label: z.ZodString;
        labelHi: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        value: number;
        label: string;
        labelHi?: string | undefined;
    }, {
        value: number;
        label: string;
        labelHi?: string | undefined;
    }>, "many">>;
    min: z.ZodOptional<z.ZodNumber>;
    max: z.ZodOptional<z.ZodNumber>;
    required: z.ZodDefault<z.ZodBoolean>;
    order: z.ZodNumber;
    scaleGroup: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "text" | "radio" | "scale" | "numeric";
    questionId: string;
    text: string;
    required: boolean;
    order: number;
    options?: {
        value: number;
        label: string;
        labelHi?: string | undefined;
    }[] | undefined;
    textHi?: string | undefined;
    min?: number | undefined;
    max?: number | undefined;
    scaleGroup?: string | undefined;
}, {
    type: "text" | "radio" | "scale" | "numeric";
    questionId: string;
    text: string;
    order: number;
    options?: {
        value: number;
        label: string;
        labelHi?: string | undefined;
    }[] | undefined;
    textHi?: string | undefined;
    min?: number | undefined;
    max?: number | undefined;
    required?: boolean | undefined;
    scaleGroup?: string | undefined;
}>;
export type FormQuestion = z.infer<typeof FormQuestionSchema>;
export declare const FormSectionSchema: z.ZodObject<{
    sectionId: z.ZodString;
    title: z.ZodString;
    order: z.ZodNumber;
    questions: z.ZodArray<z.ZodObject<{
        questionId: z.ZodString;
        text: z.ZodString;
        textHi: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<["radio", "scale", "numeric", "text"]>;
        options: z.ZodOptional<z.ZodArray<z.ZodObject<{
            value: z.ZodNumber;
            label: z.ZodString;
            labelHi: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            value: number;
            label: string;
            labelHi?: string | undefined;
        }, {
            value: number;
            label: string;
            labelHi?: string | undefined;
        }>, "many">>;
        min: z.ZodOptional<z.ZodNumber>;
        max: z.ZodOptional<z.ZodNumber>;
        required: z.ZodDefault<z.ZodBoolean>;
        order: z.ZodNumber;
        scaleGroup: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "text" | "radio" | "scale" | "numeric";
        questionId: string;
        text: string;
        required: boolean;
        order: number;
        options?: {
            value: number;
            label: string;
            labelHi?: string | undefined;
        }[] | undefined;
        textHi?: string | undefined;
        min?: number | undefined;
        max?: number | undefined;
        scaleGroup?: string | undefined;
    }, {
        type: "text" | "radio" | "scale" | "numeric";
        questionId: string;
        text: string;
        order: number;
        options?: {
            value: number;
            label: string;
            labelHi?: string | undefined;
        }[] | undefined;
        textHi?: string | undefined;
        min?: number | undefined;
        max?: number | undefined;
        required?: boolean | undefined;
        scaleGroup?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    order: number;
    sectionId: string;
    title: string;
    questions: {
        type: "text" | "radio" | "scale" | "numeric";
        questionId: string;
        text: string;
        required: boolean;
        order: number;
        options?: {
            value: number;
            label: string;
            labelHi?: string | undefined;
        }[] | undefined;
        textHi?: string | undefined;
        min?: number | undefined;
        max?: number | undefined;
        scaleGroup?: string | undefined;
    }[];
}, {
    order: number;
    sectionId: string;
    title: string;
    questions: {
        type: "text" | "radio" | "scale" | "numeric";
        questionId: string;
        text: string;
        order: number;
        options?: {
            value: number;
            label: string;
            labelHi?: string | undefined;
        }[] | undefined;
        textHi?: string | undefined;
        min?: number | undefined;
        max?: number | undefined;
        required?: boolean | undefined;
        scaleGroup?: string | undefined;
    }[];
}>;
export type FormSection = z.infer<typeof FormSectionSchema>;
export declare const FormTemplateSchema: z.ZodObject<{
    templateId: z.ZodString;
    name: z.ZodString;
    version: z.ZodString;
    description: z.ZodString;
    sections: z.ZodArray<z.ZodObject<{
        sectionId: z.ZodString;
        title: z.ZodString;
        order: z.ZodNumber;
        questions: z.ZodArray<z.ZodObject<{
            questionId: z.ZodString;
            text: z.ZodString;
            textHi: z.ZodOptional<z.ZodString>;
            type: z.ZodEnum<["radio", "scale", "numeric", "text"]>;
            options: z.ZodOptional<z.ZodArray<z.ZodObject<{
                value: z.ZodNumber;
                label: z.ZodString;
                labelHi: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                value: number;
                label: string;
                labelHi?: string | undefined;
            }, {
                value: number;
                label: string;
                labelHi?: string | undefined;
            }>, "many">>;
            min: z.ZodOptional<z.ZodNumber>;
            max: z.ZodOptional<z.ZodNumber>;
            required: z.ZodDefault<z.ZodBoolean>;
            order: z.ZodNumber;
            scaleGroup: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "text" | "radio" | "scale" | "numeric";
            questionId: string;
            text: string;
            required: boolean;
            order: number;
            options?: {
                value: number;
                label: string;
                labelHi?: string | undefined;
            }[] | undefined;
            textHi?: string | undefined;
            min?: number | undefined;
            max?: number | undefined;
            scaleGroup?: string | undefined;
        }, {
            type: "text" | "radio" | "scale" | "numeric";
            questionId: string;
            text: string;
            order: number;
            options?: {
                value: number;
                label: string;
                labelHi?: string | undefined;
            }[] | undefined;
            textHi?: string | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            scaleGroup?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        order: number;
        sectionId: string;
        title: string;
        questions: {
            type: "text" | "radio" | "scale" | "numeric";
            questionId: string;
            text: string;
            required: boolean;
            order: number;
            options?: {
                value: number;
                label: string;
                labelHi?: string | undefined;
            }[] | undefined;
            textHi?: string | undefined;
            min?: number | undefined;
            max?: number | undefined;
            scaleGroup?: string | undefined;
        }[];
    }, {
        order: number;
        sectionId: string;
        title: string;
        questions: {
            type: "text" | "radio" | "scale" | "numeric";
            questionId: string;
            text: string;
            order: number;
            options?: {
                value: number;
                label: string;
                labelHi?: string | undefined;
            }[] | undefined;
            textHi?: string | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            scaleGroup?: string | undefined;
        }[];
    }>, "many">;
    scoringAlgorithm: z.ZodString;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    templateId: string;
    version: string;
    description: string;
    sections: {
        order: number;
        sectionId: string;
        title: string;
        questions: {
            type: "text" | "radio" | "scale" | "numeric";
            questionId: string;
            text: string;
            required: boolean;
            order: number;
            options?: {
                value: number;
                label: string;
                labelHi?: string | undefined;
            }[] | undefined;
            textHi?: string | undefined;
            min?: number | undefined;
            max?: number | undefined;
            scaleGroup?: string | undefined;
        }[];
    }[];
    scoringAlgorithm: string;
    isActive: boolean;
}, {
    name: string;
    templateId: string;
    version: string;
    description: string;
    sections: {
        order: number;
        sectionId: string;
        title: string;
        questions: {
            type: "text" | "radio" | "scale" | "numeric";
            questionId: string;
            text: string;
            order: number;
            options?: {
                value: number;
                label: string;
                labelHi?: string | undefined;
            }[] | undefined;
            textHi?: string | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            scaleGroup?: string | undefined;
        }[];
    }[];
    scoringAlgorithm: string;
    isActive?: boolean | undefined;
}>;
export type FormTemplate = z.infer<typeof FormTemplateSchema>;
