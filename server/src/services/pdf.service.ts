import PDFDocument from 'pdfkit';
import { SubmissionDocument } from '../models/Submission';
import { PatientDocument } from '../models/Patient';
import { FormTemplateDocument } from '../models/FormTemplate';

export const generateSubmissionPDF = (
  submission: SubmissionDocument,
  patient: PatientDocument,
  template: FormTemplateDocument,
  dataCallback: (chunk: any) => void,
  endCallback: () => void
) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  
  doc.on('data', dataCallback);
  doc.on('end', endCallback);

  const clinicName = process.env.CLINIC_NAME || 'MedForm Pro Clinic';

  // --- HEADER ---
  doc.fontSize(20).text(clinicName, { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Patient Assessment Report: ${template.name}`, { align: 'center' });
  doc.moveDown(2);

  // --- PATIENT INFO ---
  doc.fontSize(12).font('Helvetica-Bold').text('Patient Information');
  doc.font('Helvetica').fontSize(10);
  doc.text(`Name: ${(patient.name?.first || '') + ' ' + (patient.name?.last || '')}`.trim() || patient.initials || 'N/A');
  doc.text(`Patient ID: ${patient.patientId}`);
  doc.text(`DOB: ${patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}`);
  doc.text(`Gender: ${patient.gender || 'N/A'}`);
  doc.moveDown();
  
  doc.text(`Submission ID: ${submission.submissionId}`);
  doc.text(`Visit Date: ${new Date(submission.visitDate).toLocaleDateString()}`);
  doc.text(`Completed At: ${new Date(submission.createdAt).toLocaleString()}`);
  doc.moveDown(2);

  // --- SCORES SUMMARY ---
  doc.fontSize(12).font('Helvetica-Bold').text('EORTC QLQ-C30 Score Summary');
  doc.moveDown(0.5);
  doc.font('Helvetica').fontSize(10);

  const renderScoreRow = (label: string, score: number | undefined) => {
    if (score === undefined) return;
    doc.text(`${label}:`, { continued: true });
    doc.text(` ${score.toFixed(1)} / 100`, { align: 'right' });
  };

  const scores = submission.scores;
  if (scores) {
    doc.font('Helvetica-Bold').text('Global Health Status');
    doc.font('Helvetica');
    renderScoreRow('Global Health / QoL', scores.globalHealth);
    doc.moveDown();

    doc.font('Helvetica-Bold').text('Functional Scales (Higher is better)');
    doc.font('Helvetica');
    renderScoreRow('Physical Functioning', scores.physicalFunctioning);
    renderScoreRow('Role Functioning', scores.roleFunctioning);
    renderScoreRow('Emotional Functioning', scores.emotionalFunctioning);
    renderScoreRow('Cognitive Functioning', scores.cognitiveFunctioning);
    renderScoreRow('Social Functioning', scores.socialFunctioning);
    doc.moveDown();

    doc.font('Helvetica-Bold').text('Symptom Scales (Higher is worse)');
    doc.font('Helvetica');
    renderScoreRow('Fatigue', scores.fatigue);
    renderScoreRow('Nausea and Vomiting', scores.nauseaVomiting);
    renderScoreRow('Pain', scores.pain);
    renderScoreRow('Dyspnoea', scores.dyspnoea);
    renderScoreRow('Insomnia', scores.insomnia);
    renderScoreRow('Appetite Loss', scores.appetiteLoss);
    renderScoreRow('Constipation', scores.constipation);
    renderScoreRow('Diarrhoea', scores.diarrhoea);
    renderScoreRow('Financial Impact', scores.financialImpact);
  }

  doc.addPage();

  // --- FULL RESPONSES ---
  doc.fontSize(12).font('Helvetica-Bold').text('Detailed Responses');
  doc.moveDown();
  doc.font('Helvetica').fontSize(10);

  // Map questions for easier lookup
  const questionMap = new Map();
  template.sections.forEach(section => {
    // Populate map (requires population of questions in the route)
    // We will assume the route populates `template` fully including questions
    (section as any).questions.forEach((q: any) => {
      questionMap.set(q.questionId, q);
    });
  });

  submission.responses.forEach((response: any) => {
    const q = questionMap.get(response.questionId);
    if (q) {
      doc.font('Helvetica-Bold').text(`${q.questionId}: ${q.text}`);
      
      let answerLabel = String(response.value);
      if (q.options) {
        const option = q.options.find((o: any) => o.value === response.value);
        if (option) answerLabel = `${option.value} - ${option.label}`;
      }
      
      doc.font('Helvetica').text(`Answer: ${answerLabel}`);
      doc.moveDown(0.5);
    }
  });

  doc.end();
};
