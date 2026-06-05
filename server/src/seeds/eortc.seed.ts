import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { FormTemplateModel, FormQuestionModel } from '../models/FormTemplate';

dotenv.config();

const questionsData = [
  // Physical Functioning
  { qId: 'Q1', text: 'Do you have any trouble doing strenuous activities, like carrying a heavy shopping bag or a suitcase?', group: 'Physical Functioning', type: 'radio' },
  { qId: 'Q2', text: 'Do you have any trouble taking a long walk?', group: 'Physical Functioning', type: 'radio' },
  { qId: 'Q3', text: 'Do you have any trouble taking a short walk outside of the house?', group: 'Physical Functioning', type: 'radio' },
  { qId: 'Q4', text: 'Do you need to stay in bed or a chair during the day?', group: 'Physical Functioning', type: 'radio' },
  { qId: 'Q5', text: 'Do you need help with eating, dressing, washing yourself or using the toilet?', group: 'Physical Functioning', type: 'radio' },
  // Role Functioning
  { qId: 'Q6', text: 'Were you limited in doing either your work or other daily activities?', group: 'Role Functioning', type: 'radio' },
  { qId: 'Q7', text: 'Were you limited in pursuing your hobbies or other leisure time activities?', group: 'Role Functioning', type: 'radio' },
  // Dyspnoea
  { qId: 'Q8', text: 'Were you short of breath?', group: 'Dyspnoea', type: 'radio' },
  // Pain
  { qId: 'Q9', text: 'Have you had pain?', group: 'Pain', type: 'radio' },
  // Fatigue
  { qId: 'Q10', text: 'Did you need to rest?', group: 'Fatigue', type: 'radio' },
  // Insomnia
  { qId: 'Q11', text: 'Have you had trouble sleeping?', group: 'Insomnia', type: 'radio' },
  // Fatigue
  { qId: 'Q12', text: 'Have you felt weak?', group: 'Fatigue', type: 'radio' },
  // Appetite Loss
  { qId: 'Q13', text: 'Have you lacked appetite?', group: 'Appetite Loss', type: 'radio' },
  // Nausea & Vomiting
  { qId: 'Q14', text: 'Have you felt nauseated?', group: 'Nausea & Vomiting', type: 'radio' },
  { qId: 'Q15', text: 'Have you vomited?', group: 'Nausea & Vomiting', type: 'radio' },
  // Constipation
  { qId: 'Q16', text: 'Have you been constipated?', group: 'Constipation', type: 'radio' },
  // Diarrhoea
  { qId: 'Q17', text: 'Have you had diarrhoea?', group: 'Diarrhoea', type: 'radio' },
  // Fatigue
  { qId: 'Q18', text: 'Were you tired?', group: 'Fatigue', type: 'radio' },
  // Pain
  { qId: 'Q19', text: 'Did pain interfere with your daily activities?', group: 'Pain', type: 'radio' },
  // Cognitive Functioning
  { qId: 'Q20', text: 'Have you had difficulty in concentrating on things, like reading a newspaper or watching television?', group: 'Cognitive Functioning', type: 'radio' },
  // Emotional Functioning
  { qId: 'Q21', text: 'Did you feel tense?', group: 'Emotional Functioning', type: 'radio' },
  { qId: 'Q22', text: 'Did you worry?', group: 'Emotional Functioning', type: 'radio' },
  { qId: 'Q23', text: 'Did you feel irritable?', group: 'Emotional Functioning', type: 'radio' },
  { qId: 'Q24', text: 'Did you feel depressed?', group: 'Emotional Functioning', type: 'radio' },
  // Cognitive Functioning
  { qId: 'Q25', text: 'Have you had difficulty remembering things?', group: 'Cognitive Functioning', type: 'radio' },
  // Social Functioning
  { qId: 'Q26', text: 'Has your physical condition or medical treatment interfered with your family life?', group: 'Social Functioning', type: 'radio' },
  { qId: 'Q27', text: 'Has your physical condition or medical treatment interfered with your social activities?', group: 'Social Functioning', type: 'radio' },
  // Financial Impact
  { qId: 'Q28', text: 'Has your physical condition or medical treatment caused you financial difficulties?', group: 'Financial Impact', type: 'radio' },
  // Global Health Status
  { qId: 'Q29', text: 'How would you rate your overall health during the past week?', group: 'Global Health Status', type: 'scale' },
  { qId: 'Q30', text: 'How would you rate your overall quality of life during the past week?', group: 'Global Health Status', type: 'scale' }
];

const seed = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/medformpro';
  await mongoose.connect(uri);

  console.log('Connected to MongoDB. Clearing existing templates...');
  await FormTemplateModel.deleteMany({});
  await FormQuestionModel.deleteMany({});

  console.log('Creating EORTC QLQ-C30 Template...');
  const template = await FormTemplateModel.create({
    templateId: 'EORTC-QLQ-C30-V3',
    name: 'EORTC QLQ-C30 (Version 3.0)',
    version: '3.0',
    description: 'European Organisation for Research and Treatment of Cancer Quality of Life Questionnaire',
    scoringAlgorithm: 'EORTC_QLQ_C30_V3',
    sections: [
      { sectionId: 'S1', title: 'Functional Scales (Q1-Q7)', order: 1, questions: [] },
      { sectionId: 'S2', title: 'Symptom Scales (Q8-Q19)', order: 2, questions: [] },
      { sectionId: 'S3', title: 'Emotional & Cognitive (Q20-Q25)', order: 3, questions: [] },
      { sectionId: 'S4', title: 'Social & Financial (Q26-Q28)', order: 4, questions: [] },
      { sectionId: 'S5', title: 'Global Health (Q29-Q30)', order: 5, questions: [] },
    ]
  });

  const getSectionId = (qNumber: number) => {
    if (qNumber <= 7) return 'S1';
    if (qNumber <= 19) return 'S2';
    if (qNumber <= 25) return 'S3';
    if (qNumber <= 28) return 'S4';
    return 'S5';
  };

  const likertOptions = [
    { value: 1, label: 'Not at All' },
    { value: 2, label: 'A Little' },
    { value: 3, label: 'Quite a Bit' },
    { value: 4, label: 'Very Much' },
  ];

  for (let i = 0; i < questionsData.length; i++) {
    const qData = questionsData[i];
    const qNumber = i + 1;
    const isScale = qData.type === 'scale';
    
    const question = await FormQuestionModel.create({
      questionId: qData.qId,
      template: template._id,
      text: qData.text,
      type: qData.type,
      order: qNumber,
      scaleGroup: qData.group,
      options: isScale ? undefined : likertOptions,
      min: isScale ? 1 : undefined,
      max: isScale ? 7 : undefined,
    });

    const sectionId = getSectionId(qNumber);
    const sectionIndex = template.sections.findIndex(s => s.sectionId === sectionId);
    if (sectionIndex > -1) {
      template.sections[sectionIndex].questions.push(question._id as any);
    }
  }

  await template.save();

  console.log('Seed completed successfully!');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
