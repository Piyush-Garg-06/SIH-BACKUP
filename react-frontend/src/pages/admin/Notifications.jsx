import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, CheckCircle, AlertTriangle, Info, Mail, MailOpen } from 'lucide-react';
import api from '../../utils/api';

const AdminNotifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    const fetchNotifications = async () => {
      try {
        const mockNotifications = [
          {
            id: 1,
            title: 'New Worker Registration',
            message: 'Ramesh Kumar has been registered as a new migrant worker.',
            type: 'info',
            timestamp: '2025-09-26T10:30:00Z',
            read: false
          },
          {
            id: 2,
            title: 'Health Report Submission',
            message: 'Dr. Ramesh Patel has submitted a new health report for worker Suresh Patel.',
            type: 'success',
            timestamp: '2025-09-26T09:15:00Z',
            read: true
          },
          {
            id: 3,
            title: 'System Alert',
            message: 'Database backup completed successfully.',
            type: 'info',
            timestamp: '2025-09-26T08:00:00Z',
            read: true
          },
          {
            id: 4,
            title: 'Urgent: Critical Health Case',
            message: 'Worker Vijay Singh has been flagged with a critical health condition.',
            type: 'warning',
            timestamp: '2025-09-26T07:45:00Z',
            read: false
          }
        ];
        setNotifications(mockNotifications);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user, navigate]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-500" />;
      default:
        return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl">
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-6 rounded-t-xl shadow-lg">
            <div className="flex items-center space-x-4">
              <Bell className="w-10 h-10" />
              <div>
                <h1 className="text-3xl font-bold">Admin Notifications</h1>
                <p className="text-blue-100">Manage and view all system notifications</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Recent Notifications</h2>
              <button
                onClick={markAllAsRead}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
              >
                <MailOpen className="w-5 h-5 mr-2" />
                Mark All as Read
              </button>
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-16">
                <Bell className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-700">No New Notifications</h3>
                <p className="text-gray-500 mt-2">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-5 rounded-xl border-2 transition-all duration-300 ${notification.read ? 'bg-gray-50 border-gray-200' : 'bg-white border-blue-400 shadow-lg'}`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`text-lg font-bold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>{notification.title}</h3>
                          <span className="text-sm text-gray-500">
                            {new Date(notification.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className={`mt-1 text-gray-600 ${notification.read ? '' : 'font-semibold'}`}>{notification.message}</p>
                        {!notification.read && (
                          <div className="mt-3">
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-semibold"
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Mark as read
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="text-center mt-6">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-800 mx-auto font-semibold"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Return to Dashboard
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;