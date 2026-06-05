import { z } from "zod";

export const ResponseItemSchema = z.object({
  questionId: z.string(),
  value: z.union([z.number(), z.string()]),
});

export type ResponseItem = z.infer<typeof ResponseItemSchema>;

export const ScoresSchema = z.object({
  globalHealth: z.number().min(0).max(100),
  physicalFunctioning: z.number().min(0).max(100),
  roleFunctioning: z.number().min(0).max(100),
  emotionalFunctioning: z.number().min(0).max(100),
  cognitiveFunctioning: z.number().min(0).max(100),
  socialFunctioning: z.number().min(0).max(100),
  fatigue: z.number().min(0).max(100),
  nauseaVomiting: z.number().min(0).max(100),
  pain: z.number().min(0).max(100),
  financialImpact: z.number().min(0).max(100),
  dyspnoea: z.number().min(0).max(100).optional(),
  insomnia: z.number().min(0).max(100).optional(),
  appetiteLoss: z.number().min(0).max(100).optional(),
  constipation: z.number().min(0).max(100).optional(),
  diarrhoea: z.number().min(0).max(100).optional(),
});

export type Scores = z.infer<typeof ScoresSchema>;

export const SubmissionSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  templateId: z.string().min(1, "Template ID is required"),
  visitDate: z.string().or(z.date()).transform(val => new Date(val)),
  status: z.enum(["draft", "complete", "invalid"]),
  responses: z.array(ResponseItemSchema),
  scores: ScoresSchema.optional(), // Calculated server-side, not required from client
});

export type Submission = z.infer<typeof SubmissionSchema>;

// Input for creating a new submission
export const CreateSubmissionInputSchema = SubmissionSchema;
export type CreateSubmissionInput = z.infer<typeof CreateSubmissionInputSchema>;

export const UpdateSubmissionInputSchema = SubmissionSchema.partial();
export type UpdateSubmissionInput = z.infer<typeof UpdateSubmissionInputSchema>;
