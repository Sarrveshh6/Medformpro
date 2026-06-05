import mongoose, { Schema, Document } from 'mongoose';
import { Submission as ISubmission, Scores } from 'shared';

export interface SubmissionDocument extends Omit<ISubmission, 'patientId' | 'templateId'>, Document {
  submissionId: string;
  patient: mongoose.Types.ObjectId;
  template: mongoose.Types.ObjectId;
  deviceInfo?: { userAgent?: string; platform?: string };
  ipHash?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<SubmissionDocument>(
  {
    submissionId: { type: String, required: true, unique: true, index: true },
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    template: { type: Schema.Types.ObjectId, ref: 'FormTemplate', required: true },
    status: { type: String, enum: ['draft', 'complete', 'invalid'], required: true },
    visitDate: { type: Date, required: true },
    responses: [
      {
        questionId: { type: String, required: true },
        value: { type: Schema.Types.Mixed, required: true },
      },
    ],
    scores: {
      globalHealth: Number,
      physicalFunctioning: Number,
      roleFunctioning: Number,
      emotionalFunctioning: Number,
      cognitiveFunctioning: Number,
      socialFunctioning: Number,
      fatigue: Number,
      nauseaVomiting: Number,
      pain: Number,
      financialImpact: Number,
      dyspnoea: Number,
      insomnia: Number,
      appetiteLoss: Number,
      constipation: Number,
      diarrhoea: Number,
    },
    deviceInfo: {
      userAgent: String,
      platform: String,
    },
    ipHash: String,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

SubmissionSchema.index({ patient: 1, visitDate: -1 });
SubmissionSchema.index({ status: 1, createdAt: -1 });
SubmissionSchema.index({ 'scores.globalHealth': 1 });

export const SubmissionModel = mongoose.model<SubmissionDocument>('Submission', SubmissionSchema);
