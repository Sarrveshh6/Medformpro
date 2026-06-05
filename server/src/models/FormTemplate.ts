import mongoose, { Schema, Document } from 'mongoose';
import { FormTemplate as IFormTemplate, FormQuestion as IFormQuestion } from 'shared';

export interface FormQuestionDocument extends Omit<IFormQuestion, 'options'>, Document {
  template: mongoose.Types.ObjectId;
  options?: { value: number; label: string; labelHi?: string }[];
}

const FormQuestionSchema = new Schema<FormQuestionDocument>({
  questionId: { type: String, required: true },
  template: { type: Schema.Types.ObjectId, ref: 'FormTemplate', required: true },
  text: { type: String, required: true },
  textHi: { type: String },
  type: { type: String, enum: ['radio', 'scale', 'numeric', 'text'], required: true },
  options: [{ value: Number, label: String, labelHi: String }],
  min: { type: Number },
  max: { type: Number },
  required: { type: Boolean, default: true },
  order: { type: Number, required: true },
  scaleGroup: { type: String },
});

FormQuestionSchema.index({ template: 1, order: 1 });

export const FormQuestionModel = mongoose.model<FormQuestionDocument>('FormQuestion', FormQuestionSchema);


export interface FormTemplateDocument extends Omit<IFormTemplate, 'sections'>, Document {
  createdAt: Date;
  sections: {
    sectionId: string;
    title: string;
    order: number;
    questions: mongoose.Types.ObjectId[];
  }[];
}

const FormTemplateSchema = new Schema<FormTemplateDocument>(
  {
    templateId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    version: { type: String, required: true },
    description: { type: String },
    sections: [
      {
        sectionId: String,
        title: String,
        order: Number,
        questions: [{ type: Schema.Types.ObjectId, ref: 'FormQuestion' }],
      },
    ],
    scoringAlgorithm: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const FormTemplateModel = mongoose.model<FormTemplateDocument>('FormTemplate', FormTemplateSchema);
