import express from 'express';
import crypto from 'crypto';
import { SubmissionModel } from '../models/Submission';
import { PatientModel } from '../models/Patient';
import { FormTemplateModel, FormQuestionModel } from '../models/FormTemplate';
import { CreateSubmissionInputSchema, UpdateSubmissionInputSchema } from 'shared';
import { calculateEortcScores } from '../services/scoring.service';
import { generateSubmissionPDF } from '../services/pdf.service';

const router = express.Router();

// Helper to generate Submission ID
const generateSubmissionId = async () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const count = await SubmissionModel.countDocuments({
    createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
  });
  return `MFP-${dateStr}-${String(count + 1).padStart(5, '0')}`;
};

// POST /submissions
router.post('/', async (req, res, next) => {
  try {
    const validatedData = CreateSubmissionInputSchema.parse(req.body);
    const { patientInitials, patientDob } = req.body;
    
    const patient = await PatientModel.findOneAndUpdate(
      { patientId: validatedData.patientId },
      { 
        $set: { 
          initials: patientInitials,
          dateOfBirth: patientDob ? new Date(patientDob) : undefined
        },
        $setOnInsert: { patientId: validatedData.patientId } 
      },
      { upsert: true, new: true }
    );

    const template = await FormTemplateModel.findOne({ templateId: validatedData.templateId });
    if (!template) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Template not found', statusCode: 404 } });

    const submissionId = await generateSubmissionId();
    
    let scores = {};
    if (validatedData.status === 'complete' && template.scoringAlgorithm === 'EORTC_QLQ_C30_V3') {
      scores = calculateEortcScores(validatedData.responses);
    }

    const ipAddress = req.ip || req.connection.remoteAddress || '';
    const ipHash = crypto.createHash('sha256').update(ipAddress).digest('hex');

    const newSubmission = await SubmissionModel.create({
      submissionId,
      patient: patient._id,
      template: template._id,
      status: validatedData.status,
      visitDate: validatedData.visitDate,
      responses: validatedData.responses,
      scores,
      deviceInfo: {
        userAgent: req.headers['user-agent'],
      },
      ipHash,
    });

    res.status(201).json({
      submissionId: newSubmission.submissionId,
      status: newSubmission.status,
      createdAt: newSubmission.createdAt,
    });
  } catch (error) {
    next(error);
  }
});

// GET /submissions
router.get('/', async (req, res, next) => {
  try {
    const { patientId, status, from, to, templateId, sort = 'visitDate', order = 'desc', page = 1, limit = 20 } = req.query;
    const query: any = { isDeleted: false };

    if (patientId) {
      const patient = await PatientModel.findOne({ patientId });
      if (patient) query.patient = patient._id;
    }
    if (status) query.status = status;
    if (templateId) {
      const template = await FormTemplateModel.findOne({ templateId });
      if (template) query.template = template._id;
    }
    
    if (from || to) {
      query.visitDate = {};
      if (from) query.visitDate.$gte = new Date(from as string);
      if (to) query.visitDate.$lte = new Date(to as string);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortObj: any = { [sort as string]: order === 'desc' ? -1 : 1 };

    const submissions = await SubmissionModel.find(query)
      .populate('patient', 'patientId name initials dateOfBirth')
      .populate('template', 'templateId name')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    const total = await SubmissionModel.countDocuments(query);

    res.json({ data: submissions, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    next(error);
  }
});

// GET /submissions/:submissionId
router.get('/:submissionId', async (req, res, next) => {
  try {
    const submission = await SubmissionModel.findOne({ submissionId: req.params.submissionId, isDeleted: false })
      .populate('patient')
      .populate({
        path: 'template',
        populate: {
          path: 'sections.questions',
          model: FormQuestionModel
        }
      });

    if (!submission) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Submission not found', statusCode: 404 } });
    
    res.json(submission);
  } catch (error) {
    next(error);
  }
});

// GET /submissions/:submissionId/pdf
router.get('/:submissionId/pdf', async (req, res, next) => {
  try {
    const submission = await SubmissionModel.findOne({ submissionId: req.params.submissionId, isDeleted: false })
      .populate('patient')
      .populate({
        path: 'template',
        populate: {
          path: 'sections.questions',
          model: FormQuestionModel
        }
      });

    if (!submission) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Submission not found', statusCode: 404 } });
    if (submission.status !== 'complete') {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Cannot generate PDF for incomplete submission', statusCode: 400 } });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Report-${submission.submissionId}.pdf`);

    generateSubmissionPDF(
      submission as any,
      submission.patient as any,
      submission.template as any,
      (chunk) => res.write(chunk),
      () => res.end()
    );

  } catch (error) {
    next(error);
  }
});

// PUT /submissions/:submissionId
router.put('/:submissionId', async (req, res, next) => {
  try {
    const validatedData = UpdateSubmissionInputSchema.parse(req.body);
    
    const submission = await SubmissionModel.findOne({ submissionId: req.params.submissionId, isDeleted: false }).populate('template');
    if (!submission) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Submission not found', statusCode: 404 } });

    if (validatedData.status) submission.status = validatedData.status;
    if (validatedData.visitDate) submission.visitDate = validatedData.visitDate;
    if (validatedData.responses) {
      submission.responses = validatedData.responses as any;
      
      const template = submission.template as any;
      if (submission.status === 'complete' && template.scoringAlgorithm === 'EORTC_QLQ_C30_V3') {
        submission.scores = calculateEortcScores(validatedData.responses) as any;
      }
    }

    await submission.save();
    res.json(submission);
  } catch (error) {
    next(error);
  }
});

export default router;
