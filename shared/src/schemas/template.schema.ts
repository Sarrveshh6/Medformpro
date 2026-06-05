import { z } from "zod";

export const QuestionOptionSchema = z.object({
  value: z.number(),
  label: z.string(),
  labelHi: z.string().optional(),
});

export const FormQuestionSchema = z.object({
  questionId: z.string(),
  text: z.string(),
  textHi: z.string().optional(),
  type: z.enum(["radio", "scale", "numeric", "text"]),
  options: z.array(QuestionOptionSchema).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  required: z.boolean().default(true),
  order: z.number(),
  scaleGroup: z.string().optional(),
});

export type FormQuestion = z.infer<typeof FormQuestionSchema>;

export const FormSectionSchema = z.object({
  sectionId: z.string(),
  title: z.string(),
  order: z.number(),
  questions: z.array(FormQuestionSchema),
});

export type FormSection = z.infer<typeof FormSectionSchema>;

export const FormTemplateSchema = z.object({
  templateId: z.string(),
  name: z.string(),
  version: z.string(),
  description: z.string(),
  sections: z.array(FormSectionSchema),
  scoringAlgorithm: z.string(),
  isActive: z.boolean().default(true),
});

export type FormTemplate = z.infer<typeof FormTemplateSchema>;
