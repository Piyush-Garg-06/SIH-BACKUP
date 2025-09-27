import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Info, Hospital, Users, HeartPulse, PersonStanding, Phone } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const GovernmentSchemes = () => {
  const { t } = useTranslation();
  const [selectedScheme, setSelectedScheme] = useState(null);

  const schemes = [
    {
      id: 'ayushman-bharat',
      name: 'Ayushman Bharat - PMJAY',
      icon: Hospital,
      coverage: '₹5,00,000 per family per year',
      description: 'Cashless treatment at empaneled hospitals for secondary and tertiary care',
      benefits: [
        'Coverage for hospitalization expenses',
        'Pre and post hospitalization expenses',
        'Day care procedures',
        'No cap on family size'
      ],
      eligibility: 'Families with annual income less than ₹5 lakh',
      category: 'health-insurance'
    },
    {
      id: 'rashtriya-swasthya-bima-yojana',
      name: 'Rashtriya Swasthya Bima Yojana (RSBY)',
      icon: Users,
      coverage: '₹30,000 per family per year',
      description: 'Health insurance scheme for Below Poverty Line (BPL) families',
      benefits: [
        'Hospitalization coverage',
        'Pre-existing conditions covered',
        'Transport allowance',
        'Maternity benefits'
      ],
      eligibility: 'BPL families, unorganized sector workers',
      category: 'health-insurance'
    },
    {
      id: 'janani-suraksha-yojana',
      name: 'Janani Suraksha Yojana (JSY)',
      icon: HeartPulse,
      coverage: '₹1,400 - ₹1,000 (varies by state)',
      description: 'Safe delivery and postnatal care for pregnant women',
      benefits: [
        'Cash assistance for institutional delivery',
        'Postnatal care support',
        'Referral transport',
        'Nutritional support'
      ],
      eligibility: 'Pregnant women aged 19 and above',
      category: 'maternal-health'
    },
    {
      id: 'national-health-mission',
      name: 'National Health Mission (NHM)',
      icon: Info,
      coverage: 'Free healthcare services',
      description: 'Comprehensive healthcare services at primary, secondary and tertiary levels',
      benefits: [
        'Free diagnosis and treatment',
        'Free medicines',
        'Health check-ups',
        'Referral services'
      ],
      eligibility: 'All citizens, special focus on vulnerable groups',
      category: 'primary-healthcare'
    },
    {
      id: 'national-programme-elderly',
      name: 'National Programme for Health Care of the Elderly (NPHCE)',
      icon: PersonStanding,
      coverage: 'Free geriatric care',
      description: 'Comprehensive healthcare for elderly citizens',
      benefits: [
        'Geriatric care units',
        'Home-based care',
        'Day care centers',
        'Awareness programs'
      ],
      eligibility: 'Elderly citizens above 60 years',
      category: 'elderly-care'
    }
  ];

  const applyForScheme = (schemeId) => {
    // In a real app, this would integrate with government APIs
    toast.success(`Application submitted for ${schemes.find(s => s.id === schemeId)?.name}`);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'health-insurance': 'bg-blue-100 text-blue-800',
      'maternal-health': 'bg-pink-100 text-pink-800',
      'primary-healthcare': 'bg-green-100 text-green-800',
      'elderly-care': 'bg-purple-100 text-purple-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">{t('schemes.title')}</h1>
        <p className="text-gray-600">Access government health benefits and schemes directly</p>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {schemes.map((scheme) => {
          const Icon = scheme.icon;
          return (
            <div key={scheme.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(scheme.category)}`}>
                  {scheme.category.replace('-', ' ').toUpperCase()}
                </div>
                <Icon className="w-8 h-8 text-blue-600" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">{scheme.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{scheme.description}</p>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Coverage: {scheme.coverage}</p>
                <p className="text-sm text-gray-600">Eligibility: {scheme.eligibility}</p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Key Benefits:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {scheme.benefits.slice(0, 3).map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedScheme(scheme)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  View Details
                </button>
                <button
                  onClick={() => applyForScheme(scheme.id)}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Apply Now
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scheme Details Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedScheme.name}</h2>
                <button
                  onClick={() => setSelectedScheme(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">{selectedScheme.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Coverage</h3>
                    <p className="text-blue-800">{selectedScheme.coverage}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">Eligibility</h3>
                    <p className="text-green-800">{selectedScheme.eligibility}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Complete Benefits List:</h3>
                  <ul className="space-y-2">
                    {selectedScheme.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-yellow-900 mb-2">Important Notes:</h3>
                  <ul className="text-yellow-800 text-sm space-y-1">
                    <li>• Application must be submitted through registered health centers</li>
                    <li>• Documents verification required</li>
                    <li>• Benefits are subject to scheme guidelines</li>
                    <li>• Contact nearest health center for detailed assistance</li>
                  </ul>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => applyForScheme(selectedScheme.id)}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Apply for This Scheme
                </button>
                <button
                  onClick={() => setSelectedScheme(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">Need Help with Scheme Applications?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Phone />
            </div>
            <h3 className="font-medium text-blue-900 mb-1">Helpline</h3>
            <p className="text-sm text-blue-700">Call 1800-XXX-XXXX for assistance</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Hospital />
            </div>
            <h3 className="font-medium text-blue-900 mb-1">Health Centers</h3>
            <p className="text-sm text-blue-700">Visit nearest government health center</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Info />
            </div>
            <h3 className="font-medium text-blue-900 mb-1">Online Portal</h3>
            <p className="text-sm text-blue-700">Apply through official government portals</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernmentSchemes;
