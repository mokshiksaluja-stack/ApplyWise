import { useState } from 'react';
import { generateAIInsightsApi } from '../../services/api';
import {
  Sparkles, Loader2, AlertCircle, ChevronDown, ChevronUp,
  CheckCircle2, Clock, FileText, Building2, BookOpen, ArrowRight,
  Lightbulb, Target, WifiOff, ShieldAlert, ClipboardList,
  TrendingUp, CalendarDays, UserCheck
} from 'lucide-react';

// ─── Shared sub-components ────────────────────────────────────────────────

const InsightSection = ({ icon: Icon, title, color, children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 p-5 shadow-sm ${className}`}>
    <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
      <Icon size={16} className={color} />
      {title}
    </h3>
    {children}
  </div>
);

const PillList = ({ items, pillClass }) => (
  <div className="flex flex-wrap gap-2">
    {items.filter(Boolean).map((item, i) => (
      <span key={i} className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${pillClass}`}>
        {item}
      </span>
    ))}
  </div>
);

const NumberedList = ({ items, accentClass }) => (
  <ul className="space-y-2.5">
    {items.filter(Boolean).map((item, i) => (
      <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white mt-0.5 ${accentClass}`}>
          {i + 1}
        </span>
        {item}
      </li>
    ))}
  </ul>
);

const BulletList = ({ items, icon: Icon = ArrowRight, iconClass = 'text-violet-500' }) => (
  <ul className="space-y-2">
    {items.filter(Boolean).map((item, i) => (
      <li key={i} className="flex gap-2.5 text-sm text-gray-700 leading-relaxed">
        <Icon size={14} className={`${iconClass} shrink-0 mt-0.5`} />
        {item}
      </li>
    ))}
  </ul>
);

// ─── Section: Critical Gaps (triaged) ─────────────────────────────────────
const GapsSection = ({ criticalGaps }) => {
  const { critical = [], moderate = [], minor = [] } = criticalGaps || {};
  if (!critical.length && !moderate.length && !minor.length) return null;
  return (
    <InsightSection icon={Target} title="Critical Gaps — Prioritised" color="text-rose-500">
      <div className="space-y-3">
        {critical.length > 0 && (
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-rose-600 mb-1.5">🔴 Must Fix</p>
            <div className="flex flex-wrap gap-1.5">
              {critical.map((g, i) => (
                <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-full border bg-rose-50 text-rose-700 border-rose-200">{g}</span>
              ))}
            </div>
          </div>
        )}
        {moderate.length > 0 && (
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1.5">🟡 Should Improve</p>
            <div className="flex flex-wrap gap-1.5">
              {moderate.map((g, i) => (
                <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200">{g}</span>
              ))}
            </div>
          </div>
        )}
        {minor.length > 0 && (
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">⚪ Optional Polish</p>
            <div className="flex flex-wrap gap-1.5">
              {minor.map((g, i) => (
                <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-full border bg-gray-50 text-gray-600 border-gray-200">{g}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </InsightSection>
  );
};

// ─── Section: Resume Fixes (structured) ───────────────────────────────────
const ResumeFixes = ({ resumeFixes }) => {
  const { add = [], remove = [], rewrite = [], keywords = [] } = resumeFixes || {};
  const hasContent = add.length || remove.length || rewrite.length || keywords.length;
  if (!hasContent) return null;
  return (
    <InsightSection icon={FileText} title="Resume Fixes for This Role" color="text-blue-500">
      <div className="space-y-3">
        {add.length > 0 && (
          <div className="bg-green-50 rounded-xl p-3 border border-green-100">
            <p className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-1.5">➕ Add</p>
            <BulletList items={add} icon={ArrowRight} iconClass="text-green-500" />
          </div>
        )}
        {remove.length > 0 && (
          <div className="bg-red-50 rounded-xl p-3 border border-red-100">
            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1.5">➖ Remove</p>
            <BulletList items={remove} icon={ArrowRight} iconClass="text-red-400" />
          </div>
        )}
        {rewrite.length > 0 && (
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
            <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-1.5">✏️ Rewrite</p>
            <BulletList items={rewrite} icon={ArrowRight} iconClass="text-blue-400" />
          </div>
        )}
        {keywords.length > 0 && (
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">🏷 Keywords to Include</p>
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((k, i) => (
                <span key={i} className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">{k}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </InsightSection>
  );
};

// ─── Section: Interview Focus ──────────────────────────────────────────────
const InterviewFocusSection = ({ interviewFocus }) => {
  const { topics = [], rounds = [], focus = [] } = interviewFocus || {};
  if (!topics.length && !rounds.length && !focus.length) return null;
  return (
    <InsightSection icon={BookOpen} title="Likely Interview Focus Areas" color="text-teal-500">
      <div className="space-y-4">
        {rounds.length > 0 && (
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Predicted Rounds</p>
            <NumberedList items={rounds} accentClass="bg-teal-500" />
          </div>
        )}
        {topics.length > 0 && (
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Technical Topics</p>
            <PillList items={topics} pillClass="bg-teal-50 text-teal-700 border-teal-200" />
          </div>
        )}
        {focus.length > 0 && (
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">What They'll Probe Hardest</p>
            <BulletList items={focus} icon={ArrowRight} iconClass="text-teal-500" />
          </div>
        )}
      </div>
    </InsightSection>
  );
};

// ─── Section: Action Plan (sprint-style) ──────────────────────────────────
const ActionPlanSection = ({ actionPlan }) => {
  const { top3 = [], day3 = [], day7 = [], day14 = [] } = actionPlan || {};
  const [open, setOpen] = useState('top3');
  const tabs = [
    { id: 'top3',  label: 'Top 3 Now',  items: top3,  accent: 'bg-violet-600' },
    { id: 'day3',  label: '3-Day Plan', items: day3,  accent: 'bg-blue-500'   },
    { id: 'day7',  label: '7-Day Plan', items: day7,  accent: 'bg-indigo-500' },
    { id: 'day14', label: '14-Day Plan',items: day14, accent: 'bg-slate-600'  },
  ];
  return (
    <InsightSection icon={CalendarDays} title="Personalised Action Plan" color="text-violet-500">
      {/* Tab strip */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setOpen(t.id)}
            className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all ${
              open === t.id ? 'bg-violet-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map(t => open === t.id && t.items.length > 0 && (
        <div key={t.id} className="animate-in fade-in duration-200">
          <NumberedList items={t.items} accentClass={t.accent} />
        </div>
      ))}
    </InsightSection>
  );
};

// ─── Section: Pre-Apply Checklist ─────────────────────────────────────────
const ChecklistSection = ({ items }) => {
  const [checked, setChecked] = useState({});
  const toggle = (i) => setChecked(prev => ({ ...prev, [i]: !prev[i] }));
  if (!items?.length) return null;
  return (
    <InsightSection icon={ClipboardList} title="Do Before Applying — Checklist" color="text-emerald-500">
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li
            key={i}
            onClick={() => toggle(i)}
            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all ${
              checked[i] ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-100 hover:border-emerald-100 hover:bg-emerald-50/30'
            }`}
          >
            <div className={`mt-0.5 w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${
              checked[i] ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'
            }`}>
              {checked[i] && <span className="text-white text-[10px] font-black">✓</span>}
            </div>
            <span className={`text-sm font-medium leading-snug ${checked[i] ? 'text-emerald-800 line-through opacity-60' : 'text-gray-700'}`}>
              {item}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-[10px] text-gray-400 mt-3 text-center">
        {Object.values(checked).filter(Boolean).length} / {items.length} completed
      </p>
    </InsightSection>
  );
};

// ─── Main component ────────────────────────────────────────────────────────
export default function AIInsightsPanel({ job, profile, evaluation }) {
  const [status,     setStatus]     = useState('idle');
  const [insights,   setInsights]   = useState(null);
  const [isFallback, setIsFallback] = useState(false);
  const [errorMsg,   setErrorMsg]   = useState('');
  const [expanded,   setExpanded]   = useState(true);

  const handleGenerate = async () => {
    setStatus('loading');
    setInsights(null);
    setErrorMsg('');
    setIsFallback(false);

    try {
      const payload = {
        studentName:       profile?.name || profile?.fullName,
        branch:            profile?.branch,
        cgpa:              profile?.cgpa,
        degree:            profile?.degree,
        skills:            profile?.skills            || [],
        certifications:    profile?.certifications    || [],
        projects:          profile?.projects?.length  ?? 0,
        company:           job?.company,
        role:              job?.role,
        description:       job?.description,
        eligibilityStatus: evaluation?.status         || 'Unknown',
        readinessScore:    evaluation?.readinessScore ?? 0,
        matchedSkills:     evaluation?.matchedSkills  || [],
        missingSkills:     evaluation?.missingSkills  || [],
      };

      const { data } = await generateAIInsightsApi(payload);
      setInsights(data.insights);
      setIsFallback(data.isFallback === true);
      setStatus('success');
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
        'Network error — could not reach the server. Please try again.'
      );
      setStatus('error');
    }
  };

  // ── Idle ──────────────────────────────────────────────────────────────
  if (status === 'idle') {
    return (
      <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 rounded-2xl border border-violet-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25 shrink-0">
              <Sparkles size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900 mb-0.5">AI Career Assistant</h2>
              <p className="text-sm text-gray-500 font-medium leading-snug">
                Get a personalised mentor report — fit summary, gap analysis, action plan, and more.
              </p>
            </div>
          </div>
          <button
            id="generate-ai-insights-btn"
            onClick={handleGenerate}
            className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 hover:scale-[1.02] active:scale-100 transition-all duration-200"
          >
            <Sparkles size={16} />
            Generate AI Insights
          </button>
        </div>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 rounded-2xl border border-violet-200 p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center gap-4 py-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Loader2 size={26} className="text-white animate-spin" />
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 opacity-20 animate-ping" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-800">Generating your mentor report…</p>
            <p className="text-xs text-gray-500 mt-1">Gemini is analysing your profile against this role</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error (network-only; API errors come back as fallback, not error state) ─
  if (status === 'error') {
    return (
      <div className="bg-red-50 rounded-2xl border border-red-200 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <AlertCircle size={20} className="text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-red-900 mb-1">Could Not Reach Server</h3>
            <p className="text-sm text-red-700">{errorMsg}</p>
          </div>
          <button
            onClick={handleGenerate}
            className="shrink-0 text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Success ────────────────────────────────────────────────────────────
  return (
    <div className="rounded-2xl border border-violet-200 shadow-sm overflow-hidden">
      {/* Panel header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white tracking-tight">AI Career Mentor Report</h2>
            <p className="text-[11px] text-violet-200 font-medium">
              {isFallback ? 'System-generated guidance' : 'Powered by Google Gemini'} · For guidance only
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerate}
            className="text-[10px] font-black text-violet-200 hover:text-white uppercase tracking-widest transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
          >
            Regenerate
          </button>
          <button
            onClick={() => setExpanded(v => !v)}
            className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
          >
            {expanded ? <ChevronUp size={16} className="text-white" /> : <ChevronDown size={16} className="text-white" />}
          </button>
        </div>
      </div>

      {/* Ribbon — fallback warning OR live disclaimer */}
      {isFallback ? (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center gap-2">
          <WifiOff size={13} className="text-amber-600 shrink-0" />
          <p className="text-[11px] text-amber-800 font-semibold">
            AI service temporarily unavailable — showing system-generated guidance based on your profile.
          </p>
        </div>
      ) : (
        <div className="bg-violet-50 border-b border-violet-100 px-6 py-2 flex items-center gap-2">
          <AlertCircle size={12} className="text-violet-500 shrink-0" />
          <p className="text-[11px] text-violet-700 font-semibold">
            AI insights are for guidance only. Eligibility is determined solely by the system's engine.
          </p>
        </div>
      )}

      {/* Collapsible content */}
      {expanded && (
        <div className="bg-gray-50 p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">

          {/* 1. Fit Summary */}
          {insights.fitSummary && (
            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl border border-violet-100 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={15} className="text-violet-500" />
                <span className="text-xs font-black text-violet-700 uppercase tracking-widest">Fit Summary</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">{insights.fitSummary}</p>
            </div>
          )}

          {/* 2. Why You Match + Rejection Risks (side by side on lg) */}
          <div className="grid lg:grid-cols-2 gap-4">
            {insights.whyYouMatch?.length > 0 && (
              <InsightSection icon={CheckCircle2} title="Why You Match This Role" color="text-emerald-500">
                <BulletList items={insights.whyYouMatch} icon={CheckCircle2} iconClass="text-emerald-400" />
              </InsightSection>
            )}
            {insights.rejectionRisks?.length > 0 && (
              <InsightSection icon={ShieldAlert} title="Main Rejection Risks" color="text-orange-500">
                <BulletList items={insights.rejectionRisks} icon={ShieldAlert} iconClass="text-orange-400" />
              </InsightSection>
            )}
          </div>

          {/* 3. Critical Gaps */}
          <GapsSection criticalGaps={insights.criticalGaps} />

          {/* 4. Prep Time Estimates */}
          {insights.prepTimeEstimate?.length > 0 && (
            <InsightSection icon={Clock} title="Estimated Time to Improve" color="text-amber-500">
              <div className="grid sm:grid-cols-2 gap-2">
                {insights.prepTimeEstimate.map((entry, i) => {
                  const [skill, time] = entry.split('→').map(s => s.trim());
                  return (
                    <div key={i} className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5">
                      <span className="text-xs font-bold text-gray-700 truncate mr-2">{skill || entry}</span>
                      {time && <span className="text-xs font-black text-amber-700 shrink-0 bg-amber-100 px-2 py-0.5 rounded-lg">{time}</span>}
                    </div>
                  );
                })}
              </div>
            </InsightSection>
          )}

          {/* 5. Resume Fixes */}
          <ResumeFixes resumeFixes={insights.resumeFixes} />

          {/* 6. Interview Focus */}
          <InterviewFocusSection interviewFocus={insights.interviewFocus} />

          {/* 7. Company-Specific Advice */}
          {insights.companySpecificAdvice?.length > 0 && (
            <InsightSection icon={Building2} title={`${job?.company} — Company-Specific Advice`} color="text-indigo-500">
              <BulletList items={insights.companySpecificAdvice} icon={ArrowRight} iconClass="text-indigo-400" />
            </InsightSection>
          )}

          {/* 8. Action Plan */}
          {insights.actionPlan && <ActionPlanSection actionPlan={insights.actionPlan} />}

          {/* 9. Pre-Apply Checklist */}
          <ChecklistSection items={insights.preApplyChecklist} />

        </div>
      )}
    </div>
  );
}
