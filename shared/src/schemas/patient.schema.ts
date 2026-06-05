import { z } from "zod";

export const PatientSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  name: z.object({
    first: z.string().min(1, "First name is required"),
    last: z.string().min(1, "Last name is required"),
  }),
  dateOfBirth: z.string().or(z.date()).transform(val => new Date(val)),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
  contact: z.object({
    phone: z.string().min(10, "Valid phone number required"),
    email: z.string().email("Invalid email format").optional().or(z.literal("")),
  }),
});

export type Patient = z.infer<typeof PatientSchema>;

// Schema for updating a patient (all fields optional)
export const PatientUpdateSchema = PatientSchema.partial().omit({ patientId: true });
export type PatientUpdate = z.infer<typeof PatientUpdateSchema>;
