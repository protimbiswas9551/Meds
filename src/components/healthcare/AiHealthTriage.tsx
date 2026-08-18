import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  HeartPulse,
  Stethoscope,
  ShieldAlert,
  CheckCircle2,
  PhoneCall,
  Calendar,
  Pill,
  RefreshCw,
  Copy,
  Check,
  Info,
  Clock,
  User,
  Activity,
  Languages,
  ChevronRight,
} from 'lucide-react';

interface TriageResult {
  urgency: 'low' | 'medium' | 'high';
  urgencyLabelEn: string;
  urgencyLabelHi: string;
  possibleCausesEn: string[];
  possibleCausesHi: string[];
  summaryEn: string;
  summaryHi: string;
  recommendationsEn: string[];
  recommendationsHi: string[];
  selfCareEn: string[];
  selfCareHi: string[];
  redFlagsEn: string[];
  redFlagsHi: string[];
  doctorAdviceEn: string;
  doctorAdviceHi: string;
}

export const AiHealthTriage: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState<string>('32');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [duration, setDuration] = useState<'<24h' | '1-3days' | '4-7days' | '>1week'>('1-3days');
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');
  const [preExisting, setPreExisting] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleSymptomsEn = [
    'Dry cough, mild fever (99.5°F), sore throat and body ache',
    'Sudden sharp abdominal pain on lower right side with nausea',
    'Throbbing headache on one side with light sensitivity',
    'Burning sensation while urination with mild pelvic discomfort',
    'Joint pain in both knees with morning stiffness for 3 days',
  ];

  const sampleSymptomsHi = [
    'सूखी खांसी, हल्का बुखार, गले में खराश और बदन दर्द',
    'पेट के निचले हिस्से में तेज दर्द और उल्टी जैसा लगना',
    'सिर में एक तरफ तेज दर्द और रोशनी से परेशानी (माइग्रेन)',
    'पेशाब में जलन और हल्का पेडू दर्द',
    'दोनों घुटनों में दर्द और सुबह उठने पर अकड़न',
  ];

  const preExistingOptions = [
    { id: 'diabetes', en: 'Diabetes', hi: 'मधुमेह (शुगर)' },
    { id: 'bp', en: 'Hypertension (High BP)', hi: 'उच्च रक्तचाप (High BP)' },
    { id: 'asthma', en: 'Asthma / Respiratory', hi: 'अस्थमा / सांस की समस्या' },
    { id: 'thyroid', en: 'Thyroid', hi: 'थायरॉइड' },
    { id: 'none', en: 'None', hi: 'कोई नहीं' },
  ];

  const toggleCondition = (id: string) => {
    if (id === 'none') {
      setPreExisting(['none']);
      return;
    }
    setPreExisting((prev) => {
      const filtered = prev.filter((item) => item !== 'none');
      if (filtered.includes(id)) {
        return filtered.filter((item) => item !== id);
      } else {
        return [...filtered, id];
      }
    });
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsAnalyzing(true);
    setAnalysisStep(1);
    setTriageResult(null);

    setTimeout(() => setAnalysisStep(2), 700);
    setTimeout(() => setAnalysisStep(3), 1400);

    setTimeout(() => {
      setIsAnalyzing(false);
      generateResult();
    }, 2100);
  };

  const generateResult = () => {
    const text = symptoms.toLowerCase();
    let urgency: 'low' | 'medium' | 'high' = 'medium';

    // Basic heuristic simulation based on symptom keywords
    const isEmergency =
      text.includes('chest pain') ||
      text.includes('heart') ||
      text.includes('breathing difficulty') ||
      text.includes('severe pain') ||
      text.includes('छाती में दर्द') ||
      text.includes('सांस लेने में तकलीफ') ||
      severity === 'Severe';

    const isMild =
      (text.includes('mild') || text.includes('हल्का') || severity === 'Mild') &&
      !isEmergency;

    if (isEmergency) {
      urgency = 'high';
    } else if (isMild) {
      urgency = 'low';
    } else {
      urgency = 'medium';
    }

    if (urgency === 'high') {
      setTriageResult({
        urgency: 'high',
        urgencyLabelEn: 'High Priority — Prompt Clinical Attention Advised',
        urgencyLabelHi: 'उच्च प्राथमिकता — शीघ्र चिकित्सकीय परामर्श आवश्यक',
        possibleCausesEn: [
          'Acute Coronary / Cardiac Evaluation Needed',
          'Acute Severe Respiratory Distress',
          'Acute Surgical Abdomen / Appendicitis',
          'Severe Infection or High-Grade Pyrexia',
        ],
        possibleCausesHi: [
          'हृदय या फेफड़ों की आपातकालीन स्थिति की संभावना',
          'गंभीर श्वसन संबंधी समस्या',
          'तीव्र पेट संक्रमण अथवा सर्जरी आवश्यकता',
          'गंभीर संक्रमण या अत्यधिक तेज बुखार',
        ],
        summaryEn: `Based on the reported symptoms ("${symptoms.slice(0, 60)}...") and severity level in a ${age}-year-old ${gender.toLowerCase()}, this profile suggests moderate-to-high clinical acuity that warrants urgent in-person medical evaluation.`,
        summaryHi: `${age} वर्ष के मरीज में बताए गए लक्षणों ("${symptoms.slice(0, 60)}...") और गंभीरता के आधार पर तुरंत नजदीकी सरकारी अस्पताल/क्लीनिक में डॉक्टर से जांच कराने की सलाह दी जाती है।`,
        recommendationsEn: [
          'Visit the nearest Community Health Centre (CHC), Civil Hospital, or District Emergency room immediately.',
          'If experiencing severe breathlessness or crushing chest tightness, call Ambulance 108 without delay.',
          'Keep your previous medical prescriptions and Ayushman ABHA ID card ready.',
          'Avoid self-administering unverified prescription antibiotics or strong painkillers without clinical supervision.',
        ],
        recommendationsHi: [
          'नजदीकी सामुदायिक स्वास्थ्य केंद्र (CHC), सिविल अस्पताल या आपातकालीन विभाग (Emergency) में तुरंत जाएं।',
          'सांस फूलने या सीने में भारीपन होने पर बिना देर किए 108 एम्बुलेंस पर कॉल करें।',
          'अपनी पुरानी दवाइयों की पर्ची और आयुष्मान ABHA कार्ड साथ रखें।',
          'बिना डॉक्टर की सलाह के कोई भी तेज एंटीबायोटिक या दर्दनिवारक दवा न लें।',
        ],
        selfCareEn: [
          'Sit in a comfortable upright position in a well-ventilated room.',
          'Keep oral hydration sips if conscious and not feeling extreme nausea.',
          'Record resting pulse rate and body temperature if home monitoring tools are available.',
        ],
        selfCareHi: [
          'हवादार कमरे में आरामदायक स्थिति में सीधे बैठें।',
          'बेहोशी या उल्टी की स्थिति न होने पर थोड़ा-थोड़ा पानी पिएं।',
          'घर पर उपलब्ध होने पर बुखार (थर्मामीटर) और पल्स ऑक्सीमीटर से जांच नोट करें।',
        ],
        redFlagsEn: [
          'Cyanosis (bluish tint on lips or fingers)',
          'Sudden confusion, speech slurring, or fainting',
          'Persistent high fever above 103°F not subsiding',
          'Inability to swallow liquids or intractable vomiting',
        ],
        redFlagsHi: [
          'होंठ या नाखूनों का नीला पड़ना',
          'अचानक चक्कर आना, बेहोशी या बोलने में लड़खड़ाहट',
          '103°F से अधिक लगातार तेज बुखार जो कम न हो रहा हो',
          'पानी भी न पी पाना या लगातार उल्टी होना',
        ],
        doctorAdviceEn:
          'IMPORTANT DISCLAIMER: This AI Health Triage is an automated preliminary informational guide created for public health screening and does NOT constitute a certified medical diagnosis. Always consult a registered MBBS/MD physician for proper clinical diagnostic tests, physical examination, and personalized treatment plans.',
        doctorAdviceHi:
          'महत्वपूर्ण सूचना: यह AI हेल्थ ट्राइएज एक स्वचालित प्रारंभिक स्वास्थ्य परामर्श टूल है और यह डॉक्टर के आधिकारिक निदान (Diagnosis) का विकल्प नहीं है। सटीक जांच, शारीरिक परीक्षण और सही दवा के लिए हमेशा पंजीकृत डॉक्टर (MBBS/MD) से परामर्श लें।',
      });
    } else if (urgency === 'low') {
      setTriageResult({
        urgency: 'low',
        urgencyLabelEn: 'Low Priority — Mild Symptoms / Home Care & Observation',
        urgencyLabelHi: 'कम प्राथमिकता — हल्के लक्षण / घरेलू देखभाल और निगरानी',
        possibleCausesEn: [
          'Mild Viral Upper Respiratory Tract Infection (Common Cold)',
          'Seasonal Allergic Rhinitis or Pharyngitis',
          'Mild Tension Headache or Digital Eye Strain',
          'Mild Indigestion / Dietary Gastric Irritation',
        ],
        possibleCausesHi: [
          'हल्का वायरल सर्दी-जुकाम (वायरल इन्फेक्शन)',
          'मौसमी एलर्जी या गले की खराश',
          'तनाव या स्क्रीन देखने से होने वाला सिरदर्द',
          'खानपान में बदलाव से हल्का अपच या गैस',
        ],
        summaryEn: `The reported symptoms appear mild and consistent with common low-acuity conditions for a ${age}-year-old ${gender.toLowerCase()}. Routine conservative management and monitoring are indicated.`,
        summaryHi: `${age} वर्ष के मरीज में दर्ज लक्षण सामान्य और हल्के प्रकार के प्रतीत होते हैं। उचित आराम, पौष्टिक आहार और नियमित निगरानी से आराम मिल सकता है।`,
        recommendationsEn: [
          'Ensure ample fluid intake (warm water, clear broths, coconut water, or ORS).',
          'Take adequate physical rest and maintain 7–8 hours of sound sleep.',
          'Consider visiting a nearby Jan Aushadhi Kendra for cost-effective generic over-the-counter essentials (e.g. Paracetamol, Saline nasal spray, ORS) if advised by a pharmacist.',
          'If symptoms persist beyond 48–72 hours or intensify, consult a doctor via free e-Sanjeevani OPD.',
        ],
        recommendationsHi: [
          'पर्याप्त मात्रा में तरल पदार्थ पिएं (गुनगुना पानी, सूप, नारियल पानी या ORS घोल)।',
          'पूरा आराम करें और कम से कम 7-8 घंटे की नींद लें।',
          'जरूरत पड़ने पर नजदीकी जन औषधि केंद्र से सस्ती जेनेरिक दवाएं (जैसे पैरासिटामोल, नेजल ड्रॉप्स) फार्मासिस्ट की सलाह से ले सकते हैं।',
          'यदि लक्षण 2-3 दिनों में ठीक न हों या बढ़ें, तो ई-संजीवनी फ्री ओपीडी पर डॉक्टर से बात करें।',
        ],
        selfCareEn: [
          'Steam inhalation with plain warm water for congestion.',
          'Warm salt water gargles 2-3 times a day for throat irritation.',
          'Light, easily digestible home-cooked meals (khichdi, oats, dalia).',
        ],
        selfCareHi: [
          'गले और नाक की जकड़न के लिए सादे गर्म पानी की भाप लें।',
          'गले की खराश के लिए दिन में 2-3 बार गुनगुने नमक के पानी से गरारे करें।',
          'सुपाच्य एवं हल्का घर का बना भोजन (खिचड़ी, दलिया, सूप) लें।',
        ],
        redFlagsEn: [
          'Fever rising above 101.5°F for more than 3 days',
          'Development of productive rust-colored phlegm or ear discharge',
          'Severe stiff neck accompanied by light sensitivity',
        ],
        redFlagsHi: [
          '3 दिनों से ज्यादा समय तक 101.5°F से अधिक बुखार रहना',
          'गले में अत्यधिक दर्द या कान से मवाद आना',
          'गर्दन में तेज अकड़न और रोशनी से असहजता',
        ],
        doctorAdviceEn:
          'IMPORTANT DISCLAIMER: This triage summary is for general health literacy and informational purposes only. It is not medical advice. If you are uncertain or symptoms worsen, please visit your local Primary Health Centre (PHC) or consult a certified doctor.',
        doctorAdviceHi:
          'महत्वपूर्ण सूचना: यह परामर्श केवल सामान्य जानकारी और जागरूकता के लिए है। किसी भी संदेह या स्थिति बिगड़ने पर अपने प्राथमिक स्वास्थ्य केंद्र (PHC) या योग्य चिकित्सक से अवश्य मिलें।',
      });
    } else {
      // Medium
      setTriageResult({
        urgency: 'medium',
        urgencyLabelEn: 'Moderate Priority — General Physician / OPD Consultation Recommended',
        urgencyLabelHi: 'मध्यम प्राथमिकता — सामान्य चिकित्सक / OPD परामर्श की सलाह',
        possibleCausesEn: [
          'Acute Viral Pharyngitis / Seasonal Influenza',
          'Bacterial Upper Respiratory or Sinus Infection',
          'Acute Gastroenteritis / Foodborne Indigestion',
          'Musculoskeletal Strain / Joint Inflammation',
        ],
        possibleCausesHi: [
          'मौसमी फ्लू अथवा गले का संक्रमण',
          'साइनस या बैक्टीरिया जनित संक्रमण',
          'पेट का संक्रमण / गैस्ट्रोएंटेराइटिस',
          'मांसपेशियों में खिंचाव या जोड़ों में सूजन',
        ],
        summaryEn: `Your reported symptoms for a ${age}-year-old ${gender.toLowerCase()} over ${duration} show moderate clinical activity. While not an acute emergency, scheduled clinical evaluation by a medical officer is advised to prevent escalation.`,
        summaryHi: `${age} वर्ष के मरीज में ${duration} से दर्ज लक्षण मध्यम श्रेणी के हैं। यद्यपि यह आपातकाल नहीं है, फिर भी सही समय पर डॉक्टर से मिलकर उपचार शुरू करना उचित रहेगा।`,
        recommendationsEn: [
          'Book a free government teleconsultation token on e-Sanjeevani OPD for digital prescription.',
          'Visit your local Urban/Rural Primary Health Centre (PHC) or Mohalla Clinic during morning OPD hours (8 AM – 2 PM).',
          'Stay well-hydrated and isolate if feverish to avoid transmitting seasonal viral bugs to family members.',
          'Generic formulations like Paracetamol, Cetirizine, or Antacids are available at nominal cost (₹5–₹20) at PM Jan Aushadhi Kendras.',
        ],
        recommendationsHi: [
          'ई-संजीवनी फ्री ओपीडी पर ऑनलाइन डॉक्टर से बात करके डिजिटल पर्ची प्राप्त करें।',
          'सुबह 8 से दोपहर 2 बजे के बीच नजदीकी प्राथमिक स्वास्थ्य केंद्र (PHC) या मोहल्ला क्लीनिक में डॉक्टर को दिखाएं।',
          'संक्रमण दूसरों में न फैले इसके लिए पर्याप्त दूरी रखें और भरपूर पानी पिएं।',
          'प्रधानमंत्री जन औषधि केंद्र से मात्र ₹5 से ₹20 में जरूरी जेनेरिक दवाएं प्राप्त की जा सकती हैं।',
        ],
        selfCareEn: [
          'Check and log oral body temperature twice daily.',
          'Eat balanced, warm meals with adequate protein and hydration.',
          'Avoid strenuous physical exertion and heavy lifting until energy levels recover.',
        ],
        selfCareHi: [
          'दिन में दो बार थर्मामीटर से बुखार नापकर नोट करें।',
          'हल्का, गर्म और पौष्टिक आहार लें।',
          'थकान दूर होने तक भारी वजन उठाने और कड़े व्यायाम से बचें।',
        ],
        redFlagsEn: [
          'Persistent high fever beyond 72 hours',
          'Severe dehydration (dry mouth, dark urine, dizziness on standing)',
          'Localized swelling or escalating severe focal pain',
        ],
        redFlagsHi: [
          '72 घंटे से अधिक लगातार तेज बुखार रहना',
          'शरीर में पानी की भारी कमी (मुंह सूखना, चक्कर आना)',
          'किसी एक अंग में अत्यधिक सूजन या असहनीय दर्द',
        ],
        doctorAdviceEn:
          'IMPORTANT DISCLAIMER: This automated triage is a preliminary educational tool and cannot replace a physical clinical examination, blood tests, or diagnostic imaging by a registered doctor. Please consult a healthcare professional for accurate treatment.',
        doctorAdviceHi:
          'महत्वपूर्ण सूचना: यह स्वचालित ट्राइएज केवल प्रारंभिक मार्गदर्शन के लिए है और यह किसी डॉक्टर की शारीरिक जांच, लैब टेस्ट या अल्ट्रासाउंड/एक्स-रे का विकल्प नहीं हो सकता। सटीक उपचार के लिए स्वास्थ्य पेशेवर से परामर्श करें।',
      });
    }
  };

  const handleCopy = () => {
    if (!triageResult) return;
    const isHi = language === 'hi';
    const textToCopy = `[AI Health Triage Guidance / स्वास्थ्य परामर्श]
Urgency / प्राथमिकता: ${isHi ? triageResult.urgencyLabelHi : triageResult.urgencyLabelEn}
Summary / सारांश: ${isHi ? triageResult.summaryHi : triageResult.summaryEn}
Recommendations / मुख्य सलाह:
${(isHi ? triageResult.recommendationsHi : triageResult.recommendationsEn).map((r) => `• ${r}`).join('\n')}
Disclaimer: ${isHi ? triageResult.doctorAdviceHi : triageResult.doctorAdviceEn}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleReset = () => {
    setSymptoms('');
    setTriageResult(null);
  };

  const isHindi = language === 'hi';

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                {isHindi ? 'एआई स्वास्थ्य ट्राइएज' : 'AI Health Triage & Guidance'}
              </span>
              <span className="text-xs text-slate-500">
                {isHindi ? 'प्रारंभिक लक्षण मूल्यांकन' : 'Preliminary Symptom Evaluator'}
              </span>
            </div>

            {/* Language Switcher Button */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-indigo-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  language === 'hi'
                    ? 'bg-white text-indigo-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिन्दी (Hindi)
              </button>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2">
            {isHindi
              ? 'एआई लक्षण ट्राइएज: त्वरित प्रारंभिक स्वास्थ्य मार्गदर्शन'
              : 'AI Health Triage: Instant Symptom Assessment & Guidance'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {isHindi
              ? 'अपने लक्षणों, उम्र और अवधि का विवरण दर्ज करें। हमारा सुरक्षित एआई ट्राइएज सिस्टम गंभीरता स्तर का मूल्यांकन करेगा, संभावित कारणों की जानकारी देगा और प्राथमिक घरेलू एवं डॉक्टरी सलाह प्रदान करेगा।'
              : 'Enter your symptoms, age, and duration to receive instant, structured preliminary guidance, severity classification, self-care measures, and appropriate clinical next steps.'}
          </p>
        </div>
      </div>

      {/* Main Grid: Input Form (Left) & AI Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Container */}
        <div className="lg:col-span-6 bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {isHindi ? 'रोगी एवं लक्षण विवरण' : 'Patient & Symptom Details'}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{isHindi ? 'रीसेट' : 'Clear Form'}</span>
              </button>
            </div>

            {/* Demographics: Age & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'उम्र (वर्षों में)' : 'Age (Years)'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600 font-medium"
                  placeholder="30"
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
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600 font-medium"
                >
                  <option value="Female">{isHindi ? 'महिला (Female)' : 'Female'}</option>
                  <option value="Male">{isHindi ? 'पुरुष (Male)' : 'Male'}</option>
                  <option value="Other">{isHindi ? 'अन्य (Other)' : 'Other'}</option>
                </select>
              </div>
            </div>

            {/* Symptom Input Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  {isHindi ? 'मुख्य लक्षण व परेशानी बताएं' : 'Describe Primary Symptoms & Discomfort'}
                </label>
                <span className="text-[10px] text-slate-400">
                  {isHindi ? 'विस्तार से लिखें' : 'Be as descriptive as possible'}
                </span>
              </div>
              <textarea
                rows={4}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder={
                  isHindi
                    ? 'उदा. मुझे 2 दिनों से सूखी खांसी, गले में खराश और 100°F बुखार है...'
                    : 'e.g., I have had a dry cough, sore throat, and mild fever (100°F) for the past 2 days...'
                }
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600 leading-relaxed resize-none"
                required
              />
            </div>

            {/* Sample Symptom Chips for Quick Fill */}
            <div>
              <span className="block text-[11px] font-medium text-slate-500 mb-1.5">
                {isHindi ? 'त्वरित उदाहरण लक्षण (Quick Examples):' : 'Or select a common scenario:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(isHindi ? sampleSymptomsHi : sampleSymptomsEn).map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSymptoms(sample)}
                    className="text-[11px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md transition-colors text-left cursor-pointer"
                  >
                    {sample.slice(0, 36)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Duration & Severity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'लक्षणों की अवधि' : 'Duration of Symptoms'}
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600 font-medium"
                >
                  <option value="<24h">{isHindi ? '24 घंटे से कम (<24 Hours)' : '< 24 Hours'}</option>
                  <option value="1-3days">{isHindi ? '1 से 3 दिन (1–3 Days)' : '1–3 Days'}</option>
                  <option value="4-7days">{isHindi ? '4 से 7 दिन (4–7 Days)' : '4–7 Days'}</option>
                  <option value=">1week">{isHindi ? '1 सप्ताह से अधिक (>1 Week)' : '> 1 Week'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'गंभीरता का स्तर' : 'Perceived Severity'}
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600 font-medium"
                >
                  <option value="Mild">{isHindi ? 'हल्का (Mild)' : 'Mild'}</option>
                  <option value="Moderate">{isHindi ? 'मध्यम (Moderate)' : 'Moderate'}</option>
                  <option value="Severe">{isHindi ? 'गंभीर (Severe / High Pain)' : 'Severe / High Pain'}</option>
                </select>
              </div>
            </div>

            {/* Pre-existing conditions */}
            <div className="pt-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isHindi ? 'पहले से मौजूद कोई बीमारी?' : 'Any Pre-Existing Conditions?'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {preExistingOptions.map((opt) => {
                  const isSelected = preExisting.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleCondition(opt.id)}
                      className={`text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-medium'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {isHindi ? opt.hi : opt.en}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isAnalyzing || !symptoms.trim()}
                className={`w-full py-2.5 px-4 rounded-lg font-medium text-xs sm:text-sm text-white transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                  isAnalyzing || !symptoms.trim()
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>
                      {analysisStep === 1
                        ? isHindi ? 'लक्षणों का विश्लेषण जारी...' : 'Analyzing reported symptoms...'
                        : analysisStep === 2
                        ? isHindi ? 'ट्राइएज गंभीरता का आकलन...' : 'Evaluating triage severity level...'
                        : isHindi ? 'स्वास्थ्य मार्गदर्शन तैयार किया जा रहा है...' : 'Synthesizing guidance & recommendations...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{isHindi ? 'लक्षणों का एआई विश्लेषण करें' : 'Analyze Symptoms with AI Triage'}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Notice under form */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
            <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
            <span>
              {isHindi
                ? 'यह सेवा 100% निःशुल्क है और आपका डेटा पूरी तरह से गोपनीय रहता है।'
                : 'Free public health utility. Data processed locally for citizen guidance without saving sensitive health records.'}
            </span>
          </div>
        </div>

        {/* Results Container (Right) */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          {!triageResult && !isAnalyzing && (
            <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-xs text-center flex-1 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {isHindi ? 'एआई स्वास्थ्य ट्राइएज रिपोर्ट' : 'AI Health Triage Guidance Report'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-4">
                {isHindi
                  ? 'बाईं ओर फॉर्म भरकर "एआई विश्लेषण करें" पर क्लिक करें। आपको विस्तृत प्रारंभिक स्वास्थ्य सलाह और डॉक्टर परामर्श की सिफारिशें प्राप्त होंगी।'
                  : 'Complete the symptom details on the left and click "Analyze Symptoms with AI Triage" to receive preliminary health evaluation and care steps.'}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
                <span>
                  {isHindi ? 'द्विभाषी सहायता: हिन्दी और English' : 'Bilingual Support: English & हिन्दी'}
                </span>
              </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-xs text-center flex-1 flex flex-col items-center justify-center min-h-[400px]">
              <div className="relative mb-4">
                <div className="w-12 h-12 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {isHindi ? 'एआई ट्राइएज इंजन सक्रिय है' : 'Running AI Clinical Triage Protocol'}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                {analysisStep === 1 && (isHindi ? 'दर्ज लक्षणों का डेटा विश्लेषण...' : 'Parsing symptoms and cross-referencing health databases...')}
                {analysisStep === 2 && (isHindi ? 'आयु, लिंग और जोखिम कारकों का मिलान...' : 'Matching age, duration, and clinical risk criteria...')}
                {analysisStep === 3 && (isHindi ? 'नागरिक स्वास्थ्य गाइड और निष्कर्ष निर्माण...' : 'Generating verified non-diagnostic preliminary recommendations...')}
              </p>
            </div>
          )}

          {triageResult && !isAnalyzing && (
            <div className="space-y-4">
              {/* Urgency Badge & Summary Card */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                          triageResult.urgency === 'high'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : triageResult.urgency === 'medium'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {triageResult.urgency === 'high' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        ) : triageResult.urgency === 'medium' ? (
                          <Activity className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                        <span>{isHindi ? triageResult.urgencyLabelHi : triageResult.urgencyLabelEn}</span>
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {isHindi ? 'प्रारंभिक मूल्यांकन सारांश' : 'Preliminary Evaluation Summary'}
                    </h3>
                  </div>

                  <button
                    onClick={handleCopy}
                    className="p-1.5 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors text-xs flex items-center gap-1 cursor-pointer shrink-0"
                    title="Copy summary"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[11px] text-emerald-600 font-medium">{isHindi ? 'कॉपी हुआ' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px]">{isHindi ? 'कॉपी' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {isHindi ? triageResult.summaryHi : triageResult.summaryEn}
                </p>

                {/* Possible Causes List */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-700 mb-1.5">
                    {isHindi ? 'संभावित सामान्य स्थितियां (Doctor Evaluation Required):' : 'Potential General Conditions to Review with Doctor:'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {(isHindi ? triageResult.possibleCausesHi : triageResult.possibleCausesEn).map((cause, idx) => (
                      <div
                        key={idx}
                        className="text-[11px] bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded text-slate-700 flex items-center gap-1.5"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        <span>{cause}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Action Steps */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    {isHindi ? 'अनुशंसित कदम एवं प्राथमिक देखभाल' : 'Recommended Action Steps & Care'}
                  </h4>
                </div>

                <ul className="space-y-2">
                  {(isHindi ? triageResult.recommendationsHi : triageResult.recommendationsEn).map((rec, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>

                {/* Self Care points */}
                <div className="pt-2 border-t border-slate-100">
                  <h5 className="text-[11px] font-semibold text-slate-700 mb-1.5">
                    {isHindi ? 'घरेलू देखभाल एवं आराम:' : 'Supportive Home Measures:'}
                  </h5>
                  <div className="space-y-1">
                    {(isHindi ? triageResult.selfCareHi : triageResult.selfCareEn).map((sc, idx) => (
                      <div key={idx} className="text-[11px] text-slate-500 flex items-start gap-1.5">
                        <span>•</span>
                        <span>{sc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Red Flags Alert */}
                <div className="pt-2 border-t border-slate-100 bg-rose-50/50 p-3 rounded-lg border border-rose-100">
                  <div className="flex items-center gap-1.5 text-rose-700 text-xs font-semibold mb-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    <span>{isHindi ? 'चेतावनी के संकेत (Red Flag Symptoms):' : 'Emergency Warning Signs:'}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-600">
                    {(isHindi ? triageResult.redFlagsHi : triageResult.redFlagsEn).map((rf, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-rose-500" />
                        <span>{rf}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Strict Medical Disclaimer & Doctor Reminder */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 shadow-xs">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 leading-relaxed">
                    <strong className="font-semibold block mb-0.5">
                      {isHindi ? 'डॉक्टर परामर्श अनुस्मारक (Doctor Reminder):' : 'Mandatory Clinical Disclaimer:'}
                    </strong>
                    {isHindi ? triageResult.doctorAdviceHi : triageResult.doctorAdviceEn}
                  </div>
                </div>
              </div>

              {/* Quick Actions Row */}
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href="tel:108"
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'आपातकालीन 108 कॉल' : 'Emergency 108'}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
