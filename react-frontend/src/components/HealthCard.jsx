import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import { MdDownload, MdShare, MdQrCodeScanner, MdVerified } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';
import api from '../utils/api';

const HealthCard = ({ user }) => {
  const { t } = useTranslation();
  const [showQR, setShowQR] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [healthCardData, setHealthCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const qrRef = useRef();

  useEffect(() => {
    console.log('HealthCard component mounted with user:', user);
    
    const fetchHealthCardData = async () => {
      try {
        // Check if user object exists and has an ID
        if (!user) {
          console.log('No user object provided');
          setError('No user data available');
          setLoading(false);
          return;
        }
        
        // Get user ID (could be id or _id)
        const userId = user._id || user.id;
        if (!userId) {
          console.log('User object missing ID:', user);
          setError('User ID not found');
          setLoading(false);
          return;
        }
        
        console.log('Fetching health card data for user ID:', userId);
        
        const response = await api.get(`/health-cards/${userId}`);
        console.log('Health card API response:', response);
        
        // The response structure is { data: { ... } }, so we need to access response.data
        if (response && response.data) {
          setHealthCardData(response.data);
          setError(null);
        } else {
          throw new Error('Invalid response structure from server');
        }
      } catch (error) {
        console.error('Error fetching health card data:', error);
        setError(error.message || 'Failed to load health card data');
        toast.error('Failed to load health card data: ' + (error.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchHealthCardData();
  }, [user]);

  const qrData = healthCardData ? JSON.stringify({
    id: healthCardData.uniqueId,
    name: healthCardData.name,
    type: 'health-card',
    issuedBy: 'Kerala Government'
  }) : '';

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `health-card-${healthCardData?.uniqueId || 'health-card'}.png`;
      link.href = url;
      link.click();
      toast.success('QR Code downloaded successfully!');
    }
  };

  const downloadPDF = async () => {
    try {
      if (!user) {
        toast.error('User not properly authenticated');
        return;
      }
      
      // Get user ID (could be id or _id)
      const userId = user._id || user.id;
      if (!userId) {
        toast.error('User ID not found');
        return;
      }
      
      setDownloading(true);
      const response = await api.get(`/health-cards/download/${userId}`, {
        responseType: 'blob' // Important for handling binary data
      });
      
      // Create a blob URL and trigger download
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `health-card-${healthCardData?.uniqueId || 'health-card'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Health card PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download health card PDF: ' + (error.message || 'Unknown error'));
    } finally {
      setDownloading(false);
    }
  };

  const shareCard = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Health Card',
          text: `Health Card ID: ${healthCardData?.uniqueId || ''}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`Health Card ID: ${healthCardData?.uniqueId || ''}`);
      toast.success('Health Card ID copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">{t('common.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center text-red-500">
          <p>Failed to load health card data</p>
          <p className="text-sm mt-2">Error: {error}</p>
          {user && !(user._id || user.id) && (
            <p className="text-sm mt-2">User object: {JSON.stringify(user)}</p>
          )}
        </div>
      </div>
    );
  }

  if (!healthCardData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center text-red-500">No health card data available</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">{t('healthCard.title')}</h1>
        <p className="text-gray-600">Digital Health Record Management System</p>
      </div>

      {/* Health Card Display */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white shadow-2xl mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Card Details */}
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <MdVerified className="w-8 h-8 text-green-300 mr-2" />
              <h2 className="text-2xl font-bold">Kerala Migrant Workers</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-blue-100 text-sm">Unique ID</p>
                <p className="text-xl font-semibold">{healthCardData.uniqueId}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Name</p>
                <p className="text-xl font-semibold">{healthCardData.name}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Blood Group</p>
                <p className="text-xl font-semibold">{healthCardData.bloodGroup}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Emergency Contact</p>
                <p className="text-lg">
                  {healthCardData.emergencyContact || 
                   healthCardData.emergencyContactNumber || 
                   healthCardData.emergencyContactName || 
                   healthCardData.contact || 
                   'N/A'}
                </p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Valid Until</p>
                <p className="text-lg">{healthCardData.validUntil}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Status</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {healthCardData.status}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="mt-6 md:mt-0 md:ml-8">
            <div className="bg-white p-4 rounded-lg">
              <div ref={qrRef}>
                <QRCodeSVG
                  value={qrData}
                  size={150}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-center text-gray-600 text-sm mt-2">Scan for instant access</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <button
          onClick={() => setShowQR(!showQR)}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <MdQrCodeScanner className="w-5 h-5 mr-2" />
          {showQR ? 'Hide QR Code' : 'Show Full QR Code'}
        </button>

        <button
          onClick={downloadQR}
          className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <MdDownload className="w-5 h-5 mr-2" />
          Download QR Code
        </button>

        <button
          onClick={downloadPDF}
          disabled={downloading}
          className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          <MdDownload className="w-5 h-5 mr-2" />
          {downloading ? 'Downloading...' : 'Download PDF'}
        </button>

        <button
          onClick={shareCard}
          className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <MdShare className="w-5 h-5 mr-2" />
          Share Card
        </button>
      </div>

      {/* Full QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-center mb-4">Health Card QR Code</h3>
            <div className="flex justify-center mb-4">
              <QRCodeSVG
                value={qrData}
                size={250}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-center text-gray-600 text-sm mb-4">
              Show this QR code at hospitals for instant access to your medical records
            </p>
            <button
              onClick={() => setShowQR(false)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">How to Use Your Health Card</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</div>
            <div>
              <h4 className="font-semibold">At Hospitals</h4>
              <p className="text-sm text-gray-600">Show your QR code or provide your Unique ID for instant access to medical history</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</div>
            <div>
              <h4 className="font-semibold">Emergency Situations</h4>
              <p className="text-sm text-gray-600">Emergency contact information is readily available for quick response</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</div>
            <div>
              <h4 className="font-semibold">Government Schemes</h4>
              <p className="text-sm text-gray-600">Access government health benefits and schemes directly</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</div>
            <div>
              <h4 className="font-semibold">Regular Updates</h4>
              <p className="text-sm text-gray-600">Keep your health records updated for better medical care</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCard;