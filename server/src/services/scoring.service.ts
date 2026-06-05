import { ResponseItem, Scores } from 'shared';

// EORTC QLQ-C30 v3 Scoring Algorithm
// Ranges:
// Q1-Q28 (Functional and Symptom scales): 1 to 4
// Q29-Q30 (Global Health Status): 1 to 7

const getRawScore = (responses: ResponseItem[], questionIds: string[]): number | null => {
  const relevantResponses = responses.filter((r) => questionIds.includes(r.questionId) && typeof r.value === 'number');
  
  if (relevantResponses.length === 0) return null;
  
  // Rule: calculate score only if at least half of the items from the scale have been answered.
  if (relevantResponses.length < questionIds.length / 2) return null;

  const sum = relevantResponses.reduce((acc, curr) => acc + (curr.value as number), 0);
  return sum / relevantResponses.length;
};

export const calculateEortcScores = (responses: ResponseItem[]): Partial<Scores> => {
  const scores: Partial<Scores> = {};

  // Global Health Status / QoL (Q29, Q30) - Range: 6
  const ghRaw = getRawScore(responses, ['Q29', 'Q30']);
  if (ghRaw !== null) {
    scores.globalHealth = ((ghRaw - 1) / 6) * 100;
  }

  // Functional Scales (Higher score = better functioning)
  // Score = (1 - (RawScore - 1) / Range) * 100.  Range is 3 for Likert 1-4.
  const calculateFunctionalScore = (qIds: string[]) => {
    const raw = getRawScore(responses, qIds);
    if (raw === null) return undefined;
    return (1 - (raw - 1) / 3) * 100;
  };

  scores.physicalFunctioning = calculateFunctionalScore(['Q1', 'Q2', 'Q3', 'Q4', 'Q5']);
  scores.roleFunctioning = calculateFunctionalScore(['Q6', 'Q7']);
  scores.emotionalFunctioning = calculateFunctionalScore(['Q21', 'Q22', 'Q23', 'Q24']);
  scores.cognitiveFunctioning = calculateFunctionalScore(['Q20', 'Q25']);
  scores.socialFunctioning = calculateFunctionalScore(['Q26', 'Q27']);

  // Symptom Scales (Higher score = higher level of symptomatology/problems)
  // Score = ((RawScore - 1) / Range) * 100. Range is 3.
  const calculateSymptomScore = (qIds: string[]) => {
    const raw = getRawScore(responses, qIds);
    if (raw === null) return undefined;
    return ((raw - 1) / 3) * 100;
  };

  scores.fatigue = calculateSymptomScore(['Q10', 'Q12', 'Q18']);
  scores.nauseaVomiting = calculateSymptomScore(['Q14', 'Q15']);
  scores.pain = calculateSymptomScore(['Q9', 'Q19']);
  scores.dyspnoea = calculateSymptomScore(['Q8']);
  scores.insomnia = calculateSymptomScore(['Q11']);
  scores.appetiteLoss = calculateSymptomScore(['Q13']);
  scores.constipation = calculateSymptomScore(['Q16']);
  scores.diarrhoea = calculateSymptomScore(['Q17']);
  scores.financialImpact = calculateSymptomScore(['Q28']);

  // Round all scores to 1 decimal place
  for (const key in scores) {
    if (scores[key as keyof Scores] !== undefined) {
      scores[key as keyof Scores] = Math.round((scores[key as keyof Scores] as number) * 10) / 10;
    }
  }

  return scores;
};
