import express from 'express';
import { PatientModel } from '../models/Patient';
import { SubmissionModel } from '../models/Submission';
import { PatientSchema, PatientUpdateSchema } from 'shared';

const router = express.Router();

// GET /patients
router.get('/', async (req, res, next) => {
  try {
    const { name, clinic, page = 1, limit = 20 } = req.query;
    const query: any = { isDeleted: false };
    
    if (name) {
      query.$or = [
        { 'name.first': { $regex: name, $options: 'i' } },
        { 'name.last': { $regex: name, $options: 'i' } }
      ];
    }
    if (clinic) query.clinic = clinic;

    const skip = (Number(page) - 1) * Number(limit);
    
    const patients = await PatientModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const total = await PatientModel.countDocuments(query);
    
    res.json({ data: patients, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    next(error);
  }
});

// POST /patients
router.post('/', async (req, res, next) => {
  try {
    const validatedData = PatientSchema.parse(req.body);
    const newPatient = await PatientModel.create(validatedData);
    res.status(201).json(newPatient);
  } catch (error) {
    next(error);
  }
});

// GET /patients/:patientId
router.get('/:patientId', async (req, res, next) => {
  try {
    const patient = await PatientModel.findOne({ patientId: req.params.patientId, isDeleted: false });
    if (!patient) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Patient not found', statusCode: 404 } });
    }
    res.json(patient);
  } catch (error) {
    next(error);
  }
});

// PUT /patients/:patientId
router.put('/:patientId', async (req, res, next) => {
  try {
    const validatedData = PatientUpdateSchema.parse(req.body);
    const updatedPatient = await PatientModel.findOneAndUpdate(
      { patientId: req.params.patientId, isDeleted: false },
      { $set: validatedData },
      { new: true, runValidators: true }
    );
    
    if (!updatedPatient) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Patient not found', statusCode: 404 } });
    }
    res.json(updatedPatient);
  } catch (error) {
    next(error);
  }
});

// DELETE /patients/:patientId
router.delete('/:patientId', async (req, res, next) => {
  try {
    const deletedPatient = await PatientModel.findOneAndUpdate(
      { patientId: req.params.patientId },
      { $set: { isDeleted: true } },
      { new: true }
    );
    
    if (!deletedPatient) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Patient not found', statusCode: 404 } });
    }
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// GET /patients/:patientId/submissions
router.get('/:patientId/submissions', async (req, res, next) => {
  try {
    const patient = await PatientModel.findOne({ patientId: req.params.patientId, isDeleted: false });
    if (!patient) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Patient not found', statusCode: 404 } });
    }

    const submissions = await SubmissionModel.find({ patient: patient._id, isDeleted: false })
      .populate('template', 'name version')
      .sort({ visitDate: -1 });

    res.json(submissions);
  } catch (error) {
    next(error);
  }
});

export default router;
