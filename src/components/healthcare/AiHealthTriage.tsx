import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  Stethoscope,
  ShieldAlert,
  CheckCircle2,
  PhoneCall,
  Calendar,
  RefreshCw,
  Copy,
  Check,
  Languages,
} from 'lucide-react';

interface TriageResult {
  urgency: 'low' | 'medium' | 'high';
  urgencyLabelEn: string;
  urgencyLabelHi: string;
  summaryEn: string;
  summaryHi: string;
  recommendationsEn: string[];
  recommendationsHi: string[];
  selfCareEn: string[];
  selfCareHi: string[];
  doctorAdviceEn: string;
  doctorAdviceHi: string;
}

export const AiHealthTriage: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState<string>('30');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [duration, setDuration] = useState<'<24h' | '1-3days' | '4-7days' | '>1week'>('1-3days');
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');
  const [preExisting, setPreExisting] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleSymptomsEn = [
    'Dry cough, sore throat, and mild fever for 2 days',
    'Sudden sharp abdominal pain with nausea',
    'Throbbing headache with light sensitivity',
    'Burning sensation while urination and pelvic pain',
  ];

  const sampleSymptomsHi = [
    '2 दिनों से सूखी खांसी, गले में खराश और हल्का बुखार',
    'पेट में अचानक तेज दर्द और जी मिचलाना',
    'सिर में तेज दर्द और रोशनी से परेशानी',
    'पेशाब में जलन और पेडू में दर्द',
  ];

  const preExistingOptions = [
    { id: 'diabetes', en: 'Diabetes', hi: 'शुगर' },
    { id: 'bp', en: 'High BP', hi: 'हाई बीपी' },
    { id: 'asthma', en: 'Asthma', hi: 'अस्थमा' },
    { id: 'thyroid', en: 'Thyroid', hi: 'थायरॉइड' },
  ];

  const toggleCondition = (id: string) => {
    setPreExisting((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsAnalyzing(true);
    setTriageResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      const text = symptoms.toLowerCase();
      const isEmergency =
        text.includes('chest pain') ||
        text.includes('heart') ||
        text.includes('breathing') ||
        text.includes('severe') ||
        text.includes('छाती में दर्द') ||
        text.includes('सांस') ||
        severity === 'Severe';

      const isMild =
        (text.includes('mild') || text.includes('हल्का') || severity === 'Mild') &&
        !isEmergency;

      if (isEmergency) {
        setTriageResult({
          urgency: 'high',
          urgencyLabelEn: 'High Priority — Prompt Medical Attention Recommended',
          urgencyLabelHi: 'उच्च प्राथमिकता — तुरंत डॉक्टर से परामर्श लें',
          summaryEn:
            'Reported symptoms indicate a condition requiring in-person clinical evaluation to rule out acute complications.',
          summaryHi:
            'बताए गए लक्षणों के आधार पर तुरंत किसी योग्य डॉक्टर या नजदीकी अस्पताल के इमरजेंसी वार्ड में जांच कराएं।',
          recommendationsEn: [
            'Visit the nearest hospital emergency or trauma center immediately',
            'Do not self-medicate or take unprescribed NSAIDs',
            'Keep your ABHA ID and recent health documents handy',
          ],
          recommendationsHi: [
            'तुरंत नजदीकी सरकारी अस्पताल या इमरजेंसी वार्ड में जाएं',
            'बिना डॉक्टर की सलाह के कोई भारी दवा न लें',
            'अपना आभा (ABHA) कार्ड और पुराने पर्चे साथ रखें',
          ],
          selfCareEn: [
            'Rest in an upright or comfortable posture',
            'Avoid physical exertion and heavy meals',
            'Ensure adequate ventilation and oxygen access',
          ],
          selfCareHi: [
            'आरामदायक मुद्रा में बैठें, भारी काम से बचें',
            'हल्का गुनगुना पानी पिएं',
            'कमरे में खुली ताजी हवा सुनिश्चित करें',
          ],
          doctorAdviceEn:
            'Consult an MD Physician or Emergency Specialist today for physical auscultation, ECG, and blood tests.',
          doctorAdviceHi:
            'आज ही किसी विशेषज्ञ फिजिशियन या अस्पताल से संपर्क करें और उचित जांच करवाएं।',
        });
      } else if (isMild) {
        setTriageResult({
          urgency: 'low',
          urgencyLabelEn: 'Low Risk — Self-Care & Routine Consultation',
          urgencyLabelHi: 'कम जोखिम — सामान्य देखभाल व नियमित परामर्श',
          summaryEn:
            'Reported symptoms appear mild and manageable with rest, hydration, and symptomatic care.',
          summaryHi:
            'आपके लक्षण हल्के प्रतीत होते हैं, जिन्हें पर्याप्त आराम, तरल पदार्थ और सामान्य देखभाल से नियंत्रित किया जा सकता है।',
          recommendationsEn: [
            'Monitor body temperature and symptoms over next 48 hours',
            'Stay well-hydrated with warm fluids and ORS',
            'Book an e-Sanjeevani teleconsultation if symptoms persist past 3 days',
          ],
          recommendationsHi: [
            'अगले 48 घंटों तक शरीर के तापमान और लक्षणों पर नजर रखें',
            'पर्याप्त पानी, गुनगुना सूप या ओआरएस पिएं',
            'यदि 3 दिन बाद भी आराम न मिले तो ई-संजीवनी पर डॉक्टर से बात करें',
          ],
          selfCareEn: [
            'Get 8+ hours of restful sleep',
            'Steam inhalation or warm salt water gargle if throat is irritated',
            'Light, nutritious, easily digestible meals',
          ],
          selfCareHi: [
            'पर्याप्त 8 घंटे की नींद लें',
            'गले में खराश होने पर नमक पानी से गरारे या भाप लें',
            'हल्का और पौष्टिक भोजन लें',
          ],
          doctorAdviceEn:
            'If symptoms worsen, new symptoms appear, or fever exceeds 101°F, consult your Primary Health Centre doctor.',
          doctorAdviceHi:
            'यदि लक्षण बढ़ें या बुखार 101°F से ऊपर जाए, तो अपने प्राथमिक स्वास्थ्य केंद्र के डॉक्टर को अवश्य दिखाएं।',
        });
      } else {
        setTriageResult({
          urgency: 'medium',
          urgencyLabelEn: 'Moderate — Medical Consultation Recommended',
          urgencyLabelHi: 'मध्यम — डॉक्टर से परामर्श की सलाह',
          summaryEn:
            'Symptoms suggest a moderate infectious or systemic episode requiring clinical assessment.',
          summaryHi:
            'लक्षण मध्यम श्रेणी के संक्रमण या शारीरिक परेशानी की ओर संकेत करते हैं, चिकित्सकीय सलाह उपयोगी होगी।',
          recommendationsEn: [
            'Consult a General Physician via e-Sanjeevani or OPD within 24-48 hours',
            'Record vital signs: temperature, blood pressure, and pulse rate',
            'Check Jan Aushadhi generic options for any prescribed medications',
          ],
          recommendationsHi: [
            'अगले 24-48 घंटों में ई-संजीवनी या ओपीडी में सामान्य चिकित्सक से मिलें',
            'तापमान और ब्लड प्रेशर का रिकॉर्ड रखें',
            'डॉक्टर द्वारा लिखी दवाओं के लिए जन औषधि केंद्र के विकल्प देखें',
          ],
          selfCareEn: [
            'Adequate oral hydration (2-3 liters daily)',
            'Avoid oily, spicy, or outside street food',
            'Rest and limit strenuous physical activity',
          ],
          selfCareHi: [
            'दिनभर में पर्याप्त पानी और तरल पदार्थ लें',
            'तला-भुना या बाहरी भोजन न खाएं',
            'भरपूर आराम करें',
          ],
          doctorAdviceEn:
            'Consult a certified MBBS physician to receive an accurate diagnosis and prescription.',
          doctorAdviceHi:
            'सटीक जांच और सही दवा के लिए प्रमाणित डॉक्टर से सलाह लें।',
        });
      }
    }, 600);
  };

  const handleCopySummary = () => {
    if (!triageResult) return;
    const textToCopy = `AI Health Triage (${language === 'hi' ? 'हिन्दी' : 'English'})\nUrgency: ${
      language === 'hi' ? triageResult.urgencyLabelHi : triageResult.urgencyLabelEn
    }\nSummary: ${
      language === 'hi' ? triageResult.summaryHi : triageResult.summaryEn
    }\nDoctor Advice: ${
      language === 'hi' ? triageResult.doctorAdviceHi : triageResult.doctorAdviceEn
    }`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHindi = language === 'hi';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">
              {isHindi ? 'एआई स्वास्थ्य ट्राइएज' : 'AI Health Triage'}
            </h1>
          </div>
          <p className="text-xs text-slate-600">
            {isHindi
              ? 'लक्षण बताएं और प्रारंभिक स्वास्थ्य मार्गदर्शन व डॉक्टर परामर्श की सलाह पाएं।'
              : 'Enter symptoms for preliminary health guidance and care recommendations.'}
          </p>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1">
          <Languages className="w-3.5 h-3.5 text-slate-400 ml-2" />
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
              language === 'en' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
              language === 'hi' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            हिन्दी
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">
              {isHindi ? 'लक्षण व विवरण दर्ज करें' : 'Patient Information'}
            </h2>
            <button
              type="button"
              onClick={() => {
                setSymptoms('');
                setAge('30');
                setPreExisting([]);
                setTriageResult(null);
              }}
              className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{isHindi ? 'साफ़ करें' : 'Clear'}</span>
            </button>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-3.5">
            {/* Age & Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'उम्र (वर्ष)' : 'Age (Years)'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'लिंग' : 'Gender'}
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600 font-medium"
                >
                  <option value="Female">{isHindi ? 'महिला (Female)' : 'Female'}</option>
                  <option value="Male">{isHindi ? 'पुरुष (Male)' : 'Male'}</option>
                  <option value="Other">{isHindi ? 'अन्य (Other)' : 'Other'}</option>
                </select>
              </div>
            </div>

            {/* Symptoms Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isHindi ? 'लक्षण बताएं *' : 'Describe Symptoms *'}
              </label>
              <textarea
                rows={3}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder={
                  isHindi
                    ? 'उदा. 2 दिनों से सूखी खांसी, गले में दर्द और हल्का बुखार...'
                    : 'e.g. Dry cough, sore throat, and mild fever for 2 days...'
                }
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600 resize-none"
                required
              />
            </div>

            {/* Quick Sample Presets */}
            <div className="flex flex-wrap gap-1.5">
              {(isHindi ? sampleSymptomsHi : sampleSymptomsEn).map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSymptoms(sample)}
                  className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded cursor-pointer transition-colors"
                >
                  {sample.slice(0, 28)}...
                </button>
              ))}
            </div>

            {/* Duration & Severity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'अवधि' : 'Duration'}
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                >
                  <option value="<24h">{isHindi ? '< 24 घंटे' : '< 24 Hours'}</option>
                  <option value="1-3days">{isHindi ? '1-3 दिन' : '1-3 Days'}</option>
                  <option value="4-7days">{isHindi ? '4-7 दिन' : '4-7 Days'}</option>
                  <option value=">1week">{isHindi ? '> 1 सप्ताह' : '> 1 Week'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'गंभीरता' : 'Severity'}
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                >
                  <option value="Mild">{isHindi ? 'हल्का (Mild)' : 'Mild'}</option>
                  <option value="Moderate">{isHindi ? 'मध्यम (Moderate)' : 'Moderate'}</option>
                  <option value="Severe">{isHindi ? 'गंभीर (Severe)' : 'Severe'}</option>
                </select>
              </div>
            </div>

            {/* Pre-existing Conditions */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isHindi ? 'पहले से मौजूद स्थिति' : 'Pre-existing Conditions'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {preExistingOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleCondition(opt.id)}
                    className={`text-xs px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                      preExisting.includes(opt.id)
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {isHindi ? opt.hi : opt.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Analyze Button */}
            <button
              type="submit"
              disabled={isAnalyzing || !symptoms.trim()}
              className={`w-full py-2 px-4 rounded-lg font-medium text-xs text-white transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                isAnalyzing || !symptoms.trim()
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{isHindi ? 'विश्लेषण जारी है...' : 'Analyzing...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'लक्षणों का विश्लेषण करें' : 'Analyze Symptoms'}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 space-y-4">
          {!triageResult && !isAnalyzing && (
            <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-xs text-center flex flex-col items-center justify-center min-h-[360px]">
              <Stethoscope className="w-8 h-8 text-indigo-600 mb-2" />
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {isHindi ? 'प्रारंभिक रिपोर्ट' : 'Triage Guidance'}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                {isHindi
                  ? 'बाईं ओर लक्षण दर्ज कर "विश्लेषण करें" पर क्लिक करें।'
                  : 'Fill the symptoms form on the left and click "Analyze Symptoms" to get instant guidance.'}
              </p>
            </div>
          )}

          {isAnalyzing && (
            <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-xs text-center flex flex-col items-center justify-center min-h-[360px]">
              <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mb-2" />
              <p className="text-xs font-semibold text-slate-800">
                {isHindi ? 'एआई ट्राइएज मूल्यांकन प्रगति पर है...' : 'Evaluating symptoms...'}
              </p>
            </div>
          )}

          {triageResult && !isAnalyzing && (
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
              {/* Urgency Badge */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
                    triageResult.urgency === 'high'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : triageResult.urgency === 'medium'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {triageResult.urgency === 'high' ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                  <span>{isHindi ? triageResult.urgencyLabelHi : triageResult.urgencyLabelEn}</span>
                </span>

                <button
                  onClick={handleCopySummary}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Summary */}
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                  {isHindi ? 'सारांश' : 'Summary'}
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {isHindi ? triageResult.summaryHi : triageResult.summaryEn}
                </p>
              </div>

              {/* Recommendations */}
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1.5">
                  {isHindi ? 'अनुशंसाएं' : 'Recommended Actions'}
                </span>
                <ul className="space-y-1.5">
                  {(isHindi ? triageResult.recommendationsHi : triageResult.recommendationsEn).map((rec, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Self-care */}
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1.5">
                  {isHindi ? 'घरेलू देखभाल' : 'Self-Care Steps'}
                </span>
                <ul className="space-y-1.5">
                  {(isHindi ? triageResult.selfCareHi : triageResult.selfCareEn).map((care, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{care}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Doctor Consultation Notice (Mandatory) */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">
                    {isHindi ? 'चिकित्सकीय सलाह सूचना:' : 'Medical Advisory:'}
                  </strong>
                  <p className="mt-0.5 leading-relaxed">
                    {isHindi ? triageResult.doctorAdviceHi : triageResult.doctorAdviceEn}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
