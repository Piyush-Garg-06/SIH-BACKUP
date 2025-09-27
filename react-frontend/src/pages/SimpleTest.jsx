import React from 'react';

const SimpleTest = () => {
  console.log('SimpleTest component loading');
  
  React.useEffect(() => {
    console.log('SimpleTest component mounted');
    alert('SimpleTest component loaded successfully!');
  }, []);

  const handleClick = () => {
    console.log('Button clicked in SimpleTest');
    alert('Button works in SimpleTest!');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Simple Test Page</h1>
      <p>This is a basic test to verify React and JavaScript are working.</p>
      <button 
        onClick={handleClick}
        style={{
          backgroundColor: 'blue',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          margin: '10px'
        }}
      >
        Test Button
      </button>
      <button 
        onClick={() => {
          console.log('Navigation test button clicked');
          alert('About to navigate to /add-new-patient');
          window.location.href = '/add-new-patient';
        }}
        style={{
          backgroundColor: 'green',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          margin: '10px'
        }}
      >
        Navigate to Add Patient
      </button>
    </div>
  );
};

export default SimpleTest;