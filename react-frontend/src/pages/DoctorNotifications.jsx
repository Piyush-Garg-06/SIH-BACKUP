import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  Bell, AlertTriangle, CheckCircle, Clock, Calendar,
  MessageSquare, Phone, Mail, X, Filter, Search
} from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../utils/api';

const DoctorNotifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!user || user.role !== 'doctor') {
    navigate('/login');
    return null;
  }

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        // Ensure all notifications have a consistent ID field
        const notificationsWithIds = res.map(notification => ({
          ...notification,
          id: notification._id || notification.id
        }));
        setNotifications(notificationsWithIds || []);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'appointment': return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'health_alert': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'vaccination': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'compliance': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'emergency': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'scheme': return <Bell className="w-5 h-5 text-purple-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'normal': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      console.log('Deleting notification with ID:', notificationId);
      
      // Check if this is a database notification (has _id) or a mock notification (prefixed ID)
      if (notificationId.toString().startsWith('app-') || 
          notificationId.toString().startsWith('rec-') ||
          notificationId.toString().startsWith('scheme-')) {
        // This is a mock notification, just remove it from the UI
        console.log('Removing mock notification from UI');
        setNotifications(notifications.filter(notification => 
          notification.id !== notificationId
        ));
      } else {
        // This is a database notification, delete it from the backend
        await api.delete(`/notifications/${notificationId}`);
        // Remove the notification from the state
        setNotifications(notifications.filter(notification => 
          notification.id !== notificationId
        ));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
      // Even if there's an error, remove it from the UI for better UX
      setNotifications(notifications.filter(notification => 
        notification.id !== notificationId
      ));
      // Optionally show an error message to the user
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      // Update the notification in the state to mark it as read
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' ||
      (filter === 'unread' && !notification.read) ||
      (filter === 'read' && notification.read) ||
      (filter === notification.type);

    const matchesSearch = searchTerm === '' ||
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return <div className="text-center p-8">Loading notifications...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Doctor Notifications</h1>
              <p className="text-gray-600 mt-1">Stay updated with appointment requests and health alerts</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">
                  {unreadCount} unread
                </span>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Mark All Read
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Notifications</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
                <option value="appointment">Appointments</option>
                <option value="health_alert">Health Alerts</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`border-l-4 rounded-r-lg shadow-sm ${getPriorityColor(notification.priority)} ${
                  !notification.read ? 'bg-white border-r border-t border-b' : 'bg-gray-50'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className={`text-lg font-semibold ${
                            notification.read ? 'text-gray-700' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        <p className={`text-sm mb-3 ${
                          notification.read ? 'text-gray-600' : 'text-gray-800'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{new Date(notification.date).toLocaleString()}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                            notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {notification.priority} priority
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Keep the action button for doctors but ensure delete works */}
                      {notification.actionUrl && (
                        <button
                          onClick={() => {
                            // Log the notification to see what data we have
                            console.log('Notification clicked:', notification);
                            
                            // If this is an appointment notification with a relatedId, navigate to the specific appointment
                            if (notification.type === 'appointment' && notification.relatedId) {
                              console.log('Navigating to specific appointment:', `/doctor/appointments/${notification.relatedId}`);
                              navigate(`/doctor/appointments/${notification.relatedId}`);
                            } else {
                              console.log('Navigating to general action URL:', notification.actionUrl);
                              navigate(notification.actionUrl);
                            }
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          {notification.actionText}
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Notifications Found</h3>
              <p className="text-gray-600">
                {searchTerm || filter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'You have no notifications at the moment.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorNotifications;