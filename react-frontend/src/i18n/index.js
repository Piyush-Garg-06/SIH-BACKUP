import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.services': 'Services',
      'nav.healthCard': 'Health Card',
      'nav.doctors': 'For Doctors',
      'nav.employers': 'For Employers',
      'nav.contact': 'Contact',
      'nav.login': 'Login',
      'nav.register': 'Register',
      'nav.logout': 'Logout',

      // Common
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.submit': 'Submit',
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.warning': 'Warning',
      'common.info': 'Information',

      // Authentication
      'auth.login': 'Login',
      'auth.register': 'Register',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.confirmPassword': 'Confirm Password',
      'auth.forgotPassword': 'Forgot Password?',
      'auth.rememberMe': 'Remember Me',
      'auth.loginWithOtp': 'Login with OTP',
      'auth.loginWithAadhaar': 'Login with Aadhaar',

      // User Roles
      'role.worker': 'Migrant Worker',
      'role.doctor': 'Healthcare Provider',
      'role.manager': 'Employer/Manager',
      'role.admin': 'Administrator',

      // Health Card
      'healthCard.title': 'Digital Health Card',
      'healthCard.generate': 'Generate Health Card',
      'healthCard.scan': 'Scan Health Card',
      'healthCard.uniqueId': 'Unique ID',
      'healthCard.validUntil': 'Valid Until',
      'healthCard.status': 'Status',

      // Dashboard
      'dashboard.welcome': 'Welcome',
      'dashboard.healthRecords': 'Health Records',
      'dashboard.appointments': 'Appointments',
      'dashboard.notifications': 'Notifications',
      'dashboard.profile': 'Profile',

      // Forms
      'form.personalInfo': 'Personal Information',
      'form.healthInfo': 'Health Information',
      'form.employmentInfo': 'Employment Information',
      'form.contactInfo': 'Contact Information',
      'form.emergencyContact': 'Emergency Contact',

      // Government Schemes
      'schemes.title': 'Government Health Schemes',
      'schemes.apply': 'Apply for Scheme',
      'schemes.benefits': 'Benefits',
      'schemes.eligibility': 'Eligibility',

      // Notifications
      'notifications.appointment': 'Appointment Reminder',
      'notifications.checkup': 'Health Checkup Due',
      'notifications.scheme': 'Scheme Benefits Available',

      // Languages
      'lang.english': 'English',
      'lang.hindi': 'हिंदी',
      'lang.bengali': 'বাংলা',
      'lang.odia': 'ଓଡ଼ିଆ',
      'lang.malayalam': 'മലയാളം',
    }
  },
  hi: {
    translation: {
      // Navigation
      'nav.home': 'होम',
      'nav.about': 'हमारे बारे में',
      'nav.services': 'सेवाएं',
      'nav.healthCard': 'स्वास्थ्य कार्ड',
      'nav.doctors': 'डॉक्टर्स के लिए',
      'nav.employers': 'नियोक्ताओं के लिए',
      'nav.contact': 'संपर्क',
      'nav.login': 'लॉग इन',
      'nav.register': 'पंजीकरण',
      'nav.logout': 'लॉग आउट',

      // Common
      'common.save': 'सेव करें',
      'common.cancel': 'रद्द करें',
      'common.submit': 'सबमिट करें',
      'common.loading': 'लोड हो रहा है...',
      'common.error': 'त्रुटि',
      'common.success': 'सफलता',
      'common.warning': 'चेतावनी',
      'common.info': 'जानकारी',

      // Authentication
      'auth.login': 'लॉग इन',
      'auth.register': 'पंजीकरण',
      'auth.email': 'ईमेल',
      'auth.password': 'पासवर्ड',
      'auth.confirmPassword': 'पासवर्ड की पुष्टि करें',
      'auth.forgotPassword': 'पासवर्ड भूल गए?',
      'auth.rememberMe': 'मुझे याद रखें',
      'auth.loginWithOtp': 'OTP से लॉग इन',
      'auth.loginWithAadhaar': 'आधार से लॉग इन',

      // User Roles
      'role.worker': 'प्रवासी मजदूर',
      'role.doctor': 'स्वास्थ्य सेवा प्रदाता',
      'role.manager': 'नियोक्ता/प्रबंधक',
      'role.admin': 'प्रशासक',

      // Health Card
      'healthCard.title': 'डिजिटल स्वास्थ्य कार्ड',
      'healthCard.generate': 'स्वास्थ्य कार्ड जनरेट करें',
      'healthCard.scan': 'स्वास्थ्य कार्ड स्कैन करें',
      'healthCard.uniqueId': 'यूनिक आईडी',
      'healthCard.validUntil': 'मान्य तक',
      'healthCard.status': 'स्थिति',

      // Dashboard
      'dashboard.welcome': 'स्वागत है',
      'dashboard.healthRecords': 'स्वास्थ्य रिकॉर्ड',
      'dashboard.appointments': 'अपॉइंटमेंट',
      'dashboard.notifications': 'सूचनाएं',
      'dashboard.profile': 'प्रोफाइल',

      // Forms
      'form.personalInfo': 'व्यक्तिगत जानकारी',
      'form.healthInfo': 'स्वास्थ्य जानकारी',
      'form.employmentInfo': 'रोजगार जानकारी',
      'form.contactInfo': 'संपर्क जानकारी',
      'form.emergencyContact': 'आपातकालीन संपर्क',

      // Government Schemes
      'schemes.title': 'सरकारी स्वास्थ्य योजनाएं',
      'schemes.apply': 'योजना के लिए आवेदन करें',
      'schemes.benefits': 'लाभ',
      'schemes.eligibility': 'पात्रता',

      // Notifications
      'notifications.appointment': 'अपॉइंटमेंट रिमाइंडर',
      'notifications.checkup': 'स्वास्थ्य जांच बकाया',
      'notifications.scheme': 'योजना लाभ उपलब्ध',

      // Languages
      'lang.english': 'English',
      'lang.hindi': 'हिंदी',
      'lang.bengali': 'বাংলা',
      'lang.odia': 'ଓଡ଼ିଆ',
      'lang.malayalam': 'മലയാളം',
    }
  },
  bn: {
    translation: {
      // Navigation
      'nav.home': 'হোম',
      'nav.about': 'আমাদের সম্পর্কে',
      'nav.services': 'সেবা',
      'nav.healthCard': 'স্বাস্থ্য কার্ড',
      'nav.doctors': 'ডাক্তারদের জন্য',
      'nav.employers': 'নিয়োগকর্তাদের জন্য',
      'nav.contact': 'যোগাযোগ',
      'nav.login': 'লগ ইন',
      'nav.register': 'নিবন্ধন',
      'nav.logout': 'লগ আউট',

      // Common
      'common.save': 'সেভ করুন',
      'common.cancel': 'বাতিল করুন',
      'common.submit': 'জমা দিন',
      'common.loading': 'লোড হচ্ছে...',
      'common.error': 'ত্রুটি',
      'common.success': 'সফল',
      'common.warning': 'সতর্কতা',
      'common.info': 'তথ্য',

      // Authentication
      'auth.login': 'লগ ইন',
      'auth.register': 'নিবন্ধন',
      'auth.email': 'ইমেইল',
      'auth.password': 'পাসওয়ার্ড',
      'auth.confirmPassword': 'পাসওয়ার্ড নিশ্চিত করুন',
      'auth.forgotPassword': 'পাসওয়ার্ড ভুলে গেছেন?',
      'auth.rememberMe': 'আমাকে মনে রাখুন',
      'auth.loginWithOtp': 'OTP দিয়ে লগ ইন',
      'auth.loginWithAadhaar': 'আধার দিয়ে লগ ইন',

      // User Roles
      'role.worker': 'প্রবাসী শ্রমিক',
      'role.doctor': 'স্বাস্থ্যসেবা প্রদানকারী',
      'role.manager': 'নিয়োগকর্তা/ব্যবস্থাপক',
      'role.admin': 'প্রশাসক',

      // Health Card
      'healthCard.title': 'ডিজিটাল স্বাস্থ্য কার্ড',
      'healthCard.generate': 'স্বাস্থ্য কার্ড তৈরি করুন',
      'healthCard.scan': 'স্বাস্থ্য কার্ড স্ক্যান করুন',
      'healthCard.uniqueId': 'অনন্য আইডি',
      'healthCard.validUntil': 'বৈধ পর্যন্ত',
      'healthCard.status': 'অবস্থা',

      // Dashboard
      'dashboard.welcome': 'স্বাগতম',
      'dashboard.healthRecords': 'স্বাস্থ্য রেকর্ড',
      'dashboard.appointments': 'অ্যাপয়েন্টমেন্ট',
      'dashboard.notifications': 'বিজ্ঞপ্তি',
      'dashboard.profile': 'প্রোফাইল',

      // Forms
      'form.personalInfo': 'ব্যক্তিগত তথ্য',
      'form.healthInfo': 'স্বাস্থ্য তথ্য',
      'form.employmentInfo': 'কর্মসংস্থান তথ্য',
      'form.contactInfo': 'যোগাযোগ তথ্য',
      'form.emergencyContact': 'জরুরী যোগাযোগ',

      // Government Schemes
      'schemes.title': 'সরকারী স্বাস্থ্য প্রকল্প',
      'schemes.apply': 'প্রকল্পের জন্য আবেদন করুন',
      'schemes.benefits': 'সুবিধা',
      'schemes.eligibility': 'যোগ্যতা',

      // Notifications
      'notifications.appointment': 'অ্যাপয়েন্টমেন্ট রিমাইন্ডার',
      'notifications.checkup': 'স্বাস্থ্য পরীক্ষা বাকি',
      'notifications.scheme': 'প্রকল্প সুবিধা উপলব্ধ',

      // Languages
      'lang.english': 'English',
      'lang.hindi': 'हिंदी',
      'lang.bengali': 'বাংলা',
      'lang.odia': 'ଓଡ଼ିଆ',
      'lang.malayalam': 'മലയാളം',
    }
  },
  or: {
    translation: {
      // Navigation
      'nav.home': 'ହୋମ୍',
      'nav.about': 'ଆମ ବିଷୟରେ',
      'nav.services': 'ସେବା',
      'nav.healthCard': 'ସ୍ୱାସ୍ଥ୍ୟ କାର୍ଡ',
      'nav.doctors': 'ଡାକ୍ତରମାନଙ୍କ ପାଇଁ',
      'nav.employers': 'ନିଯୁକ୍ତିକର୍ତ୍ତାମାନଙ୍କ ପାଇଁ',
      'nav.contact': 'ଯୋଗାଯୋଗ',
      'nav.login': 'ଲଗ୍ ଇନ୍',
      'nav.register': 'ପଞ୍ଜିକରଣ',
      'nav.logout': 'ଲଗ୍ ଆଉଟ୍',

      // Common
      'common.save': 'ସେଭ୍ କରନ୍ତୁ',
      'common.cancel': 'ବାତିଲ୍ କରନ୍ତୁ',
      'common.submit': 'ଦାଖଲ କରନ୍ତୁ',
      'common.loading': 'ଲୋଡ୍ ହେଉଛି...',
      'common.error': 'ତ୍ରୁଟି',
      'common.success': 'ସଫଳ',
      'common.warning': 'ଚେତାବନୀ',
      'common.info': 'ସୂଚନା',

      // Authentication
      'auth.login': 'ଲଗ୍ ଇନ୍',
      'auth.register': 'ପଞ୍ଜିକରଣ',
      'auth.email': 'ଇମେଲ୍',
      'auth.password': 'ପାସ୍ୱାର୍ଡ',
      'auth.confirmPassword': 'ପାସ୍ୱାର୍ଡ ନିଶ୍ଚିତ କରନ୍ତୁ',
      'auth.forgotPassword': 'ପାସ୍ୱାର୍ଡ ଭୁଲି ଗଲେ?',
      'auth.rememberMe': 'ମୋତେ ମନେ ରଖନ୍ତୁ',
      'auth.loginWithOtp': 'OTP ସହିତ ଲଗ୍ ଇନ୍',
      'auth.loginWithAadhaar': 'ଆଧାର ସହିତ ଲଗ୍ ଇନ୍',

      // User Roles
      'role.worker': 'ପ୍ରବାସୀ ଶ୍ରମିକ',
      'role.doctor': 'ସ୍ୱାସ୍ଥ୍ୟସେବା ପ୍ରଦାନକାରୀ',
      'role.manager': 'ନିଯୁକ୍ତିକର୍ତ୍ତା/ପରିଚାଳକ',
      'role.admin': 'ପ୍ରଶାସକ',

      // Health Card
      'healthCard.title': 'ଡିଜିଟାଲ୍ ସ୍ୱାସ୍ଥ୍ୟ କାର୍ଡ',
      'healthCard.generate': 'ସ୍ୱାସ୍ଥ୍ୟ କାର୍ଡ ସୃଷ୍ଟି କରନ୍ତୁ',
      'healthCard.scan': 'ସ୍ୱାସ୍ଥ୍ୟ କାର୍ଡ ସ୍କାନ୍ କରନ୍ତୁ',
      'healthCard.uniqueId': 'ଅନନ୍ୟ ID',
      'healthCard.validUntil': 'ବୈଧ ପର୍ଯ୍ୟନ୍ତ',
      'healthCard.status': 'ସ୍ଥିତି',

      // Dashboard
      'dashboard.welcome': 'ସ୍ୱାଗତ',
      'dashboard.healthRecords': 'ସ୍ୱାସ୍ଥ୍ୟ ରେକର୍ଡ',
      'dashboard.appointments': 'ଅପଏଣ୍ଟମେଣ୍ଟ',
      'dashboard.notifications': 'ବିଜ୍ଞପ୍ତି',
      'dashboard.profile': 'ପ୍ରୋଫାଇଲ୍',

      // Forms
      'form.personalInfo': 'ବ୍ୟକ୍ତିଗତ ସୂଚନା',
      'form.healthInfo': 'ସ୍ୱାସ୍ଥ୍ୟ ସୂଚନା',
      'form.employmentInfo': 'ରୋଜଗାର ସୂଚନା',
      'form.contactInfo': 'ଯୋଗାଯୋଗ ସୂଚନା',
      'form.emergencyContact': 'ଜରୁରୀକାଳୀନ ଯୋଗାଯୋଗ',

      // Government Schemes
      'schemes.title': 'ସରକାରୀ ସ୍ୱାସ୍ଥ୍ୟ ଯୋଜନା',
      'schemes.apply': 'ଯୋଜନା ପାଇଁ ଆବେଦନ କରନ୍ତୁ',
      'schemes.benefits': 'ଲାଭ',
      'schemes.eligibility': 'ଯୋଗ୍ୟତା',

      // Notifications
      'notifications.appointment': 'ଅପଏଣ୍ଟମେଣ୍ଟ ରିମାଇଣ୍ଡର୍',
      'notifications.checkup': 'ସ୍ୱାସ୍ଥ୍ୟ ଯାଞ୍ଚ ବାକି',
      'notifications.scheme': 'ଯୋଜନା ଲାଭ ଉପଲବ୍ଧ',

      // Languages
      'lang.english': 'English',
      'lang.hindi': 'हिंदी',
      'lang.bengali': 'বাংলা',
      'lang.odia': 'ଓଡ଼ିଆ',
      'lang.malayalam': 'മലയാളം',
    }
  },
  ml: {
    translation: {
      // Navigation
      'nav.home': 'ഹോം',
      'nav.about': 'ഞങ്ങളെക്കുറിച്ച്',
      'nav.services': 'സേവനങ്ങൾ',
      'nav.healthCard': 'ആരോഗ്യ കാർഡ്',
      'nav.doctors': 'ഡോക്ടർമാർക്ക്',
      'nav.employers': 'ഉദ്യോഗദാതാക്കൾക്ക്',
      'nav.contact': 'ബന്ധപ്പെടുക',
      'nav.login': 'ലോഗിൻ',
      'nav.register': 'രജിസ്റ്റർ',
      'nav.logout': 'ലോഗ് ഔട്ട്',

      // Common
      'common.save': 'സംരക്ഷിക്കുക',
      'common.cancel': 'റദ്ദാക്കുക',
      'common.submit': 'സമർപ്പിക്കുക',
      'common.loading': 'ലോഡിംഗ്...',
      'common.error': 'പിശക്',
      'common.success': 'വിജയം',
      'common.warning': 'മുന്നറിയിപ്പ്',
      'common.info': 'വിവരം',

      // Authentication
      'auth.login': 'ലോഗിൻ',
      'auth.register': 'രജിസ്റ്റർ',
      'auth.email': 'ഇമെയിൽ',
      'auth.password': 'പാസ്വേഡ്',
      'auth.confirmPassword': 'പാസ്വേഡ് സ്ഥിരീകരിക്കുക',
      'auth.forgotPassword': 'പാസ്വേഡ് മറന്നോ?',
      'auth.rememberMe': 'എന്നെ ഓർമ്മിക്കുക',
      'auth.loginWithOtp': 'OTP ഉപയോഗിച്ച് ലോഗിൻ',
      'auth.loginWithAadhaar': 'ആധാർ ഉപയോഗിച്ച് ലോഗിൻ',

      // User Roles
      'role.worker': 'പ്രവാസി തൊഴിലാളി',
      'role.doctor': 'ആരോഗ്യ സേവന ദാതാവ്',
      'role.manager': 'ഉദ്യോഗദാതാവ്/മാനേജർ',
      'role.admin': 'അഡ്മിനിസ്ട്രേറ്റർ',

      // Health Card
      'healthCard.title': 'ഡിജിറ്റൽ ആരോഗ്യ കാർഡ്',
      'healthCard.generate': 'ആരോഗ്യ കാർഡ് സൃഷ്ടിക്കുക',
      'healthCard.scan': 'ആരോഗ്യ കാർഡ് സ്കാൻ ചെയ്യുക',
      'healthCard.uniqueId': 'അദ്വിതീയ ID',
      'healthCard.validUntil': 'സാധുവായത്',
      'healthCard.status': 'സ്ഥിതി',

      // Dashboard
      'dashboard.welcome': 'സ്വാഗതം',
      'dashboard.healthRecords': 'ആരോഗ്യ രേഖകൾ',
      'dashboard.appointments': 'അപ്പോയിന്റ്മെന്റുകൾ',
      'dashboard.notifications': 'അറിയിപ്പുകൾ',
      'dashboard.profile': 'പ്രൊഫൈൽ',

      // Forms
      'form.personalInfo': 'വ്യക്തിഗത വിവരങ്ങൾ',
      'form.healthInfo': 'ആരോഗ്യ വിവരങ്ങൾ',
      'form.employmentInfo': 'തൊഴിൽ വിവരങ്ങൾ',
      'form.contactInfo': 'ബന്ധപ്പെടൽ വിവരങ്ങൾ',
      'form.emergencyContact': 'അടിയന്തര ബന്ധപ്പെടൽ',

      // Government Schemes
      'schemes.title': 'സർക്കാർ ആരോഗ്യ പദ്ധതികൾ',
      'schemes.apply': 'പദ്ധതിക്ക് അപേക്ഷിക്കുക',
      'schemes.benefits': 'സുബിധകൾ',
      'schemes.eligibility': 'യോഗ്യത',

      // Notifications
      'notifications.appointment': 'അപ്പോയിന്റ്മെന്റ് ഓർമ്മപ്പെടുത്തൽ',
      'notifications.checkup': 'ആരോഗ്യ പരിശോധന അവശേഷിക്കുന്നു',
      'notifications.scheme': 'പദ്ധതി സുബിധകൾ ലഭ്യം',

      // Languages
      'lang.english': 'English',
      'lang.hindi': 'हिंदी',
      'lang.bengali': 'বাংলা',
      'lang.odia': 'ଓଡ଼ିଆ',
      'lang.malayalam': 'മലയാളം',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
