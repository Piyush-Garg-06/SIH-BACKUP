import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import ImageSlider from '../components/ImageSlider';
import React from 'react';
import {
  AlertTriangle,
  UserCheck,
  FileText,
  QrCode,
  Calendar,
  Stethoscope,
  Users,
  Shield,
  Bell,
  CheckCircle,
  ArrowRight,
  Clock
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const mandatorySteps = [
    {
      step: 1,
      icon: UserCheck,
      title: 'Mandatory Registration',
      description: 'All migrant workers must register on the portal before starting work in Kerala.',
      color: 'red',
      required: true
    },
    {
      step: 2,
      icon: FileText,
      title: 'Health Record Submission',
      description: 'Submit complete medical history, vaccination records, and current health status.',
      color: 'orange',
      required: true
    },
    {
      step: 3,
      icon: QrCode,
      title: 'Health ID & QR Code Generation',
      description: 'Receive unique Health ID and QR code for instant hospital access.',
      color: 'blue',
      required: true
    },
    {
      step: 4,
      icon: Calendar,
      title: 'Scheduled Health Checkups',
      description: 'Regular health checkups scheduled via SMS notifications.',
      color: 'green',
      required: true
    }
  ];

  const systemFeatures = [
    {
      icon: Stethoscope,
      title: 'Doctor Categorization',
      description: 'Doctors categorize patients by severity levels and update medical records.',
      color: 'purple'
    },
    {
      icon: Shield,
      title: 'Admin Monitoring',
      description: 'Admin monitors worker health severity and connects workers with appropriate doctors.',
      color: 'indigo'
    },
    {
      icon: Bell,
      title: 'SMS Notifications',
      description: 'Automated notifications for checkups, results, and health alerts.',
      color: 'yellow'
    },
    {
      icon: Users,
      title: 'Employer Integration',
      description: 'Employers can verify worker health status and compliance.',
      color: 'green'
    }
  ];

  const importantNotices = [
    {
      icon: UserCheck,
      title: 'Registration',
      description: 'All migrant workers are encouraged to register on this portal and submit their health records.',
      color: 'blue'
    },
    {
      icon: Stethoscope,
      title: 'Health Checkups',
      description: 'Workers will be called for mandatory health checkups via SMS notifications. Non-compliance may result in work restrictions.',
      color: 'green'
    },
    {
      icon: FileText,
      title: 'Medical Records',
      description: 'All medical history, prescriptions, and test results will be updated on the portal for better healthcare delivery.',
      color: 'purple'
    },
    {
      icon: QrCode,
      title: 'Emergency Access',
      description: 'Health ID and QR code provide instant access to medical records during emergencies.',
      color: 'orange'
    }
  ];

  const workerBenefits = [
    'Free health checkups and consultations',
    'Access to government health schemes',
    'Emergency medical assistance',
    'Medical history tracking across Kerala',
    'Multilingual support in native languages',
    'QR code for instant hospital access'
  ];

  const employerBenefits = [
    'Verified worker health status',
    'Reduced workplace health incidents',
    'Compliance with labor regulations',
    'Access to worker medical records',
    'Health monitoring and reporting',
    'Reduced medical leave costs'
  ];

  const useIntersectionObserver = (options) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const ref = React.useRef(null);

    React.useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      }, options);

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, [ref, options]);

    return [ref, isVisible];
  };

  return (
    <div className="overflow-x-hidden">
      {/* Background decorative blobs */}
      <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-[40rem] h-[40rem] bg-gradient-to-br from-indigo-200 to-green-200 rounded-full opacity-50 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[40rem] h-[40rem] bg-gradient-to-tl from-orange-200 to-yellow-200 rounded-full opacity-50 blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-75"></div>
        <div className="relative z-10">
          <ImageSlider>
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-block">
                <img
                  src="https://health.kerala.gov.in/images/health-scheme.jpg"
                  alt="Kerala Migrant Workers"
                  className="rounded-lg shadow-lg transform transition-transform duration-500 hover:scale-105 animate-fade-in-up"
                />
              </div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 className="text-5xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                  Kerala Migrant Workers
                </h1>
                <p className="text-xl mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                  Digital Health Record Management System
                </p>
              </div>

              {!user ? (
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                  {/* Button removed as per request */}
                </div>
              ) : (
                <div className="bg-white text-blue-800 p-6 rounded-lg inline-block shadow-lg animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                  <h3 className="font-bold text-xl mb-2">Welcome back, {user.name}!</h3>
                  <p className="text-lg">Access your health dashboard and records</p>
                </div>
              )}
            </div>
          </ImageSlider>
        </div>
      </div>

      {/* Mandatory Steps Section */}
      <section className="py-20 bg-gray-200">
        {(() => {
          const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
          return (
            <div ref={ref} className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-blue-900 mb-4">
                  Mandatory Registration Process
                </h2>
                <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto text-lg">
                  All migrant workers must complete these steps before starting work in Kerala. It's simple, fast, and secures your health.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {mandatorySteps.map((step, index) => {
                    const Icon = step.icon;
                    const colorClasses = {
                      red: 'bg-red-100 text-red-600 border-red-200',
                      orange: 'bg-orange-100 text-orange-600 border-orange-200',
                      blue: 'bg-blue-100 text-blue-600 border-blue-200',
                      green: 'bg-green-100 text-green-600 border-green-200'
                    };

                    return (
                      <div key={step.step} className="group relative transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-2xl hover:-translate-y-3 rounded-lg" style={{ transitionDelay: `${index * 100}ms` }}>
                        <div className={`border-2 rounded-lg p-6 text-center h-full ${colorClasses[step.color]} hover:bg-opacity-80`}>
                          <div className="flex justify-center mb-4">
                            <div className="bg-white p-4 rounded-full shadow-md transition-transform duration-300 group-hover:scale-125">
                              <Icon className="w-8 h-8 transition-transform duration-300 group-hover:rotate-12" />
                            </div>
                          </div>
                          <div className="bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-inner">
                            {step.step}
                          </div>
                          <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                          <p className="text-gray-700">{step.description}</p>
                          {step.required && (
                            <div className="mt-4">
                              <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                REQUIRED
                              </span>
                            </div>
                          )}
                        </div>
                        {index < mandatorySteps.length - 1 && (
                          <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                            <ArrowRight className="w-8 h-8 text-gray-300 group-hover:text-blue-500 transition-colors" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* System Features */}
      <section className="py-20 bg-gray-200">
        {(() => {
          const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
          return (
            <div ref={ref} className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-blue-900 mb-16">
                  Advanced System Features
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {systemFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    const colorClasses = {
                      purple: 'bg-purple-100 text-purple-600',
                      indigo: 'bg-indigo-100 text-indigo-600',
                      yellow: 'bg-yellow-100 text-yellow-600',
                      green: 'bg-green-100 text-green-600'
                    };

                    return (
                      <div key={feature.title} className="group bg-white p-8 rounded-xl shadow-lg text-center transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-2xl hover:-translate-y-3 hover:[transform:perspective(1000px)_rotateY(10deg)]" style={{ transitionDelay: `${index * 100}ms` }}>
                        <div className={`w-20 h-20 ${colorClasses[feature.color]} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transition-transform duration-300 group-hover:scale-125`}>
                          <Icon className="w-10 h-10 transition-transform duration-300 group-hover:rotate-12" />
                        </div>
                        <h3 className="text-xl font-semibold text-blue-900 mb-3">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-200">
        {(() => {
          const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
          return (
            <div ref={ref} className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-blue-900 mb-16">
                  Benefits for Everyone
                </h2>

                <div className="grid md:grid-cols-2 gap-12">
                  {/* Worker Benefits */}
                  <div className="bg-blue-50 p-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:shadow-2xl hover:-translate-y-2">
                    <h3 className="text-3xl font-semibold text-blue-900 mb-6 flex items-center">
                      <Users className="w-10 h-10 mr-4" />
                      For Migrant Workers
                    </h3>
                    <ul className="space-y-4">
                      {workerBenefits.map((benefit) => (
                        <li key={benefit} className="flex items-start text-lg">
                          <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0 animate-checkmark" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Employer Benefits */}
                  <div className="bg-green-50 p-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:shadow-2xl hover:-translate-y-2">
                    <h3 className="text-3xl font-semibold text-green-900 mb-6 flex items-center">
                      <Shield className="w-10 h-10 mr-4" />
                      For Employers
                    </h3>
                    <ul className="space-y-4">
                      {employerBenefits.map((benefit) => (
                        <li key={benefit} className="flex items-start text-lg">
                          <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0 animate-checkmark" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* Important Notice */}
      <section className="py-20 bg-gray-100 text-gray-800">
        {(() => {
          const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
          return (
            <div ref={ref} className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl text-red-900 font-bold mb-6 flex items-center justify-center underline">
                  <AlertTriangle className="w-10 h-10 mr-4" />
                  Important Notice
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
                  {importantNotices.map((notice, index) => {
                    const Icon = notice.icon;
                    const colorClasses = {
                      blue: 'bg-blue-100 text-blue-600',
                      green: 'bg-green-100 text-green-600',
                      purple: 'bg-purple-100 text-purple-600',
                      orange: 'bg-orange-100 text-orange-600'
                    };

                    return (
                      <div key={notice.title} className="group bg-white p-6 rounded-xl shadow-lg text-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl" style={{ transitionDelay: `${index * 100}ms` }}>
                        <div className={`w-16 h-16 ${colorClasses[notice.color]} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                          <Icon className="w-8 h-8 transition-transform duration-300 group-hover:rotate-6" />
                        </div>
                        <h3 className="text-xl font-semibold text-blue-900 mb-2">{notice.title}</h3>
                        <p className="text-gray-700">{notice.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white text-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Secure Your Health, Secure Your Future
          </h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            Complete your mandatory health registration today and get your Health ID to start working in Kerala safely and with peace of mind.
          </p>
          {!user && (
            <Link
              to="/register"
              className="bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-lg font-bold text-xl inline-flex items-center transition-transform transform hover:scale-105 shadow-lg shimmer-effect"
            >
              <Clock className="w-7 h-7 mr-3" />
              Register Now - It's Mandatory
              <ArrowRight className="w-7 h-7 ml-3" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;