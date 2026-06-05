import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Download, ChevronLeft, ChevronRight, Eye, X, Calendar, User, ShieldAlert, FileText } from 'lucide-react';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  const { data: summary } = useQuery<any>({
    queryKey: ['analytics-summary'],
    queryFn: () => api.get('/analytics/summary')
  });

  const { data: submissionsData, isLoading } = useQuery<any>({
    queryKey: ['submissions', page, searchTerm],
    queryFn: () => api.get(`/submissions?page=${page}&limit=10${searchTerm ? `&patientId=${searchTerm}` : ''}`)
  });

  // Fetch patient history when a submission is selected
  const { data: historyData } = useQuery<any>({
    queryKey: ['patient-history', selectedSubmission?.patientId],
    queryFn: () => api.get(`/submissions?patientId=${selectedSubmission.patientId}&limit=50`),
    enabled: !!selectedSubmission?.patientId,
  });

  const { data: fullSubmissionDetails, isLoading: isDetailsLoading } = useQuery<any>({
    queryKey: ['submission-details', selectedSubmission?.submissionId],
    queryFn: () => api.get(`/submissions/${selectedSubmission.submissionId}`),
    enabled: !!selectedSubmission?.submissionId,
  });

  const handleExportJSON = async () => {
    try {
      const response = await api.get('/submissions?limit=10000');
      const data = response.data || response;
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href",     dataStr);
      downloadAnchor.setAttribute("download", `medformpro_export_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      alert('Failed to export JSON data');
    }
  };

  const handleDownloadPDF = async (submissionId: string) => {
    try {
      const blob = await api.get(`/submissions/${submissionId}/pdf`, { responseType: 'blob' }) as unknown as Blob;
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      alert('Failed to download PDF. Ensure clinic API key is valid.');
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get('/submissions?limit=10000');
      const submissions = response.data || response;
      
      const questionHeaders = Array.from({ length: 30 }, (_, i) => `Q${i + 1}`);

      const headers = [
        'Submission ID',
        'Patient ID',
        'Patient Initials',
        'Patient DOB',
        'Visit Date',
        'Status',
        ...questionHeaders
      ];
      
      const rows = submissions.map((sub: any) => {
        const row = [
          sub.submissionId,
          sub.patientId,
          sub.patient?.initials || '',
          sub.patient?.dateOfBirth ? new Date(sub.patient.dateOfBirth).toLocaleDateString() : '',
          new Date(sub.visitDate).toLocaleDateString(),
          sub.status
        ];

        const responses = sub.responses || [];
        for (let i = 1; i <= 30; i++) {
          const answer = responses.find((r: any) => r.questionId === `Q${i}`);
          row.push(answer?.value ?? '');
        }

        return row;
      });
      
      const csvContent = [
        headers.join(','),
        ...rows.map((e: any) => e.map((val: any) => `"${String(val).replace(/"/g, '""')}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", url);
      downloadAnchor.setAttribute("download", `medformpro_export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      alert('Failed to export CSV data');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Clinical Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor patient quality-of-life assessments and history.</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white shadow-sm p-6">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Submissions</p>
          <div className="text-2xl font-bold">{summary?.totalSubmissions || 0}</div>
        </div>
        <div className="rounded-xl border bg-white shadow-sm p-6">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Patients</p>
          <div className="text-2xl font-bold text-indigo-600">{summary?.totalPatients || 0}</div>
        </div>
        <div className="rounded-xl border bg-white shadow-sm p-6">
          <p className="text-sm font-medium text-slate-500 mb-1">Avg Global QoL</p>
          <div className="text-2xl font-bold text-primary">{summary?.avgGlobalQol || 0} / 100</div>
        </div>
        <div className="rounded-xl border bg-white shadow-sm p-6">
          <p className="text-sm font-medium text-slate-500 mb-1">Pending Review</p>
          <div className="text-2xl font-bold text-amber-500">{summary?.pendingReview || 0}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search patient ID..." 
            className="w-full pl-9 pr-4 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-2 border rounded-md text-xs font-semibold hover:bg-slate-50 text-slate-700 bg-white"
          >
            <Download size={14} /> Export CSV
          </button>
          <button 
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-3 py-2 border rounded-md text-xs font-semibold hover:bg-slate-50 text-slate-700 bg-white"
          >
            <Download size={14} /> Export JSON
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
              <tr>
                <th className="px-6 py-4">Submission ID</th>
                <th className="px-6 py-4">Patient Initials</th>
                <th className="px-6 py-4">Patient ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Global QoL</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
              ) : (submissionsData?.data || []).length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-500">No submissions found.</td></tr>
              ) : (
                (submissionsData?.data || []).map((sub: any) => (
                  <tr key={sub.submissionId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-primary">{sub.submissionId}</td>
                    <td className="px-6 py-4 uppercase font-mono font-bold tracking-wider">{sub.patient?.initials || 'N/A'}</td>
                    <td className="px-6 py-4 font-medium text-slate-600">{sub.patientId}</td>
                    <td className="px-6 py-4">{new Date(sub.visitDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        sub.status === 'complete' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold">{sub.scores?.globalHealth ?? '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setSelectedSubmission(sub)}
                          className="p-1.5 text-slate-400 hover:text-primary rounded-md hover:bg-slate-100 transition-colors"
                        >
                          <Eye size={18} />
                        </button>
                        {sub.status === 'complete' && (
                          <button 
                            className="p-1.5 text-slate-400 hover:text-primary rounded-md hover:bg-slate-100 transition-colors"
                            onClick={() => handleDownloadPDF(sub.submissionId)}
                          >
                            <Download size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t flex items-center justify-between text-sm text-slate-500">
          <div>Showing {(submissionsData?.data || []).length} of {submissionsData?.total || 0} results</div>
          <div className="flex gap-2">
            <button 
              className="p-1.5 border rounded disabled:opacity-50"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              className="p-1.5 border rounded disabled:opacity-50"
              onClick={() => setPage(p => p + 1)}
              disabled={!submissionsData || (submissionsData.data || []).length < 10}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-out Drawer for Patient Details & History */}
      {selectedSubmission && (
        <div className="fixed inset-0 overflow-hidden z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-slide-in">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Patient File: {selectedSubmission.patientId}</h2>
                <p className="text-xs text-slate-500 mt-0.5">Submission Ref: {selectedSubmission.submissionId}</p>
              </div>
              <button 
                onClick={() => setSelectedSubmission(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Demographics Card */}
              <div className="border border-slate-100 rounded-xl p-5 bg-slate-50/50 space-y-4">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <User size={16} /> Patient Demographics
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-xs text-slate-400 font-medium">Initials</span>
                    <span className="font-bold text-slate-800 uppercase tracking-widest">{selectedSubmission.patient?.initials || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 font-medium">Birthdate</span>
                    <span className="font-semibold text-slate-800">
                      {selectedSubmission.patient?.dateOfBirth ? new Date(selectedSubmission.patient.dateOfBirth).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 font-medium">Patient ID</span>
                    <span className="font-mono text-slate-700">{selectedSubmission.patientId}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 font-medium">Last Assessment</span>
                    <span className="font-semibold text-slate-800">{new Date(selectedSubmission.visitDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Scores Card */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                  EORTC QLQ-C30 Scale Scores
                </h3>
                
                {selectedSubmission.scores ? (
                  <div className="grid grid-cols-2 gap-3">
                    {/* Global QoL */}
                    <div className="col-span-2 bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Global Health Status / QoL</span>
                        <span className="block text-2xl font-black text-indigo-900 mt-1">{selectedSubmission.scores.globalHealth} / 100</span>
                      </div>
                      <div className="w-24 bg-indigo-200 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full" style={{ width: `${selectedSubmission.scores.globalHealth}%` }}></div>
                      </div>
                    </div>

                    {/* Functional Scales */}
                    <div className="border border-slate-100 rounded-lg p-4 space-y-3 bg-white">
                      <span className="text-xs font-bold text-green-700 uppercase tracking-wider block border-b pb-1">Functional Scales (Higher = Better)</span>
                      
                      <div className="space-y-2 text-xs">
                        <div>
                          <div className="flex justify-between font-semibold mb-0.5">
                            <span>Physical</span>
                            <span>{selectedSubmission.scores.physicalFunctioning}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full" style={{ width: `${selectedSubmission.scores.physicalFunctioning}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between font-semibold mb-0.5">
                            <span>Role</span>
                            <span>{selectedSubmission.scores.roleFunctioning}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full" style={{ width: `${selectedSubmission.scores.roleFunctioning}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between font-semibold mb-0.5">
                            <span>Emotional</span>
                            <span>{selectedSubmission.scores.emotionalFunctioning}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full" style={{ width: `${selectedSubmission.scores.emotionalFunctioning}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Symptom Scales */}
                    <div className="border border-slate-100 rounded-lg p-4 space-y-3 bg-white">
                      <span className="text-xs font-bold text-red-700 uppercase tracking-wider block border-b pb-1">Main Symptom Scales (Lower = Better)</span>
                      
                      <div className="space-y-2 text-xs">
                        <div>
                          <div className="flex justify-between font-semibold mb-0.5">
                            <span>Fatigue</span>
                            <span>{selectedSubmission.scores.fatigue}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-red-500 h-full" style={{ width: `${selectedSubmission.scores.fatigue}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between font-semibold mb-0.5">
                            <span>Pain</span>
                            <span>{selectedSubmission.scores.pain}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-red-500 h-full" style={{ width: `${selectedSubmission.scores.pain}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between font-semibold mb-0.5">
                            <span>Nausea</span>
                            <span>{selectedSubmission.scores.nauseaVomiting}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-red-500 h-full" style={{ width: `${selectedSubmission.scores.nauseaVomiting}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 border rounded-lg flex items-center justify-center gap-2">
                    <ShieldAlert size={16} /> Scores unavailable or form incomplete
                  </div>
                )}
              </div>

              {/* Raw Form Responses */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <FileText size={16} /> Detailed Form Responses
                </h3>
                {isDetailsLoading ? (
                  <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 border rounded-lg">Loading details...</div>
                ) : fullSubmissionDetails ? (
                  <div className="border border-slate-100 rounded-lg p-4 bg-white space-y-4 max-h-96 overflow-y-auto">
                    {fullSubmissionDetails.template?.sections?.map((section: any) => (
                      <div key={section.sectionId} className="space-y-2">
                        <h4 className="font-bold text-slate-800 text-sm border-b pb-1">{section.title}</h4>
                        <div className="space-y-3">
                          {section.questions.map((q: any) => {
                            const response = fullSubmissionDetails.responses.find((r: any) => r.questionId === q.questionId);
                            let answerLabel = String(response?.value ?? 'Unanswered');
                            if (q.options && response?.value !== undefined) {
                              const opt = q.options.find((o: any) => o.value === response.value);
                              if (opt) answerLabel = `${opt.value} - ${opt.label}`;
                            }
                            return (
                              <div key={q.questionId} className="text-xs">
                                <div className="font-medium text-slate-700 mb-0.5">{q.questionId}: {q.text}</div>
                                <div className="text-indigo-600 font-semibold">{answerLabel}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 border rounded-lg">Details unavailable</div>
                )}
              </div>

              {/* Longitudinal History Table */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Calendar size={16} /> Longitudinal Tracking (Past Visits)
                </h3>
                
                <div className="border rounded-lg overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                      <tr>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Global QoL</th>
                        <th className="px-4 py-2">Fatigue</th>
                        <th className="px-4 py-2">Pain</th>
                        <th className="px-4 py-2 text-right">PDF</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(historyData || []).map((pastSub: any) => (
                        <tr key={pastSub.submissionId} className={pastSub.submissionId === selectedSubmission.submissionId ? 'bg-indigo-50/30' : ''}>
                          <td className="px-4 py-2 font-medium">{new Date(pastSub.visitDate).toLocaleDateString()}</td>
                          <td className="px-4 py-2 font-bold">{pastSub.scores?.globalHealth ?? '-'}</td>
                          <td className="px-4 py-2 text-red-600 font-semibold">{pastSub.scores?.fatigue ?? '-'}</td>
                          <td className="px-4 py-2 text-red-600 font-semibold">{pastSub.scores?.pain ?? '-'}</td>
                          <td className="px-4 py-2 text-right">
                            <button 
                              onClick={() => handleDownloadPDF(pastSub.submissionId)}
                              className="text-primary hover:underline font-semibold"
                            >
                              Get
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
