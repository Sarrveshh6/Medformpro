import mongoose, { Schema, Document } from 'mongoose';
import { Patient as IPatient } from 'shared';

export interface PatientDocument extends Omit<IPatient, 'dateOfBirth'>, Document {
  dateOfBirth: Date;
  initials?: string;
  clinic?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const PatientSchema = new Schema<PatientDocument>(
  {
    patientId: { type: String, required: true, unique: true, index: true },
    initials: { type: String },
    name: {
      first: { type: String, default: 'Unknown' },
      last: { type: String, default: 'Unknown' },
    },
    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
      default: 'prefer_not_to_say',
    },
    contact: {
      phone: { type: String },
      email: { type: String },
    },
    clinic: { type: Schema.Types.ObjectId, ref: 'Clinic' }, // For Phase 2
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PatientSchema.index({ 'name.last': 1, 'name.first': 1 });

export const PatientModel = mongoose.model<PatientDocument>('Patient', PatientSchema);
