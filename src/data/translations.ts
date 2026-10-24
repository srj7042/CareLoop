// Translations for patient-facing plain-language content (6th-grade reading level).
// Keys map to UI. Arabic is RTL-capable (dir="rtl" handled by container).

export type Lang = "en" | "hi" | "mr" | "ar" | "es";

export interface ScreeningInfo {
  title: string;
  whatThisMeans: string;
  whatHappensNext: string[];
  reassurance: string;
  nextSteps: string;
}

export const translations: Record<Lang, Record<string, string>> = {
  en: {
    appName: "CareLoop",
    tagline: "Every result. Every step. Closed.",
    patientPortalTitle: "Patient Results & Care Hub",
    resultTitle: "Your Screening Result",
    resultDate: "Test Date",
    whatThisMeans: "What this means in plain words",
    whatHappensNext: "What happens next",
    whatINeedToDo: "What you need to do today",
    doYouUnderstand: "Do you understand your result?",
    yes: "Yes, I understand",
    questions: "I have questions",
    callMe: "Please call me",
    reassurance: "Finding something early gives you the best care choices. You are not alone—your care team is with you every step.",
    talkToSomeone: "Talk to a Care Coordinator",
    bookAppointment: "Book / Confirm Appointment",
    requestCallback: "Request a Free Callback",
    statusAcknowledged: "Result confirmed by you",
    statusPending: "Awaiting your confirmation",
    statusInProgress: "Care plan in progress",
    statusClosed: "Loop successfully closed ✓",
    language: "Language",
    notificationSent: "Message sent",
    notificationDelivered: "Delivered to your phone",
    notificationRead: "Read by you",
    notificationAcknowledged: "Confirmed by you",
    back: "Back",
    close: "Close",
    save: "Save",
    cancel: "Cancel",
    pulseSurveyTitle: "2-Question Quick Check",
    pulseQ1: "How clearly did you understand this result?",
    pulseQ2: "How confident and reassured do you feel about the next steps?",
    pulseSubmit: "Submit Feedback",
    pulseThankYou: "Thank you! Your feedback helps us care for you better.",
    callbackSuccess: "Callback requested! A care coordinator will call you within 2 hours.",
    simulatedDisclaimer: "Simulated demonstration for healthcare hackathon. No real medical data is shared.",
    urgentBadge: "Urgent Follow-Up",
    highBadge: "Priority Follow-Up",
    routineBadge: "Routine Follow-Up",
  },
  es: {
    appName: "CareLoop",
    tagline: "Cada resultado. Cada paso. Cerrado.",
    patientPortalTitle: "Portal del Paciente y Centro de Cuidados",
    resultTitle: "Su Resultado de Prueba",
    resultDate: "Fecha de la Prueba",
    whatThisMeans: "Qué significa esto en palabras sencillas",
    whatHappensNext: "Qué sucede después",
    whatINeedToDo: "Lo que usted debe hacer hoy",
    doYouUnderstand: "¿Entiende su resultado?",
    yes: "Sí, lo entiendo",
    questions: "Tengo preguntas",
    callMe: "Por favor llámeme",
    reassurance: "Detectar algo a tiempo le da las mejores opciones de cuidado. No está solo: su equipo médico le acompaña en cada paso.",
    talkToSomeone: "Hablar con un Coordinador",
    bookAppointment: "Reservar / Confirmar Cita",
    requestCallback: "Solicitar Devolución de Llamada",
    statusAcknowledged: "Resultado confirmado por usted",
    statusPending: "Esperando su confirmación",
    statusInProgress: "Plan de cuidado en marcha",
    statusClosed: "Ciclo cerrado con éxito ✓",
    language: "Idioma",
    notificationSent: "Mensaje enviado",
    notificationDelivered: "Entregado a su teléfono",
    notificationRead: "Leído por usted",
    notificationAcknowledged: "Confirmado por usted",
    back: "Atrás",
    close: "Cerrar",
    save: "Guardar",
    cancel: "Cancelar",
    pulseSurveyTitle: "Evaluación Rápida de 2 Preguntas",
    pulseQ1: "¿Con qué claridad entendió este resultado?",
    pulseQ2: "¿Qué tan seguro y tranquilo se siente respecto a los siguientes pasos?",
    pulseSubmit: "Enviar Respuesta",
    pulseThankYou: "¡Gracias! Su opinión nos ayuda a brindarle un mejor cuidado.",
    callbackSuccess: "¡Llamada solicitada! Un coordinador se comunicará con usted en menos de 2 horas.",
    simulatedDisclaimer: "Demostración simulada para hackathon de salud. No contiene datos médicos reales.",
    urgentBadge: "Seguimiento Urgente",
    highBadge: "Seguimiento Prioritario",
    routineBadge: "Seguimiento Rutinario",
  },
  hi: {
    appName: "CareLoop",
    tagline: "हर परिणाम. हर कदम. पूरा.",
    patientPortalTitle: "मरीज़ पोर्टल और देखभाल केंद्र",
    resultTitle: "आपकी जांच रिपोर्ट",
    resultDate: "जांच की तारीख",
    whatThisMeans: "सरल शब्दों में इसका क्या मतलब है",
    whatHappensNext: "आगे क्या कदम उठाए जाएंगे",
    whatINeedToDo: "आज आपको क्या करना चाहिए",
    doYouUnderstand: "क्या आप अपने परिणाम को अच्छी तरह समझ गए?",
    yes: "हाँ, मैं समझ गया/गयी",
    questions: "मेरे कुछ सवाल हैं",
    callMe: "कृपया मुझे कॉल करें",
    reassurance: "समय पर जांच होने से सही इलाज आसान हो जाता है। आप अकेले नहीं हैं, हमारी टीम आपके साथ है।",
    talkToSomeone: "देखभाल समन्वयक से बात करें",
    bookAppointment: "अपॉइंटमेंट तय / पक्का करें",
    requestCallback: "मुफ़्त कॉलबैक का अनुरोध करें",
    statusAcknowledged: "आपने परिणाम स्वीकार कर लिया है",
    statusPending: "आपकी पुष्टि की प्रतीक्षा है",
    statusInProgress: "देखभाल योजना प्रगति पर है",
    statusClosed: "लूप सफलतापूर्वक पूरा हुआ ✓",
    language: "भाषा",
    notificationSent: "संदेश भेजा गया",
    notificationDelivered: "फ़ोन पर पहुंच गया",
    notificationRead: "पढ़ा गया",
    notificationAcknowledged: "स्वीकार किया गया",
    back: "वापस",
    close: "बंद करें",
    save: "सहेजें",
    cancel: "रद्द करें",
    pulseSurveyTitle: "2-सवालों का छोटा फीडबैक",
    pulseQ1: "आपको यह परिणाम कितनी स्पष्टता से समझ आया?",
    pulseQ2: "आगे के इलाज को लेकर आप कितना आश्वस्त और सुरक्षित महसूस कर रहे हैं?",
    pulseSubmit: "जवाब भेजें",
    pulseThankYou: "धन्यवाद! आपकी राय से हमें बेहतर सेवा देने में मदद मिलती है।",
    callbackSuccess: "कॉलबैक अनुरोध दर्ज! हमारे समन्वयक 2 घंटे के भीतर आपसे संपर्क करेंगे।",
    simulatedDisclaimer: "स्वास्थ्य हैकाथॉन के लिए सिम्युलेटेड डेमो। कोई वास्तविक डेटा उपयोग नहीं किया गया।",
    urgentBadge: "तत्काल अनुवर्ती कार्रवाई",
    highBadge: "प्राथमिकता अनुवर्ती कार्रवाई",
    routineBadge: "सामान्य अनुवर्ती कार्रवाई",
  },
  mr: {
    appName: "CareLoop",
    tagline: "प्रत्येक परिणाम. प्रत्येक पाऊल. पूर्ण.",
    patientPortalTitle: "रुग्ण केंद्र आणि काळजी मदत कक्ष",
    resultTitle: "तुमचा तपासणी अहवाल",
    resultDate: "तपासणी दिनांक",
    whatThisMeans: "सोप्या भाषेत याचा अर्थ काय",
    whatHappensNext: "पुढे काय होणार आहे",
    whatINeedToDo: "आज तुम्हाला काय करायचे आहे",
    doYouUnderstand: "तुम्हाला तुमचा अहवाल नीट समजला का?",
    yes: "होय, मला समजले",
    questions: "मला शंका आहेत",
    callMe: "कृपया मला फोन करा",
    reassurance: "लवकर तपासणी झाल्यामुळे सर्वोत्तम उपचार शक्य होतात. तुम्ही एकटे नाही आहात, आमची टीम तुमच्यासोबत आहे.",
    talkToSomeone: "काळजी समन्वयकांशी बोला",
    bookAppointment: "अपॉइंटमेंट बुक / निश्चित करा",
    requestCallback: "विनामूल्य कॉलबॅकची विनंती करा",
    statusAcknowledged: "तुम्ही अहवाल पाहिल्याची नोंद झाली",
    statusPending: "तुमच्या खात्रीची प्रतीक्षा आहे",
    statusInProgress: "उपचार प्रक्रिया सुरू आहे",
    statusClosed: "काळजी चक्र यशस्वीरीत्या पूर्ण ✓",
    language: "भाषा",
    notificationSent: "संदेश पाठवला",
    notificationDelivered: "मोबाईलवर पोहोचला",
    notificationRead: "वाचला गेला",
    notificationAcknowledged: "खात्री झाली",
    back: "मागे",
    close: "बंद करा",
    save: "जतन करा",
    cancel: "रद्द करा",
    pulseSurveyTitle: "२-प्रश्नांचे जलद पुनरावलोकन",
    pulseQ1: "हा तपासणी निकाल तुम्हाला किती स्पष्ट समजला?",
    pulseQ2: "पुढील उपचारांबाबत तुम्हाला किती आत्मविश्वास आणि सुरक्षित वाटते?",
    pulseSubmit: "अभिप्राय पाठवा",
    pulseThankYou: "धन्यवाद! तुमच्या अभिप्रायाने आम्हाला अधिक चांगली सेवा देण्यास मदत होते.",
    callbackSuccess: "कॉलबॅकची विनंती नोंदवली! समन्वयक २ तासांत संपर्क साधतील.",
    simulatedDisclaimer: "हेल्थकेअर हॅकाथॉनसाठी काल्पनिक प्रात्यक्षिक. खरा डेटा वापरलेला नाही.",
    urgentBadge: "तातडीची पाठपुरावा तपासणी",
    highBadge: "प्राधान्य पाठपुरावा",
    routineBadge: "नियमित पाठपुरावा",
  },
  ar: {
    appName: "CareLoop",
    tagline: "كل نتيجة. كل خطوة. مغلقة بنجاح.",
    patientPortalTitle: "بوابة المريض ومركز متابعة الرعاية",
    resultTitle: "نتيجة فحصك الطبي",
    resultDate: "تاريخ الفحص",
    whatThisMeans: "ماذا تعني هذه النتيجة بلغة بسيطة",
    whatHappensNext: "ما هي الخطوات التالية",
    whatINeedToDo: "ما الذي يتعين عليك فعله اليوم",
    doYouUnderstand: "هل فهمت نتيجة الفحص بشكل واضح؟",
    yes: "نعم، فهمت النتيجة",
    questions: "لدي بعض الاستفسارات",
    callMe: "يرجى الاتصال بي",
    reassurance: "الكشف المبكر يمنحك أفضل خيارات العلاج والتعافي. لست وحدك، فريق الرعاية بجانبك في كل خطوة.",
    talkToSomeone: "تحدث إلى منسق الرعاية",
    bookAppointment: "حجز أو تأكيد الموعد الطبي",
    requestCallback: "طلب اتصال هاتفي مجاني",
    statusAcknowledged: "تم تأكيد استلام النتيجة من قبلك",
    statusPending: "في انتظار تأكيد اطلاعك",
    statusInProgress: "خطة الرعاية قيد المتابعة",
    statusClosed: "تم إغلاق حلقة الرعاية بنجاح ✓",
    language: "اللغة",
    notificationSent: "تم إرسال الإشعار",
    notificationDelivered: "تم التسليم لهاتفك",
    notificationRead: "تمت القراءة من قبلك",
    notificationAcknowledged: "تم التأكيد بنجاح",
    back: "رجوع",
    close: "إغلاق",
    save: "حفظ",
    cancel: "إلغاء",
    pulseSurveyTitle: "استبيان سريع من سؤالين",
    pulseQ1: "ما مدى وضوح نتيجة الفحص بالنسبة لك؟",
    pulseQ2: "ما مدى شعورك بالاطمئنان والثقة تجاه الخطوات العلاجية التالية؟",
    pulseSubmit: "إرسال التقييم",
    pulseThankYou: "شكراً لك! تقييمك يساعدنا على تقديم رعاية أفضل.",
    callbackSuccess: "تم استلام طلبك! سيتصل بك منسق الرعاية خلال ساعتين.",
    simulatedDisclaimer: "عرض توضيحي وتجريبي للهاكاثون الصحي. لا يحتوي على بيانات مرضى حقيقية.",
    urgentBadge: "متابعة عاجلة",
    highBadge: "متابعة ذات أولوية",
    routineBadge: "متابعة روتينية",
  },
};

