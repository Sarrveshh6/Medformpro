import express from 'express';
import { FormTemplateModel, FormQuestionModel } from '../models/FormTemplate';

const router = express.Router();

// GET /templates
router.get('/', async (req, res, next) => {
  try {
    const templates = await FormTemplateModel.find({ isActive: true }).select('templateId name version description');
    res.json(templates);
  } catch (error) {
    next(error);
  }
});

// GET /templates/:templateId
router.get('/:templateId', async (req, res, next) => {
  try {
    const template = await FormTemplateModel.findOne({ templateId: req.params.templateId })
      .populate({
        path: 'sections.questions',
        model: FormQuestionModel,
      });

    if (!template) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Template not found', statusCode: 404 } });
    }
    
    res.json(template);
  } catch (error) {
    next(error);
  }
});

export default router;
