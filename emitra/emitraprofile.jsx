import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, MapPin, Edit } from 'lucide-react';

const EmitraProfile = () => {
  const { user } = useAuth();

  // Mock profile data for the e-Mitra operator
  const emitraOperator = {
    name: user?.name || 'e-Mitra Operator',
    operatorId: 'EM-12345',
    email: 'operator123@emitra.gov.in',
    centerName: 'e-Mitra Center, Thiruvananthapuram',
    centerLocation: 'Statue, Thiruvananthapuram, Kerala',
    avatar: `https://ui-avatars.com/api/?name=${user?.name || 'Emitra Operator'}&background=random`,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-900 to-green-600 bg-clip-text text-transparent mb-2">
            Operator Profile
          </h1>
          <p className="text-xl text-gray-600">Your personal and center information</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-shrink-0">
              <img
                src={emitraOperator.avatar}
                alt="Operator Avatar"
                className="w-32 h-32 rounded-full shadow-md border-4 border-white"
              />
            </div>
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800">{emitraOperator.name}</h2>
              <p className="text-lg text-gray-500">Operator ID: {emitraOperator.operatorId}</p>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-center md:justify-start">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">{emitraOperator.email}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">{emitraOperator.centerName}</span>
                </div>
                <p className="text-sm text-gray-500 text-center md:text-left pl-8">{emitraOperator.centerLocation}</p>
              </div>

              <div className="mt-6 text-center md:text-left">
                <button className="inline-flex items-center px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmitraProfile;
