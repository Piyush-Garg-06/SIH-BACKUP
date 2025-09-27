import { useTranslation } from 'react-i18next';
import { MdKeyboardArrowDown } from 'react-icons/md';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'en', name: t('lang.english'), flag: '🇺🇸' },
    { code: 'hi', name: t('lang.hindi'), flag: '🇮🇳' },
    { code: 'bn', name: t('lang.bengali'), flag: '🇮🇳' },
    { code: 'or', name: t('lang.odia'), flag: '🇮🇳' },
    { code: 'ml', name: t('lang.malayalam'), flag: '🇮🇳' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <div className="relative">
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-transparent text-white text-sm focus:outline-none cursor-pointer pr-6 appearance-none"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <MdKeyboardArrowDown className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
    </div>
  );
};

export default LanguageSelector;
