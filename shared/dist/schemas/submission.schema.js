"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubmissionInputSchema = exports.CreateSubmissionInputSchema = exports.SubmissionSchema = exports.ScoresSchema = exports.ResponseItemSchema = void 0;
const zod_1 = require("zod");
exports.ResponseItemSchema = zod_1.z.object({
    questionId: zod_1.z.string(),
    value: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]),
});
exports.ScoresSchema = zod_1.z.object({
    globalHealth: zod_1.z.number().min(0).max(100),
    physicalFunctioning: zod_1.z.number().min(0).max(100),
    roleFunctioning: zod_1.z.number().min(0).max(100),
    emotionalFunctioning: zod_1.z.number().min(0).max(100),
    cognitiveFunctioning: zod_1.z.number().min(0).max(100),
    socialFunctioning: zod_1.z.number().min(0).max(100),
    fatigue: zod_1.z.number().min(0).max(100),
    nauseaVomiting: zod_1.z.number().min(0).max(100),
    pain: zod_1.z.number().min(0).max(100),
    financialImpact: zod_1.z.number().min(0).max(100),
    dyspnoea: zod_1.z.number().min(0).max(100).optional(),
    insomnia: zod_1.z.number().min(0).max(100).optional(),
    appetiteLoss: zod_1.z.number().min(0).max(100).optional(),
    constipation: zod_1.z.number().min(0).max(100).optional(),
    diarrhoea: zod_1.z.number().min(0).max(100).optional(),
});
exports.SubmissionSchema = zod_1.z.object({
    patientId: zod_1.z.string().min(1, "Patient ID is required"),
    templateId: zod_1.z.string().min(1, "Template ID is required"),
    visitDate: zod_1.z.string().or(zod_1.z.date()).transform(val => new Date(val)),
    status: zod_1.z.enum(["draft", "complete", "invalid"]),
    responses: zod_1.z.array(exports.ResponseItemSchema),
    scores: exports.ScoresSchema.optional(), // Calculated server-side, not required from client
});
// Input for creating a new submission
exports.CreateSubmissionInputSchema = exports.SubmissionSchema;
exports.UpdateSubmissionInputSchema = exports.SubmissionSchema.partial();
