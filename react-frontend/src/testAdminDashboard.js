// Simple test to check admin dashboard API response
const testAdminDashboard = async () => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('No token found');
      return;
    }
    
    // Make API call to admin dashboard endpoint
    const response = await fetch('http://localhost:5000/api/dashboard/admin', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    console.log('Admin dashboard data:', data);
    
    // Check stats
    if (data.stats) {
      console.log('Stats:', data.stats);
      data.stats.forEach((stat, index) => {
        console.log(`Stat ${index}:`, stat);
      });
    }
    
    // Check cards
    if (data.cards) {
      console.log('Cards:', data.cards);
      data.cards.forEach((card, index) => {
        console.log(`Card ${index}:`, card);
      });
    }
    
    // Check alerts
    if (data.alerts) {
      console.log('Alerts:', data.alerts);
      data.alerts.forEach((alert, index) => {
        console.log(`Alert ${index}:`, alert);
      });
    }
  } catch (error) {
    console.error('Error testing admin dashboard:', error);
  }
};

// Run the test
testAdminDashboard();

export default testAdminDashboard;