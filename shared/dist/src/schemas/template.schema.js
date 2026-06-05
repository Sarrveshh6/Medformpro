"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormTemplateSchema = exports.FormSectionSchema = exports.FormQuestionSchema = exports.QuestionOptionSchema = void 0;
const zod_1 = require("zod");
exports.QuestionOptionSchema = zod_1.z.object({
    value: zod_1.z.number(),
    label: zod_1.z.string(),
    labelHi: zod_1.z.string().optional(),
});
exports.FormQuestionSchema = zod_1.z.object({
    questionId: zod_1.z.string(),
    text: zod_1.z.string(),
    textHi: zod_1.z.string().optional(),
    type: zod_1.z.enum(["radio", "scale", "numeric", "text"]),
    options: zod_1.z.array(exports.QuestionOptionSchema).optional(),
    min: zod_1.z.number().optional(),
    max: zod_1.z.number().optional(),
    required: zod_1.z.boolean().default(true),
    order: zod_1.z.number(),
    scaleGroup: zod_1.z.string().optional(),
});
exports.FormSectionSchema = zod_1.z.object({
    sectionId: zod_1.z.string(),
    title: zod_1.z.string(),
    order: zod_1.z.number(),
    questions: zod_1.z.array(exports.FormQuestionSchema),
});
exports.FormTemplateSchema = zod_1.z.object({
    templateId: zod_1.z.string(),
    name: zod_1.z.string(),
    version: zod_1.z.string(),
    description: zod_1.z.string(),
    sections: zod_1.z.array(exports.FormSectionSchema),
    scoringAlgorithm: zod_1.z.string(),
    isActive: zod_1.z.boolean().default(true),
});
