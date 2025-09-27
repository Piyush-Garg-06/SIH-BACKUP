import LanguageSelector from './LanguageSelector';

const GovernmentBanner = () => {
  return (
    <div className="bg-yellow-500 text-black py-1 px-4 text-center text-sm overflow-hidden">
      <div className="container mx-auto flex justify-between items-center">
        <span>Official Website of Kerala Government</span>
        <span className="text-red-500 font-bold ml-4">Important Notice</span>
        <div className="flex space-x-4">
          <a href="#" className="hover:underline transition-transform hover:scale-105">Accessibility</a>
          <a href="#" className="hover:underline transition-transform hover:scale-105">Sitemap</a>
          <div className="language-selector px-2 rounded">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernmentBanner;
