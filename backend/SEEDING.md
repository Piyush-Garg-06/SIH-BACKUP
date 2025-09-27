# Database Seeding

This document provides information about the database seeding process for the Digital Health Record Management System.

## Seeding Scripts

There are three main seeding scripts:

1. `seed.js` - Seeds the entire database with sample data for all user types
2. `seedAdminEmitra.js` - Seeds only admin and eMitra users (created specifically for a previous task)
3. `seedSpecific.js` - Seeds exactly 3 users for each role (admin, doctor, worker, emitra) as requested

## Seeded User Accounts

### Administrator Accounts (3)
1. **Admin One**
   - **Email**: admin1@example.com
   - **Password**: password123
   - **Role**: admin

2. **Admin Two**
   - **Email**: admin2@example.com
   - **Password**: password123
   - **Role**: admin

3. **Admin Three**
   - **Email**: admin3@example.com
   - **Password**: password123
   - **Role**: admin

### Doctor Accounts (3)
1. **Dr. Ramesh Patel**
   - **Email**: dr.ramesh@hospital.com
   - **Password**: password123
   - **Role**: doctor
   - **Specialization**: General Physician
   - **Registration Number**: DOC1001

2. **Dr. Sunita Nair**
   - **Email**: dr.sunita@clinic.com
   - **Password**: password123
   - **Role**: doctor
   - **Specialization**: Occupational Medicine
   - **Registration Number**: DOC1002

3. **Dr. Ahmed Hassan**
   - **Email**: dr.ahmed@medical.com
   - **Password**: password123
   - **Role**: doctor
   - **Specialization**: Emergency Medicine
   - **Registration Number**: DOC1003

### Migrant Worker Accounts (3)
1. **Ramesh Kumar**
   - **Email**: ramesh.worker@gmail.com
   - **Password**: password123
   - **Role**: worker
   - **Employment Type**: Construction Worker
   - **Employer**: ABC Construction Ltd
   - **Location**: Metro Construction Site, Kochi

2. **Suresh Patel**
   - **Email**: suresh.worker@gmail.com
   - **Password**: password123
   - **Role**: worker
   - **Employment Type**: Factory Worker
   - **Employer**: Tech Manufacturing Co
   - **Location**: Electronics Factory, Technopark

3. **Vijay Singh**
   - **Email**: vijay.worker@gmail.com
   - **Password**: password123
   - **Role**: worker
   - **Employment Type**: Agricultural Worker
   - **Employer**: Green Valley Farms
   - **Location**: Rice Fields, Palakkad

### eMitra Operator Accounts (3)
1. **Rajesh Kumar**
   - **Email**: emitra1@example.com
   - **Password**: password123
   - **Role**: emitra
   - **Operator ID**: EM-101
   - **Center**: eMitra Center Thiruvananthapuram
   - **Location**: Statue, Thiruvananthapuram, Kerala

2. **Sunita Sharma**
   - **Email**: emitra2@example.com
   - **Password**: password123
   - **Role**: emitra
   - **Operator ID**: EM-102
   - **Center**: eMitra Center Kochi
   - **Location**: MG Road, Kochi, Kerala

3. **Ahmed Hassan**
   - **Email**: emitra3@example.com
   - **Password**: password123
   - **Role**: emitra
   - **Operator ID**: EM-103
   - **Center**: eMitra Center Kozhikode
   - **Location**: Beach Road, Kozhikode, Kerala

### Other Sample Users (from seed.js)
- **Worker**: worker@example.com (password123)
- **Doctor**: doctor@example.com (password123)
- **Employer**: employer@example.com (password123)
- **Patient**: patient@example.com (password123)
- **eMitra**: emitra1@example.com (EM-001) and emitra2@example.com (EM-002)

## Running the Seeding Scripts

To seed the database with sample data:

```bash
# Navigate to the backend directory
cd backend

# Install dependencies (if not already installed)
npm install

# Run the main seeding script
npm run seed
```

To seed only the specific users (3 of each role):
```bash
# Navigate to the backend directory
cd backend

# Run the specific seeding script
npm run seed:specific
```

To seed only admin and eMitra data:
```bash
# Navigate to the backend directory
cd backend

# Run the admin/eMitra specific seeding script
node seedAdminEmitra.js
```

## Verifying Seeded Data

To verify that the data was seeded correctly:
```bash
# Navigate to the backend directory
cd backend

# Run the verification script for all data
node verifySeed.js

# Run the verification script for specific data
node verifySpecificSeed.js
```

## Notes

- All seeded accounts use the password `password123`
- The seeding process clears existing data in the collections before adding new data
- Seeding is intended for development and testing purposes only
- In production, proper user registration and authentication workflows should be used