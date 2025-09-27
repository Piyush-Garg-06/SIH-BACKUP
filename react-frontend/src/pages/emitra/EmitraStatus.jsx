import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, XCircle, Loader } from 'lucide-react';

const EmitraStatus = () => {
  const [workerId, setWorkerId] = useState('');
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckStatus = (e) => {
    e.preventDefault();
    if (!workerId) return;

    setIsLoading(true);
    setStatus(null);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Mock a random status
      const isGenerated = Math.random() > 0.5;
      if (isGenerated) {
        setStatus({
          generated: true,
          message: `Health Card for worker ${workerId} is active and generated.`,
          details: {
            name: 'Mock Worker Name',
            healthId: `KL-MW-2023-${workerId}`,
            generatedOn: new Date().toLocaleDateString(),
          }
        });
      } else {
        setStatus({
          generated: false,
          message: `Health Card for worker ${workerId} is pending approval.`
        });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-green-600 bg-clip-text text-transparent mb-2">
            Check Health Card Status
          </h1>
          <p className="text-lg text-gray-600">Enter a worker's ID to verify their health card status.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
        >
          <form onSubmit={handleCheckStatus} className="flex items-center gap-4">
            <input
              type="text"
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              placeholder="Enter Worker ID..."
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
            >
              <Search className="w-5 h-5 mr-2" />
              {isLoading ? 'Checking...' : 'Check'}
            </button>
          </form>
        </motion.div>

        {status && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
          >
            <div className="flex items-center">
              {status.generated ? (
                <CheckCircle className="w-12 h-12 text-green-500 mr-4" />
              ) : (
                <XCircle className="w-12 h-12 text-red-500 mr-4" />
              )}
              <div>
                <h2 className={`text-2xl font-bold ${status.generated ? 'text-green-700' : 'text-red-700'}`}>
                  {status.generated ? 'Card Generated' : 'Card Pending'}
                </h2>
                <p className="text-gray-600">{status.message}</p>
              </div>
            </div>
            {status.generated && status.details && (
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800">Details:</h3>
                <p><strong>Name:</strong> {status.details.name}</p>
                <p><strong>Health ID:</strong> {status.details.healthId}</p>
                <p><strong>Generated On:</strong> {status.details.generatedOn}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EmitraStatus;
