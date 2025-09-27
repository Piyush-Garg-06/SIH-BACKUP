import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import { MdDownload, MdShare, MdQrCodeScanner, MdVerified } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';

const HealthCard = ({ user }) => {
  const { t } = useTranslation();
  const [showQR, setShowQR] = useState(false);
  const qrRef = useRef();

  // Mock health card data - in real app this would come from props/context
  const healthCardData = {
    uniqueId: user?.healthCardId || 'KMW-2024-001234',
    name: user?.name || 'John Doe',
    dob: user?.dob || '1990-01-01',
    bloodGroup: user?.bloodGroup || 'O+',
    emergencyContact: user?.emergencyContact || '+91-9876543210',
    validUntil: '2025-12-31',
    issuedDate: '2024-01-01',
    status: 'Active'
  };

  const qrData = JSON.stringify({
    id: healthCardData.uniqueId,
    name: healthCardData.name,
    type: 'health-card',
    issuedBy: 'Kerala Government'
  });

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `health-card-${healthCardData.uniqueId}.png`;
      link.href = url;
      link.click();
      toast.success('QR Code downloaded successfully!');
    }
  };

  const shareCard = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Health Card',
          text: `Health Card ID: ${healthCardData.uniqueId}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`Health Card ID: ${healthCardData.uniqueId}`);
      toast.success('Health Card ID copied to clipboard!');
    }
  };

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
                <p className="text-lg">{healthCardData.emergencyContact}</p>
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
          onClick={shareCard}
          className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