export const plainScreeningExplanations: Record<string, Record<Lang, ScreeningInfo>> = {
  Mammogram: {
    en: {
      title: "Mammogram Breast Check",
      whatThisMeans: "Your breast scan showed an area that requires a closer look. Most spots turn out not to be cancer (such as dense tissue or benign cysts), but a diagnostic scan or ultrasound is essential to be completely sure.",
      whatHappensNext: [
        "Your care coordinator will help schedule a diagnostic ultrasound or focused mammogram.",
        "A specialist breast clinician will review the detailed images.",
        "You will receive a clear, personalized care plan and support."
      ],
      reassurance: "Checking this promptly is standard medical practice and protects your health. We are here to guide you.",
      nextSteps: "Confirm your result and speak with our breast care coordinator.",
    },
    es: {
      title: "Mamografía de Seno",
      whatThisMeans: "Su mamografía mostró un área que necesita una revisión más detallada. En la gran mayoría de los casos no es cáncer (suele ser tejido denso o quistes benignos), pero se necesita un ultrasonido o toma adicional para estar completamente seguros.",
      whatHappensNext: [
        "Su coordinadora le ayudará a agendar un ultrasonido o mamografía diagnóstica.",
        "Un especialista en salud mamaria revisará las imágenes con usted.",
        "Recibirá un plan de atención claro y acompañamiento constante."
      ],
      reassurance: "Revisar esto a tiempo es lo más seguro y habitual. Estamos a su lado en cada momento.",
      nextSteps: "Confirme que vio el resultado y hable con su coordinadora de salud.",
    },
    hi: {
      title: "मैमोग्राम स्तन जांच",
      whatThisMeans: "आपकी जांच में एक ऐसा हिस्सा दिखा है जिसे दोबारा ध्यान से देखना ज़रूरी है। ज्यादातर मामलों में यह कैंसर नहीं होता (जैसे सिस्ट या घने ऊतक), लेकिन पूरी तसल्ली के लिए एक अल्ट्रासाउंड या बारीक जांच आवश्यक है।",
      whatHappensNext: [
        "देखभाल समन्वयक अतिरिक्त जांच (अल्ट्रासाउंड) तय करने में मदद करेंगे।",
        "विशेषज्ञ डॉक्टर रिपोर्ट देखकर सही सलाह देंगे।",
        "आपको पूरी प्रक्रिया में लगातार सहयोग मिलेगा।"
      ],
      reassurance: "समय पर आगे की जांच करवाना आपकी सुरक्षा के लिए सबसे बेहतर है। घबराएं नहीं, हम आपके साथ हैं।",
      nextSteps: "परिणाम की पुष्टि करें और देखभाल समन्वयक से बात करें।",
    },
    mr: {
      title: "मॅमोग्राम तपासणी",
      whatThisMeans: "तपासणीत एक भाग दिसला आहे ज्याची अधिक बारीक तपासणी आवश्यक आहे. बऱ्याचदा ही सामान्य गाठ किंवा सिस्ट असते आणि कर्करोग नसतो, पण पूर्ण खात्रीसाठी सोनोग्राफी आवश्यक आहे.",
      whatHappensNext: [
        "समन्वयक पुढील तपासणीसाठी तारीख मिळवून देतील.",
        "तज्ज्ञ डॉक्टर अहवाल तपासून पुढचा सल्ला देतील.",
        "प्रत्येक पायरीवर तुम्हाला पूर्ण मार्गदर्शन मिळेल."
      ],
      reassurance: "लवकर तपासणी करून घेणे हा आरोग्यासाठी उत्तम निर्णय आहे. काळजी करू नका.",
      nextSteps: "अहवाल पाहिल्याची नोंद करा आणि समन्वयकांशी संपर्क साधा.",
    },
    ar: {
      title: "فحص الثدي الشعاعي (الماموجرام)",
      whatThisMeans: "أظهر الفحص منطقة تحتاج إلى متابعة إضافية ودقيقة. في معظم الحالات لا يكون الأمر ورمًا خبيثًا (بل أنسجة كثيفة أو أكياس حميدة)، ولكن إجراء فحص بالموجات فوق الصوتية ضروري للتأكد التام.",
      whatHappensNext: [
        "سيساعدك منسق الرعاية في حجز موعد فحص بالأمواج فوق الصوتية.",
        "سيقوم طبيب مختص بمراجعة الصور وتقديم الاستشارة الدقيقة.",
        "ستحصلين على خطة متابعة واضحة مع دعم كامل."
      ],
      reassurance: "المتابعة السريعة إجراء وقائي روتيني لحماية صحتك واطمئنانك.",
      nextSteps: "يرجى تأكيد اطلاعك على النتيجة والتحدث مع منسق الرعاية.",
    },
  },
  "HbA1c (Diabetes)": {
    en: {
      title: "HbA1c Blood Sugar Check",
      whatThisMeans: "Your HbA1c test measures your average blood sugar over the last 3 months. Your reading is higher than the recommended healthy target, which means your body needs help managing glucose.",
      whatHappensNext: [
        "Your doctor will review diet, physical activity, and medication options.",
        "A follow-up visit will be scheduled to personalize your care plan.",
        "A diabetes educator will provide practical tips for daily meals."
      ],
      reassurance: "Blood sugar can be brought back into balance with the right daily steps and guidance.",
      nextSteps: "Confirm your reading and discuss medication adjustments.",
    },
    es: {
      title: "Control de Glucosa HbA1c",
      whatThisMeans: "Esta prueba mide el promedio de azúcar en su sangre durante los últimos 3 meses. Su valor está más alto de lo recomendado, lo que indica que su cuerpo necesita apoyo para controlar la glucosa.",
      whatHappensNext: [
        "Su médico evaluará opciones de alimentación, actividad y medicamentos.",
        "Se programará una cita para ajustar su plan de salud.",
        "Un educador en diabetes le dará consejos prácticos para su día a día."
      ],
      reassurance: "Con pequeños cambios y el apoyo correcto, el azúcar en sangre se puede normalizar.",
      nextSteps: "Confirme su resultado y coordine su cita con el médico.",
    },
    hi: {
      title: "HbA1c ब्लड शुगर टेस्ट",
      whatThisMeans: "यह जांच पिछले 3 महीनों का औसत शुगर स्तर बताती है। आपका स्तर सामान्य से अधिक आया है, जिसका मतलब है कि शुगर नियंत्रण के लिए उपचार और खानपान में बदलाव चाहिए।",
      whatHappensNext: [
        "डॉक्टर दवाओं और आहार योजना की समीक्षा करेंगे।",
        "फॉलो-अप परामर्श तय किया जाएगा।",
        "शुगर को नियंत्रित रखने के आसान तरीके समझाए जाएंगे।"
      ],
      reassurance: "सही मार्गदर्शन और दवाओं से शुगर को आसानी से सामान्य स्तर पर लाया जा सकता है।",
      nextSteps: "परिणाम की पुष्टि करें और डॉक्टर से सलाह लें।",
    },
    mr: {
      title: "HbA1c रक्त शर्करा तपासणी",
      whatThisMeans: "ही चाचणी मागील ३ महिन्यांची सरासरी साखर पातळी दाखवते. तुमची पातळी वाढलेली आहे, त्यामुळे आहारावर आणि औषधांवर लक्ष देणे गरजेचे आहे.",
      whatHappensNext: [
        "डॉक्टर औषधोपचार आणि जीवनशैलीतील बदल सुचवतील.",
        "पुढील भेट ठरवली जाईल.",
        "मधुमेह नियंत्रणासाठी मार्गदर्शन मिळेल."
      ],
      reassurance: "योग्य काळजी आणि औषधांमुळे साखर पुन्हा नियंत्रणात येऊ शकते.",
      nextSteps: "नोंद पूर्ण करा आणि डॉक्टरांशी बोला.",
    },
    ar: {
      title: "فحص السكر التراكمي (HbA1c)",
      whatThisMeans: "يقيس هذا الفحص معدل السكر في الدم خلال الأشهر الثلاثة الماضية. نتيجتك أعلى من المعدل المستهدف، مما يتطلب تعديل خطتك العلاجية ونمط الحياة.",
      whatHappensNext: [
        "سيراجع الطبيب خيارات الأدوية والنظام الغذائي المناسب.",
        "سيتم حجز موعد استشاري لمتابعة التحسن.",
        "ستتلقى إرشادات عملية للتحكم في مستويات السكر يوميًا."
      ],
      reassurance: "يمكن ضبط مستوى السكر بسهولة مع التوجيه الطبي المناسب والالتزام.",
      nextSteps: "أكد استلام النتيجة وسيقوم الفريق بجدولة موعدك.",
    },
  },
  "Blood Pressure": {
    en: {
      title: "Blood Pressure Reading",
      whatThisMeans: "Your blood pressure reading was elevated above the normal range. High pressure works your heart and blood vessels harder than normal and should be brought down steadily.",
      whatHappensNext: [
        "A repeat blood pressure check within 1 to 2 weeks.",
        "Review of daily salt intake, physical movement, and stress levels.",
        "Start or adjust safe blood pressure medication if needed."
      ],
      reassurance: "High blood pressure is very common and very treatable. Simple daily habits make a big difference.",
      nextSteps: "Log your confirmation and prepare for a follow-up blood pressure check.",
    },
    es: {
      title: "Lectura de Presión Arterial",
      whatThisMeans: "Su presión arterial estuvo por encima del rango normal. La presión alta hace que su corazón trabaje con más esfuerzo y debe controlarse para proteger su salud.",
      whatHappensNext: [
        "Una segunda toma de presión en 1 a 2 semanas.",
        "Revisión de hábitos de sal, ejercicio y descanso.",
        "Inicio o ajuste de medicamento adecuado si es necesario."
      ],
      reassurance: "La presión alta es muy tratable. Controlarla previene problemas en el corazón.",
      nextSteps: "Confirme su lectura y prepare su revisión de seguimiento.",
    },
    hi: {
      title: "रक्तचाप (ब्लड प्रेशर) जांच",
      whatThisMeans: "आपका ब्लड प्रेशर सामान्य से ज़्यादा पाया गया है। अधिक दबाव से दिल पर भार पड़ता है, इसलिए इसे समय रहते नियंत्रित करना आवश्यक है।",
      whatHappensNext: [
        "1 से 2 सप्ताह में दोबारा बीपी जांचा जाएगा।",
        "नमक और खानपान में आवश्यक सुझाव दिए जाएंगे।",
        "ज़रूरत पड़ने पर सुरक्षित दवा शुरू की जाएगी।"
      ],
      reassurance: "ब्लड प्रेशर का इलाज बहुत सरल और असरदार है। चिंता न करें।",
      nextSteps: "परिणाम पुष्टि करें और बीपी चेकअप के लिए समय तय करें।",
    },
    mr: {
      title: "रक्तदाब तपासणी",
      whatThisMeans: "तुमचा रक्तदाब नेहमीपेक्षा जास्त आला आहे. यामुळे हृदयावर ताण येतो, म्हणून तो नियंत्रणात आणणे गरजेचे आहे.",
      whatHappensNext: [
        "१-२ आठवड्यांत पुन्हा रक्तदाब मोजला जाईल.",
        "मीठ व आहारासंबंधी सल्ला दिला जाईल.",
        "आवश्यकतेनुसार योग्य गोळ्या सुरू केल्या जातील."
      ],
      reassurance: "रक्तदाब नियंत्रणात ठेवणे सहज शक्य आहे. काळजीचे कारण नाही.",
      nextSteps: "अहवाल मान्य करा आणि पुढील तपासणीसाठी तयार राहा.",
    },
    ar: {
      title: "قياس ضغط الدم",
      whatThisMeans: "أظهرت القراءة ارتفاعًا في ضغط الدم عن المستوى الطبيعي. الضغط المرتفع يزيد الجهد على القلب ويجب خفضه تدريجيًا لحماية صحتك.",
      whatHappensNext: [
        "إعادة قياس ضغط الدم خلال أسبوع إلى أسبوعين.",
        "مراجعة كمية الملح في الطعام والنشاط البدني.",
        "بدء أو تعديل علاج دوائي آمن عند الحاجة."
      ],
      reassurance: "ارتفاع ضغط الدم أمر شائع للغاية وعلاجه فعال وسهل عند الالتزام.",
      nextSteps: "أكد القراءة وسيتم التنسيق لإعادة الفحص.",
    },
  },
  "FIT / Colon Cancer": {
    en: {
      title: "Stool Screening Check (FIT)",
      whatThisMeans: "The test detected microscopic traces of blood in the stool. This does not mean you have cancer—often it is caused by small non-cancerous polyps, hemorrhoids, or mild inflammation. A colonoscopy will find the exact cause.",
      whatHappensNext: [
        "Referral to an endoscopy specialist.",
        "Pre-procedure guidance and preparation instructions.",
        "A diagnostic colonoscopy to locate and safely remove any polyps."
      ],
      reassurance: "Catching and removing polyps early prevents cancer before it can ever develop.",
      nextSteps: "Confirm your result to fast-track your specialist appointment.",
    },
    es: {
      title: "Prueba de Detección de Colon (FIT)",
      whatThisMeans: "La prueba encontró pequeñas trazas de sangre oculta. Esto NO significa que tenga cáncer; con frecuencia se debe a pólipos benignos, hemorroides o inflamación. Una colonoscopia mostrará la causa exacta.",
      whatHappensNext: [
        "Derivación con un especialista en gastroenterología.",
        "Instrucciones claras para la preparación del estudio.",
        "Una colonoscopia diagnóstica para retirar pólipos si los hubiera."
      ],
      reassurance: "Retirar pólipos a tiempo previene el cáncer por completo. Es el mejor paso preventivo.",
      nextSteps: "Confirme su resultado para tramitar su consulta con el especialista.",
    },
    hi: {
      title: "आंतों की जांच (FIT टेस्ट)",
      whatThisMeans: "जांच में खून के हल्के अंश पाए गए हैं। इसका यह मतलब बिल्कुल नहीं कि कैंसर है—अक्सर यह बवासीर या छोटी गांठ (पॉलीप) के कारण होता है। कोलोनोस्कोपी से सही कारण का पता चलेगा।",
      whatHappensNext: [
        "पेट रोग विशेषज्ञ (गैस्ट्रोएंटेरोलॉजिस्ट) से परामर्श।",
        "जांच से पहले की आसान तैयारी के निर्देश।",
        "कोलोनोस्कोपी द्वारा किसी भी छोटी गांठ को सुरक्षित हटाना।"
      ],
      reassurance: "शुरुआती गांठ को हटा देने से कैंसर का खतरा हमेशा के लिए टल जाता है।",
      nextSteps: "परिणाम की पुष्टि करें ताकि विशेषज्ञ से संपर्क कराया जा सके।",
    },
    mr: {
      title: "आतड्यांची तपासणी (FIT)",
      whatThisMeans: "तपासणीत रक्ताचे सूक्ष्म अंश आढळले आहेत. याचा अर्थ कर्करोग असा मुळीच नाही; मुळव्याध किंवा साध्या गाठींमुळेही असे होते. कोलोनोस्कोपीने नेमके कारण समजेल.",
      whatHappensNext: [
        "पोटविकार तज्ज्ञांकडे पाठवले जाईल.",
        "तपासणीच्या पूर्वतयारीची माहिती दिली जाईल.",
        "कोलोनोस्कोपी करून आवश्यक असल्यास गाठ काढली जाईल."
      ],
      reassurance: "वेळेत गाठ काढून टाकल्यास कर्करोगाचा धोका पूर्णपणे टळतो.",
      nextSteps: "अहवाल स्वीकारून तज्ज्ञांची भेट निश्चित करा.",
    },
    ar: {
      title: "فحص الدم الخفي في البراز (FIT)",
      whatThisMeans: "أظهر الفحص وجود آثار طفيفة من الدم في البراز. هذا لا يعني الإصابة بالسرطان إطلاقًا، فغالبًا ما يكون ناتجًا عن بواسير أو زوائد لحمية حميدة أو التهاب بسيط. سيحدد منظار القولون السبب بدقة.",
      whatHappensNext: [
        "تحويل إلى طبيب الجهاز الهضمي والمناظير.",
        "تزويدك بالتعليمات الواضحة للتحضير للفحص.",
        "إجراء منظار تشخيصي وإزالة أي زوائد لحمية إن وُجدت."
      ],
      reassurance: "إزالة الزوائد اللحمية مبكرًا يقي تمامًا من تحولها إلى أورام.",
      nextSteps: "يرجى تأكيد اطلاعك لتحويلك مباشرة إلى الطبيب المختص.",
    },
  },
  "Pap Smear": {
    en: {
      title: "Cervical Screening (Pap Smear)",
      whatThisMeans: "Some cervical cells looked slightly different from normal cells. In most women, these changes are mild and caused by common, harmless infections that clear on their own or with minor treatment.",
      whatHappensNext: [
        "A follow-up review with your women's health clinician.",
        "A simple closer look called a colposcopy if recommended.",
        "Clear guidance on repeat testing schedule."
      ],
      reassurance: "Routine cervical screening is designed to catch cell changes years before they could ever become serious.",
      nextSteps: "Confirm your result to discuss your follow-up timeline.",
    },
    es: {
      title: "Citología Cervical (Papanicolau)",
      whatThisMeans: "Algunas células del cuello uterino mostraron cambios leves. En la gran mayoría de los casos son cambios menores producidos por inflamación común que se resuelven fácilmente.",
      whatHappensNext: [
        "Consulta de revisión con ginecología o su médico de cabecera.",
        "Un examen visual detallado (colposcopia) si se considera necesario.",
        "Plan claro de seguimiento y fechas de control."
      ],
      reassurance: "Esta prueba está hecha precisamente para detectar cambios a tiempo y prevenir problemas mayores.",
      nextSteps: "Confirme la recepción para coordinar su revisión.",
    },
    hi: {
      title: "पैप स्मीयर (गर्भाशय ग्रीवा जांच)",
      whatThisMeans: "जांच में कुछ कोशिकाओं में हल्का बदलाव दिखा है। यह बहुत सामान्य है और आमतौर पर किसी सामान्य संक्रमण या सूजन से होता है जो आसानी से ठीक हो जाता है।",
      whatHappensNext: [
        "महिला रोग विशेषज्ञ (स्त्री रोग डॉक्टर) से परामर्श।",
        "ज़रूरत पड़ने पर एक आसान जांच (कोलपोस्कोपी)।",
        "अगली जांच का समय तय करना।"
      ],
      reassurance: "यह जांच किसी भी समस्या को कई साल पहले ही पकड़ लेती है ताकि समय पर समाधान हो सके।",
      nextSteps: "परिणाम की पुष्टि करें और डॉक्टर से सलाह लें।",
    },
    mr: {
      title: "पॅप स्मीअर चाचणी",
      whatThisMeans: "काही पेशींमध्ये सौम्य बदल दिसून आला आहे. हे बहुतांश महिलांमध्ये साध्या संसर्गामुळे होते आणि उपचाराने पूर्ण बरे होते.",
      whatHappensNext: [
        "स्त्रीरोग तज्ज्ञांशी चर्चा.",
        "गरज भासल्यास साधी तपासणी (कोल्पोस्कोपी).",
        "पुढील तपासणीचे वेळापत्रक ठरवणे."
      ],
      reassurance: "वेळेआधी बदल समजल्यामुळे आरोग्य पूर्णपणे सुरक्षित राहते.",
      nextSteps: "अहवाल मान्य करा आणि डॉक्टरांचे मार्गदर्शन घ्या.",
    },
    ar: {
      title: "فحص مسحة عنق الرحم (Pap Smear)",
      whatThisMeans: "أظهرت النتيجة وجود تغيرات طفيفة في بعض الخلايا. لدى معظم النساء تكون هذه التغيرات سطحية ناجمة عن التهابات عادية يسهل علاجها وتزول تلقائيًا.",
      whatHappensNext: [
        "مراجعة مع طبيبة النساء والولادة.",
        "فحص بصري مكبر بسيط (تنظير مهبلي) عند الحاجة.",
        "تحديد موعد الفحص الدوري القادم."
      ],
      reassurance: "الهدف من هذا الفحص هو حمايتك واكتشاف أي تغيرات قبل سنوات من حدوث أي ضرر.",
      nextSteps: "أكدي استلامك للنتيجة لتحديد موعد المراجعة النسائية.",
    },
  },
  "Newborn Hearing Screen": {
    en: {
      title: "Baby's Hearing Screening",
      whatThisMeans: "The screening did not show a clear response in one or both ears today. This is very common in newborns (often caused by tiny fluid or vernix in the ear canal after birth) and needs a quick repeat check.",
      whatHappensNext: [
        "A gentle repeat hearing screen within 2 to 4 weeks.",
        "Support from our infant audiology care team.",
        "Comfortable, painless testing while baby sleeps."
      ],
      reassurance: "Most babies who 'refer' on the first screen pass with completely normal hearing on the repeat test.",
      nextSteps: "Confirm your baby's repeat screening date.",
    },
    es: {
      title: "Tamizaje Auditivo del Recién Nacido",
      whatThisMeans: "La prueba no obtuvo una respuesta clara en uno o ambos oídos hoy. Esto es muy común en los bebés recién nacidos (por líquido residual del parto en el canal auditivo) y requiere una segunda revisión sencilla.",
      whatHappensNext: [
        "Una segunda prueba suave dentro de 2 a 4 semanas.",
        "Acompañamiento del equipo de audiología infantil.",
        "Un estudio completamente indoloro mientras el bebé duerme."
      ],
      reassurance: "La gran mayoría de los bebés pasan la segunda prueba con audición totalmente normal.",
      nextSteps: "Confirme la fecha para la repetición del estudio del bebé.",
    },
    hi: {
      title: "नवजात शिशु की सुनने की जांच",
      whatThisMeans: "आज की जांच में एक या दोनों कानों से पूरी प्रतिक्रिया नहीं मिली। नवजात बच्चों में यह बहुत आम है (अक्सर जन्म के समय कान में हल्का पानी रह जाने से होता है) और दोबारा जांच ज़रूरी है।",
      whatHappensNext: [
        "2 से 4 सप्ताह में दोबारा आसान जांच।",
        "शिशु कान विशेषज्ञ टीम का सहयोग।",
        "बच्चे के सोते समय दर्द-रहित जांच।"
      ],
      reassurance: "पहली बार में रेफर होने वाले ज्यादातर बच्चे दूसरी जांच में बिल्कुल सामान्य पाए जाते हैं।",
      nextSteps: "बच्चे की दोबारा जांच की तारीख सुनिश्चित करें।",
    },
    mr: {
      title: "बाळाची श्रवण तपासणी",
      whatThisMeans: "आजच्या चाचणीत एका किंवा दोन्ही कानांतून स्पष्ट प्रतिसाद मिळाला नाही. नवजात बाळामध्ये कानात द्रव राहिल्याने असे होणे सामान्य आहे आणि फेरतपासणी आवश्यक आहे.",
      whatHappensNext: [
        "२ ते ४ आठवड्यांत पुन्हा साधी तपासणी.",
        "बाल कान तज्ज्ञांचे मार्गदर्शन.",
        "बाळ झोपलेले असताना होणारी वेदनारहित चाचणी."
      ],
      reassurance: "पुढील तपासणीत बहुतांश बाळांची ऐकण्याची क्षमता पूर्णपणे उत्तम निघते.",
      nextSteps: "बाळाच्या फेरतपासणीची तारीख निश्चित करा.",
    },
    ar: {
      title: "فحص السمع لحديثي الولادة",
      whatThisMeans: "لم يُظهر الفحص استجابة واضحة في إحدى الأذنين أو كلتيهما اليوم. هذا أمر شائع جدًا عند الرضع (بسبب وجود بقايا سوائل ما بعد الولادة في القناة السمعية) ويتطلب إعادة الفحص ببساطة.",
      whatHappensNext: [
        "إعادة فحص لطيفة وغير مؤلمة خلال أسبوعين إلى 4 أسابيع.",
        "إشراف من أخصائيي سمعيات الأطفال.",
        "يتم الفحص بهدوء وراحة تامة أثناء نوم الرضيع."
      ],
      reassurance: "معظم الأطفال الذين يحتاجون لإعادة الفحص يظهرون سمعًا سليمًا وطبيعيًا تمامًا في المرة الثانية.",
      nextSteps: "أكد الاطلاع لتأكيد موعد فحص الإعادة للمولود.",
    },
  },
  "Lipid Panel": {
    en: {
      title: "Lipid Cholesterol Panel",
      whatThisMeans: "Your blood test showed that LDL ('bad') cholesterol or triglycerides are above the target levels. Over time, high cholesterol can build up in blood vessels.",
      whatHappensNext: [
        "Cardiovascular risk assessment with your primary doctor.",
        "Heart-healthy nutrition and active lifestyle guidance.",
        "Prescription medication if needed to safely protect your heart."
      ],
      reassurance: "Cholesterol numbers respond very well to targeted dietary changes and modern treatments.",
      nextSteps: "Confirm your test result and review heart-health recommendations.",
    },
    es: {
      title: "Perfil de Colesterol y Lípidos",
      whatThisMeans: "Su análisis mostró colesterol LDL ('malo') o triglicéridos por encima de las metas saludables. Con el tiempo, esto puede acumularse en las arterias.",
      whatHappensNext: [
        "Evaluación de salud cardiovascular con su médico.",
        "Plan de alimentación saludable para el corazón y actividad.",
        "Tratamiento médico protector si se considera oportuno."
      ],
      reassurance: "El colesterol mejora notablemente con buenos hábitos y el tratamiento adecuado.",
      nextSteps: "Confirme su resultado y revise las sugerencias médicas.",
    },
    hi: {
      title: "लिपिड प्रोफाइल (कोलेस्ट्रॉल) जांच",
      whatThisMeans: "आपकी जांच में एलडीएल ('खराब') कोलेस्ट्रॉल सामान्य से अधिक आया है। लंबे समय तक बढ़ा हुआ कोलेस्ट्रॉल रक्त नलिकाओं में जम सकता है।",
      whatHappensNext: [
        "डॉक्टर के साथ हृदय स्वास्थ्य का आकलन।",
        "हार्ट-फ्रेंडली भोजन और व्यायाम के सुझाव।",
        "ज़रूरत पड़ने पर कोलेस्ट्रॉल कम करने की सुरक्षित दवा।"
      ],
      reassurance: "खानपान में छोटे सुधार और दवाओं से कोलेस्ट्रॉल को आसानी से नियंत्रित किया जा सकता है।",
      nextSteps: "परिणाम की पुष्टि करें और डॉक्टर की सलाह देखें।",
    },
    mr: {
      title: "कोलेस्टेरॉल तपासणी",
      whatThisMeans: "रक्त तपासणीत खराब कोलेस्टेरॉलचे प्रमाण वाढलेले दिसले आहे. जास्त कोलेस्टेरॉल रक्तवाहिन्यांवर परिणाम करू शकते.",
      whatHappensNext: [
        "डॉक्टरांकडून हृदय आरोग्याची तपासणी.",
        "पौष्टिक आहार व व्यायामाचे मार्गदर्शन.",
        "आवश्यकतेनुसार सुरक्षित औषधोपचार."
      ],
      reassurance: "योग्य आहार आणि औषधांनी कोलेस्टेरॉल सहज नियंत्रणात आणता येते.",
      nextSteps: "अहवाल स्वीकारा आणि पुढील सल्ला मिळवा.",
    },
    ar: {
      title: "فحص دهون الدم والكوليسترول",
      whatThisMeans: "أظهرت النتيجة ارتفاعًا في الكوليسترول الضار (LDL) أو الدهون الثلاثية عن المعدل المثالي. تراكم الدهون مع الوقت قد يؤثر على الشرايين والقلب.",
      whatHappensNext: [
        "تقييم صحة القلب والشرايين مع طبيبك.",
        "إرشادات غذائية وتمارين لتعزيز صحة الأوعية الدموية.",
        "بدء علاج دوائي خافض للدهون إذا دعت الحاجة لسلامتك."
      ],
      reassurance: "يمكن خفض الكوليسترول بفاعلية كبيرة من خلال التغذية السليمة والعلاج المناسب.",
      nextSteps: "أكد استلام النتيجة واطلع على نصائح طبيبك.",
    },
  },
  "Lung Nodule CT": {
    en: {
      title: "Chest CT Scan (Lung Check)",
      whatThisMeans: "The scan found a small spot (nodule) on your lung. Most lung nodules are harmless scars from past chest colds or minor infections, but a repeat scan or specialist review is needed to verify stability.",
      whatHappensNext: [
        "Review by a pulmonology specialist.",
        "A follow-up low-dose CT in 3 to 6 months to confirm the spot does not grow.",
        "Personalized respiratory health plan."
      ],
      reassurance: "Small nodules are very common findings on CT scans and the vast majority are completely benign.",
      nextSteps: "Confirm your result to register your surveillance follow-up.",
    },
    es: {
      title: "Tomografía de Tórax (Revisión Pulmonar)",
      whatThisMeans: "El estudio detectó un pequeño nódulo (manchita) en el pulmón. La gran mayoría son cicatrices benignas de infecciones pasadas o catarros antiguos, pero requiere seguimiento para verificar que no cambie.",
      whatHappensNext: [
        "Revisión por un especialista en neumología.",
        "Una tomografía de control en 3 a 6 meses para asegurar estabilidad.",
        "Plan de cuidado respiratorio personalizado."
      ],
      reassurance: "Los pequeños nódulos son hallazgos muy frecuentes y la inmensa mayoría son benignos.",
      nextSteps: "Confirme su resultado para activar su plan de vigilancia médica.",
    },
    hi: {
      title: "फेफड़ों की सीटी स्कैन जांच",
      whatThisMeans: "स्कैन में फेफड़े पर एक छोटा सा धब्बा (नोड्यूल) दिखा है। ज्यादातर धब्बे पुरानी खांसी या मामूली संक्रमण के सामान्य निशान होते हैं, लेकिन इसकी स्थिरता जांचने के लिए निगरानी ज़रूरी है।",
      whatHappensNext: [
        "फेफड़ा रोग विशेषज्ञ (पल्मोनोलॉजिस्ट) द्वारा समीक्षा।",
        "3 से 6 महीने बाद धब्बा न बढ़ने की पुष्टि हेतु दोबारा स्कैन।",
        "सांस और फेफड़ों की सुरक्षा का परामर्श।"
      ],
      reassurance: "ऐसे छोटे धब्बे बहुत आम होते हैं और इनमें से 95% से अधिक पूरी तरह हानिरहित होते हैं।",
      nextSteps: "परिणाम पुष्टि करें और फॉलो-अप के लिए पंजीकरण करें।",
    },
    mr: {
      title: "छातीची सीटी स्कॅन तपासणी",
      whatThisMeans: "स्कॅनमध्ये फुफ्फुसावर एक लहान ठिपका (नोड्यूल) दिसला आहे. जुन्या खोकल्याच्या किंवा संसर्गाच्या खुणांमुळे असे ठिपके अनेकदा दिसतात आणि ते सामान्य असतात.",
      whatHappensNext: [
        "फुफ्फुस विकार तज्ज्ञांकडून अहवाल तपासणी.",
        "३-६ महिन्यांनी ठिपका स्थिर असल्याची खात्री करण्यासाठी स्कॅन.",
        "श्वसन आरोग्यासाठी सल्ला."
      ],
      reassurance: "असे लहान ठिपके सामान्य असतात आणि बहुतांश वेळा अजिबात धोकादायक नसतात.",
      nextSteps: "अहवाल नोंदवा आणि डॉक्टरांशी संपर्क साधा.",
    },
    ar: {
      title: "الأشعة المقطعية للصدر (فحص الرئتين)",
      whatThisMeans: "أظهر الفحص وجود بقعة صغيرة (عُقيدة) في الرئة. معظم العُقيدات هي ندبات حميدة ناتجة عن نزلات صدرية سابقة أو التهابات قديمة، ولكن يلزم تصوير متابعة للتأكد من استقرارها.",
      whatHappensNext: [
        "مراجعة النتائج مع طبيب أمراض الصدر والرئة.",
        "إجراء أشعة متابعة بعد 3 إلى 6 أشهر للتأكد من عدم تغير الحجم.",
        "خطة رعاية تنفسية مخصصة."
      ],
      reassurance: "العُقيدات الصغيرة شائعة جدًا في الأشعة المقطعية وأغلبها حميد وغير ضار تمامًا.",
      nextSteps: "أكد استلام النتيجة لتسجيل موعد متابعة الأشعة.",
    },
  },
};

export const t = (lang: Lang, key: string): string => {
  return translations[lang]?.[key] || translations.en[key] || key;
};

export const getScreeningExplanation = (screeningType: string, lang: Lang): ScreeningInfo => {
  const match = plainScreeningExplanations[screeningType];
  if (match && match[lang]) {
    return match[lang];
  }
  if (match && match.en) {
    return match.en;
  }
  // Generic fallback
  return {
    title: screeningType,
    whatThisMeans: "Your screening test result requires medical review and follow-up care.",
    whatHappensNext: [
      "A care coordinator will assist in scheduling your next appointment.",
      "A clinician will review all details with you.",
      "A personalized care and monitoring plan will be established."
    ],
    reassurance: "Early follow-up gives you the best care choices. Your team is here to support you.",
    nextSteps: "Confirm your result to begin your care loop.",
  };
};
