"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientUpdateSchema = exports.PatientSchema = void 0;
const zod_1 = require("zod");
exports.PatientSchema = zod_1.z.object({
    patientId: zod_1.z.string().min(1, "Patient ID is required"),
    name: zod_1.z.object({
        first: zod_1.z.string().min(1, "First name is required"),
        last: zod_1.z.string().min(1, "Last name is required"),
    }),
    dateOfBirth: zod_1.z.string().or(zod_1.z.date()).transform(val => new Date(val)),
    gender: zod_1.z.enum(["male", "female", "other", "prefer_not_to_say"]),
    contact: zod_1.z.object({
        phone: zod_1.z.string().min(10, "Valid phone number required"),
        email: zod_1.z.string().email("Invalid email format").optional().or(zod_1.z.literal("")),
    }),
});
// Schema for updating a patient (all fields optional)
exports.PatientUpdateSchema = exports.PatientSchema.partial().omit({ patientId: true });
