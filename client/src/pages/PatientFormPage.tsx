import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { FormTemplate } from 'shared';

export default function PatientFormPage() {
  const { templateId } = useParams();
  
  // State for responses
  const [patientInfo, setPatientInfo] = useState<any>({
    patientId: '',
    initials: '',
    dateOfBirth: '',
    visitDate: new Date().toISOString().slice(0, 10),
  });
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const { data: template, isLoading, error } = useQuery<FormTemplate>({
    queryKey: ['template', templateId],
    queryFn: () => api.get(`/templates/${templateId}`),
    enabled: !!templateId,
  });

  const submitMutation = useMutation({
    mutationFn: (data: any) => api.post('/submissions', data),
    onSuccess: (data: any) => {
      setSubmissionId(data.submissionId);
      setIsSubmitted(true);
      localStorage.removeItem(`mfp_draft_${templateId}`);
    },
    onError: (err) => {
      alert('Error submitting form. Please try again.');
      console.error(err);
    }
  });

  // Auto-save draft logic (mocked)
  useEffect(() => {
    if (!isSubmitted) {
      const draft = { patientInfo, responses };
      localStorage.setItem(`mfp_draft_${templateId}`, JSON.stringify(draft));
    }
  }, [patientInfo, responses, isSubmitted, templateId]);

  useEffect(() => {
    // Load draft on mount if available
    const savedDraft = localStorage.getItem(`mfp_draft_${templateId}`);
    if (savedDraft && !isSubmitted) {
      if (window.confirm("You have a saved draft. Would you like to resume it?")) {
        const draft = JSON.parse(savedDraft);
        setPatientInfo(draft.patientInfo);
        setResponses(draft.responses);
      } else {
        localStorage.removeItem(`mfp_draft_${templateId}`);
      }
    }
  }, [templateId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading form...</div>;
  if (error || !template) return <div className="p-8 text-center text-red-500">Error loading form template.</div>;

  const handleSubmit = () => {
    if (!patientInfo.initials || !patientInfo.dateOfBirth || !patientInfo.visitDate) {
      alert("Please fill in all patient information at the top of the form.");
      return;
    }

    const formattedResponses = Object.keys(responses).map(qId => ({
      questionId: qId,
      value: responses[qId]
    }));

    submitMutation.mutate({
      patientId: patientInfo.patientId || `PAT-${Date.now()}`,
      templateId: template.templateId,
      visitDate: patientInfo.visitDate,
      status: 'complete',
      responses: formattedResponses,
      patientInitials: patientInfo.initials,
      patientDob: patientInfo.dateOfBirth
    });
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-4xl">
          ✓
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Submission Complete</h2>
        <p className="text-slate-600">Thank you for completing the assessment.</p>
        <div className="bg-slate-50 border p-6 rounded-xl max-w-md mx-auto space-y-2 text-left">
          <p className="text-sm text-slate-500 font-medium">Your Submission ID is</p>
          <p className="text-xl font-mono font-bold text-primary">{submissionId}</p>
        </div>
        <button 
          onClick={() => {
            setIsSubmitted(false);
            setPatientInfo({ patientId: '', initials: '', dateOfBirth: '', visitDate: new Date().toISOString().slice(0, 10) });
            setResponses({});
          }}
          className="mt-8 px-6 py-2 border rounded-md font-medium hover:bg-slate-50 transition-colors"
        >
          Start New Form
        </button>
      </div>
    );
  }

  // Get all questions flattened
  const allQuestions = template.sections.flatMap(section => section.questions);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 text-slate-900">
      {/* Top Header Bar */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 font-sans">
          <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center font-bold">
            M
          </div>
          <span className="font-bold text-lg text-slate-800">MedForm Pro</span>
        </div>
        <Link 
          to="/admin/login" 
          className="font-sans text-xs bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2 px-4 rounded-lg shadow-sm border border-slate-200 transition-colors"
        >
          Admin Portal
        </Link>
      </div>

      <div className="border border-slate-300 bg-white p-8 md:p-12 shadow-sm font-serif">
        <h1 className="text-2xl font-bold mb-1 font-sans">EORTC QLQ-C30 (version 3)</h1>
        
        <p className="mb-8 text-[15px] leading-relaxed">
          We are interested in some things about you and your health. Please answer all of the questions yourself by selecting the option that best applies to you. There are no "right" or "wrong" answers. The information that you provide will remain strictly confidential.
        </p>

        <div className="space-y-3 mb-10 max-w-md">
          <div className="flex items-center">
            <label className="w-64 font-medium">Please fill in your initials:</label>
            <input 
              type="text" 
              className="border-b-2 border-slate-900 focus:outline-none w-32 text-center tracking-widest uppercase font-mono" 
              value={patientInfo.initials} 
              onChange={e => setPatientInfo({...patientInfo, initials: e.target.value})} 
            />
          </div>
          <div className="flex items-center">
            <label className="w-64 font-medium">Your birthdate (Day, Month, Year):</label>
            <input 
              type="date" 
              className="border-b-2 border-slate-900 focus:outline-none w-auto" 
              value={patientInfo.dateOfBirth} 
              onChange={e => setPatientInfo({...patientInfo, dateOfBirth: e.target.value})} 
            />
          </div>
          <div className="flex items-center">
            <label className="w-64 font-medium">Today's date (Day, Month, Year):</label>
            <input 
              type="date" 
              className="border-b-2 border-slate-900 focus:outline-none w-auto" 
              value={patientInfo.visitDate} 
              onChange={e => setPatientInfo({...patientInfo, visitDate: e.target.value})} 
            />
          </div>
          <div className="flex items-center pt-2">
            <label className="w-64 text-sm text-slate-500">Patient ID (Optional):</label>
            <input 
              type="text" 
              className="border-b border-slate-400 focus:outline-none w-auto text-sm" 
              value={patientInfo.patientId} 
              onChange={e => setPatientInfo({...patientInfo, patientId: e.target.value})} 
            />
          </div>
        </div>

        <div className="border-t border-slate-900 pt-6">
          <div className="space-y-4">
            {allQuestions.map((q: any, index: number) => {
              const qNumber = index + 1;
              const isPastWeekHeader = qNumber === 6 || qNumber === 17;
              const isOverallHeader = qNumber === 29;

              return (
                <div key={q.questionId}>
                  {isPastWeekHeader && (
                    <h2 className="text-lg font-bold mt-8 mb-4">During the past week:</h2>
                  )}
                  {isOverallHeader && (
                    <h2 className="text-lg font-bold mt-10 mb-4">For the following questions please select the number between 1 and 7 that best applies to you</h2>
                  )}
                  
                  <div className="flex flex-col md:flex-row md:items-start justify-between py-2 gap-4">
                    <div className="flex gap-3 flex-1">
                      <span className="w-6 text-right">{qNumber}.</span>
                      <span className="flex-1">{q.text}</span>
                    </div>
                    
                    <div className="md:w-64 pl-9 md:pl-0">
                      {q.type === 'radio' && (
                        <select
                          className="w-full border border-slate-300 rounded p-1.5 bg-white text-sm focus:ring-1 focus:ring-slate-900 outline-none"
                          value={responses[q.questionId] || ''}
                          onChange={(e) => setResponses({...responses, [q.questionId]: Number(e.target.value)})}
                        >
                          <option value="" disabled>Select an option...</option>
                          <option value="1">1 - Not at All</option>
                          <option value="2">2 - A Little</option>
                          <option value="3">3 - Quite a Bit</option>
                          <option value="4">4 - Very Much</option>
                        </select>
                      )}
                      
                      {q.type === 'scale' && (
                        <select
                          className="w-full border border-slate-300 rounded p-1.5 bg-white text-sm focus:ring-1 focus:ring-slate-900 outline-none"
                          value={responses[q.questionId] || ''}
                          onChange={(e) => setResponses({...responses, [q.questionId]: Number(e.target.value)})}
                        >
                          <option value="" disabled>Select an option...</option>
                          <option value="1">1 - Very poor</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7 - Excellent</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 flex justify-end">
          <button 
            onClick={handleSubmit} 
            disabled={submitMutation.isPending}
            className="bg-slate-900 text-white px-8 py-3 font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 font-sans"
          >
            {submitMutation.isPending ? 'Submitting...' : 'Submit Form'}
          </button>
        </div>
      </div>
    </div>
  );
}
