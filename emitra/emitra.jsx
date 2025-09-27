import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Camera, Upload, FileText, HeartPulse, User, Calendar, Phone, MapPin, Droplet, Users, Briefcase, IdCard, ContactRound } from 'lucide-react';

const EmitraDashboard = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    dob: '',
    age: '',
    gender: '',
    mobile: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: '',
    bloodGroup: '',
    maritalStatus: '',
    occupation: '',
    idType: '',
    idNumber: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactMobile: '',
    photo: null,
    diseases: '',
    reports: null,
    otherInfo: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Submitting registration data:', formData);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Health Card generated for ${formData.fullName}!`);
      setFormData({
        fullName: '', fatherName: '', dob: '', age: '', gender: '', mobile: '', addressLine1: '', city: '', state: '', pincode: '', bloodGroup: '', maritalStatus: '', occupation: '', idType: '', idNumber: '', emergencyContactName: '', emergencyContactRelationship: '', emergencyContactMobile: '', photo: null, diseases: '', reports: null, otherInfo: ''
      });
    }, 2000);
  };

  const InputField = ({ id, name, label, type = 'text', value, onChange, required, icon: Icon, placeholder }) => (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {Icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none pt-6"><Icon className="w-5 h-5 text-gray-400" /></div>}
      <input
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={`mt-1 block w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow`}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-900 to-green-600 bg-clip-text text-transparent mb-2">
            e-Mitra Dashboard
          </h1>
          <p className="text-xl text-gray-600">Health Card Management Portal</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
          <form onSubmit={handleFormSubmit} className="space-y-10">
            <div className="flex items-center justify-center -mt-2 mb-4">
                <div className="flex items-center text-blue-600">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">1</div>
                    <span className="font-semibold ml-2">Personal Details</span>
                </div>
                <div className="flex-auto border-t-2 border-gray-300 mx-4"></div>
                <div className="flex items-center text-gray-500">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-bold">2</div>
                    <span className="font-semibold ml-2">Medical Details</span>
                </div>
            </div>

            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
              <h2 className="text-2xl font-semibold text-gray-700 border-l-4 border-blue-500 pl-4 mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField id="fullName" name="fullName" label="Full Name" value={formData.fullName} onChange={handleFormChange} required icon={User} />
                <InputField id="fatherName" name="fatherName" label="Father's Name" value={formData.fatherName} onChange={handleFormChange} required icon={User} />
                <InputField id="dob" name="dob" label="Date of Birth" type="date" value={formData.dob} onChange={handleFormChange} required icon={Calendar} />
                <InputField id="age" name="age" label="Age" type="number" value={formData.age} onChange={handleFormChange} required icon={User} />
                
                <div className="relative">
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select name="gender" id="gender" value={formData.gender} onChange={handleFormChange} required className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                  </select>
                </div>
                <div className="relative">
                  <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                  <select name="maritalStatus" id="maritalStatus" value={formData.maritalStatus} onChange={handleFormChange} required className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                  </select>
                </div>
                <div className="relative md:col-span-2">
                  <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none pt-6"><Droplet className="w-5 h-5 text-gray-400" /></div>
                  <select name="bloodGroup" id="bloodGroup" value={formData.bloodGroup} onChange={handleFormChange} required className="mt-1 block w-full pl-10 py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-
                      </option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                  </select>
                </div>

                <InputField id="occupation" name="occupation" label="Occupation" value={formData.occupation} onChange={handleFormChange} required icon={Briefcase} />

                <div className="relative">
                  <label htmlFor="idType" className="block text-sm font-medium text-gray-700 mb-1">ID Document Type</label>
                  <select name="idType" id="idType" value={formData.idType} onChange={handleFormChange} required className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select ID Type</option>
                      <option value="Aadhaar">Aadhaar Card</option>
                      <option value="Passport">Passport</option>
                      <option value="DrivingLicense">Driving License</option>
                  </select>
                </div>
                <InputField id="idNumber" name="idNumber" label="ID Document Number" value={formData.idNumber} onChange={handleFormChange} required icon={IdCard} />

                <InputField id="mobile" name="mobile" label="Mobile Number" type="tel" value={formData.mobile} onChange={handleFormChange} required icon={Phone} />
                <InputField id="addressLine1" name="addressLine1" label="Address Line" value={formData.addressLine1} onChange={handleFormChange} required icon={MapPin} />
                <InputField id="city" name="city" label="City / Town" value={formData.city} onChange={handleFormChange} required icon={MapPin} />
                <InputField id="state" name="state" label="State" value={formData.state} onChange={handleFormChange} required icon={MapPin} />
                <InputField id="pincode" name="pincode" label="Pincode" type="number" value={formData.pincode} onChange={handleFormChange} required icon={MapPin} />

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Worker's Photograph</label>
                    <div className="mt-2 flex items-center gap-4">
                        <span className="inline-block h-24 w-24 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed">
                            {formData.photo ? <img src={URL.createObjectURL(formData.photo)} alt="Worker" className="h-full w-full object-cover" /> : <Camera className="h-full w-full text-gray-300 p-4" />}
                        </span>
                        <label htmlFor="photo-upload" className="cursor-pointer bg-gray-100 hover:bg-gray-200 py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-800 transition">
                            <Upload className="w-5 h-5 inline-block mr-2" />
                            <span>Upload Photo</span>
                            <input id="photo-upload" name="photo" type="file" className="sr-only" onChange={(e) => handleFileChange(e)} accept="image/*" />
                        </label>
                    </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField id="emergencyContactName" name="emergencyContactName" label="Contact Name" value={formData.emergencyContactName} onChange={handleFormChange} required icon={User} />
                    <InputField id="emergencyContactRelationship" name="emergencyContactRelationship" label="Relationship" value={formData.emergencyContactRelationship} onChange={handleFormChange} required icon={Users} />
                    <InputField id="emergencyContactMobile" name="emergencyContactMobile" label="Mobile Number" type="tel" value={formData.emergencyContactMobile} onChange={handleFormChange} required icon={Phone} />
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }}>
              <h2 className="text-2xl font-semibold text-gray-700 border-l-4 border-green-500 pl-4 mb-6">Medical Information</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="diseases" className="block text-sm font-medium text-gray-700">Pre-existing Diseases or Conditions</label>
                  <textarea name="diseases" id="diseases" value={formData.diseases} onChange={handleFormChange} rows="3" className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="e.g., Diabetes, Hypertension, Asthma..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Upload Medical Reports</label>
                  <div className="mt-2 flex items-center gap-4">
                      <span className="inline-block h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-dashed">
                          {formData.reports ? <FileText className="h-8 w-8 text-gray-500" /> : <HeartPulse className="h-8 w-8 text-gray-400" />}
                      </span>
                      <label htmlFor="reports-upload" className="cursor-pointer bg-gray-100 hover:bg-gray-200 py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-800 transition">
                          <Upload className="w-5 h-5 inline-block mr-2" />
                          <span>Upload Report</span>
                          <input id="reports-upload" name="reports" type="file" className="sr-only" onChange={(e) => handleFileChange(e)} />
                      </label>
                      {formData.reports && <span className="text-sm text-gray-500 font-medium">{formData.reports.name}</span>}
                  </div>
                </div>
                <div>
                  <label htmlFor="otherInfo" className="block text-sm font-medium text-gray-700">Other Information</label>
                  <textarea name="otherInfo" id="otherInfo" value={formData.otherInfo} onChange={handleFormChange} rows="3" className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Any other relevant medical information..."></textarea>
                </div>
              </div>
            </motion.section>

            <div className="pt-6 text-center">
              <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.02, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)' }} whileTap={{ scale: 0.98 }} className="w-full md:w-auto inline-flex items-center justify-center px-12 py-4 border border-transparent text-lg font-bold rounded-lg text-white bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 disabled:opacity-50 shadow-lg transition-all">
                <UserPlus className="w-6 h-6 mr-3" />
                {isSubmitting ? 'Generating Card...' : 'Generate Health Card'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EmitraDashboard;
