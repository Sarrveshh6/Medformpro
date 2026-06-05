import express from 'express';
import { SubmissionModel } from '../models/Submission';
import { PatientModel } from '../models/Patient';

const router = express.Router();

// GET /analytics/summary
router.get('/summary', async (req, res, next) => {
  try {
    const totalSubmissions = await SubmissionModel.countDocuments({ status: 'complete', isDeleted: false });
    const totalPatients = await PatientModel.countDocuments({ isDeleted: false });
    
    // Aggregation for Average Global QoL
    const avgQolResult = await SubmissionModel.aggregate([
      { $match: { status: 'complete', isDeleted: false, 'scores.globalHealth': { $exists: true } } },
      { $group: { _id: null, avgQol: { $avg: '$scores.globalHealth' } } }
    ]);
    
    const avgGlobalQol = avgQolResult.length > 0 ? Math.round(avgQolResult[0].avgQol * 10) / 10 : 0;

    // Submissions this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const thisMonth = await SubmissionModel.countDocuments({ 
      status: 'complete', 
      isDeleted: false, 
      visitDate: { $gte: startOfMonth } 
    });

    const pendingReview = await SubmissionModel.countDocuments({ status: 'draft', isDeleted: false });

    res.json({
      totalSubmissions,
      totalPatients,
      avgGlobalQol,
      thisMonth,
      pendingReview
    });
  } catch (error) {
    next(error);
  }
});

// Implement trends and symptoms in next iteration if needed
// GET /analytics/trends
router.get('/trends', async (req, res, next) => {
  try {
    // Simple mock for now
    res.json({ data: [] });
  } catch (error) {
    next(error);
  }
});

export default router;
