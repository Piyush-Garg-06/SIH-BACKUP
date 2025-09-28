  import { useState, useEffect } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import { ArrowRight, ArrowLeft, Check, UserCircle } from 'lucide-react';
  import toast, { Toaster } from 'react-hot-toast';

  const Register = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
      // Step 1: Basic Information
      firstName: '',
      lastName: '',
      gender: '',
      dob: '',
      aadhaar: '',
      mobile: '',
      email: '',
      nativeState: '',
      address: '',
      district: '',
      pincode: '',
      photo: null,

      // Step 2: Health Details
      bloodGroup: '',
      height: '',
      weight: '',
      disabilities: 'no',
      chronicConditions: [],
      vaccinations: [],
      previousDisease: '',

      // Step 3: Employment Details
      employmentType: '',
      employerName: '',
      employerContact: '',
      workLocation: '',
      workAddress: '',
      duration: '',
      familyMembers: ''
    });
    const [loading, setLoading] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      let objectUrl;
      if (formData.photo && formData.photo instanceof File) {
        objectUrl = URL.createObjectURL(formData.photo);
        setPhotoPreview(objectUrl);
      } else {
        setPhotoPreview(null);
      }

      return () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      };
    }, [formData.photo]);

    const steps = [
      { id: 1, title: 'Basic Information' },
      { id: 2, title: 'Health Details' },
      { id: 3, title: 'Employment Details' },
      { id: 4, title: 'Review & Submit' }
    ];

    const handleChange = (e) => {
      const { name, value, type, checked, files } = e.target;

      if (type === 'checkbox') {
        if (name === 'chronicConditions' || name === 'vaccinations') {
          setFormData(prev => ({
            ...prev,
            [name]: checked
              ? [...prev[name], value]
              : prev[name].filter(item => item !== value)
          }));
        } else {
          setFormData(prev => ({ ...prev, [name]: checked }));
        }
      } else if (type === 'file') {
        if (name === 'photo') {
          const file = files[0];
          if (file && !file.type.startsWith('image/')) {
            toast.error('Please select an image file (PNG, JPG).');
            setFormData(prev => ({ ...prev, photo: null }));
          } else {
            setFormData(prev => ({ ...prev, photo: file || null }));
          }
        } else {
          setFormData(prev => ({ ...prev, [name]: files[0] }));
        }
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    };

    const validateStep1 = () => {
      const { firstName, lastName, gender, dob, aadhaar, mobile, nativeState, address, district, pincode, photo } = formData;
      if (!firstName || !lastName || !gender || !dob || !aadhaar || !mobile || !nativeState || !address || !district || !pincode || !photo) {
        toast.error('Please fill all required fields in Basic Information.');
        return false;
      }
      if (!/^[0-9]{12}$/.test(aadhaar)) {
        toast.error('Please enter a valid 12-digit Aadhaar number.');
        return false;
      }
      if (!/^[0-9]{10}$/.test(mobile)) {
        toast.error('Please enter a valid 10-digit mobile number.');
        return false;
      }
      if (!/^[0-9]{6}$/.test(pincode)) {
        toast.error('Please enter a valid 6-digit pincode.');
        return false;
      }
      return true;
    };

    const validateStep2 = () => {
      const { bloodGroup, height, weight } = formData;
      if (!bloodGroup || !height || !weight) {
        toast.error('Please fill all required fields in Health Details.');
        return false;
      }
      return true;
    };

    const validateStep3 = () => {
      const { employmentType, employerName, workLocation } = formData;
      if (!employmentType || !employerName || !workLocation) {
        toast.error('Please fill all required fields in Employment Details.');
        return false;
      }
      return true;
    };

    const nextStep = () => {
      let isValid = true;
      if (currentStep === 1) isValid = validateStep1();
      if (currentStep === 2) isValid = validateStep2();
      if (currentStep === 3) isValid = validateStep3();

      if (isValid && currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    };

    const prevStep = () => {
      if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock registration success
        toast.success('Registration successful! Your Health ID will be sent to your registered mobile number.');
        navigate('/login');
      } catch (error) {
        console.error('Registration failed:', error);
      } finally {
        setLoading(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
          setFormData(prev => ({ ...prev, photo: file }));
        } else {
          toast.error('Please drop an image file (PNG, JPG).');
        }
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
    };

    const renderStepIndicator = () => (
      <div className="flex flex-col sm:flex-row justify-between mb-8 transition-all duration-500">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center mb-4 sm:mb-0">
            <div className={`step-indicator ${
              currentStep > step.id ? 'completed' : 
              currentStep === step.id ? 'current' : 'pending'
            } transition-all duration-300`}>
              {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
            </div>
            <span className={`text-sm font-medium ml-2 ${
              currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
            } transition-colors duration-300`}>
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div className={`flex-auto border-t-2 mx-4 mt-4 sm:mt-0 w-16 ${
                currentStep > step.id ? 'border-green-500' : 'border-gray-200'
              } transition-all duration-300`}></div>
            )}
          </div>
        ))}
      </div>
    );

    const renderStep1 = () => (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
          <div className="input-group">
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="form-input"
              placeholder=" "
            />
            <label htmlFor="firstName" className="form-label">First Name *</label>
          </div>
          <div className="input-group">
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="form-input"
              placeholder=" "
            />
            <label htmlFor="lastName" className="form-label">Last Name *</label>
          </div>
          <div className="input-group">
            <select
              id="gender"
              name="gender"
              required
              value={formData.gender}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <label htmlFor="gender" className="form-label">Gender *</label>
          </div>
          <div className="input-group">
            <input
              id="dob"
              name="dob"
              type="date"
              required
              value={formData.dob}
              onChange={handleChange}
              className="form-input"
            />
            <label htmlFor="dob" className="form-label">Date of Birth *</label>
          </div>
          <div className="input-group">
            <input
              id="aadhaar"
              name="aadhaar"
              type="text"
              pattern="[0-9]{12}"
              required
              value={formData.aadhaar}
              onChange={handleChange}
              className="form-input"
              placeholder=" "
            />
            <label htmlFor="aadhaar" className="form-label">Aadhaar Number *</label>
          </div>
          <div className="input-group">
            <input
              id="mobile"
              name="mobile"
              type="tel"
              pattern="[0-9]{10}"
              required
              value={formData.mobile}
              onChange={handleChange}
              className="form-input"
              placeholder=" "
            />
            <label htmlFor="mobile" className="form-label">Mobile Number *</label>
          </div>
          <div className="input-group">
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder=" "
            />
            <label htmlFor="email" className="form-label">Email Address</label>
          </div>
          <div className="input-group">
            <select
              id="nativeState"
              name="nativeState"
              required
              value={formData.nativeState}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">Select State</option>
              <option value="bihar">Bihar</option>
              <option value="west-bengal">West Bengal</option>
              <option value="odisha">Odisha</option>
              <option value="assam">Assam</option>
              <option value="up">Uttar Pradesh</option>
              <option value="other">Other</option>
            </select>
            <label htmlFor="nativeState" className="form-label">Native State *</label>
          </div>
          <div className="input-group md:col-span-2">
            <textarea id="address" name="address" rows="3" required className="form-input" placeholder=" " value={formData.address} onChange={handleChange}></textarea>
            <label htmlFor="address" className="form-label">Current Address in Kerala *</label>
          </div>
          <div className="input-group">
            <input id="district" name="district" type="text" required className="form-input" placeholder=" " value={formData.district} onChange={handleChange} />
            <label htmlFor="district" className="form-label">District *</label>
          </div>
          <div className="input-group">
            <input id="pincode" name="pincode" type="text" pattern="[0-9]{6}" required className="form-input" placeholder=" " value={formData.pincode} onChange={handleChange} />
            <label htmlFor="pincode" className="form-label">Pincode *</label>
          </div>
          {/* Photo Upload Section */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Photo *
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              className={`mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10 transition-all duration-300 group relative
                ${isDragOver ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-900/25 hover:border-indigo-500 bg-gray-50/50'}`}
            >
              <div className="text-center">
                {photoPreview ? (
                  <img src={photoPreview} alt="Photo preview" className="mx-auto h-24 w-24 rounded-full object-cover shadow-md transition-all duration-300 group-hover:scale-105" />
                ) : (
                  <UserCircle className="mx-auto h-12 w-12 text-gray-300 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                )}
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="photo"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500 transition-colors"
                  >
                    <span>Upload a file</span>
                    <input id="photo" name="photo" type="file" className="sr-only" onChange={handleChange} accept="image/*" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gra  y-600">PNG, JPG up to 10MB</p>
                {formData.photo && <p className="text-xs text-green-600 mt-2 animate-fade-in">File selected: {formData.photo.name}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    const renderStep2 = () => (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
          <div className="input-group">
            <select
              id="bloodGroup"
              name="bloodGroup"
              required
              value={formData.bloodGroup}
              onChange={handleChange}
                className="form-input"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
            <label htmlFor="bloodGroup" className="form-label">Blood Group *</label>
          </div>
          <div className="input-group">
            <input
              id="height"
              name="height"
              type="number"
              required
              value={formData.height}
              onChange={handleChange}
                className="form-input"
              placeholder=" "
            />
            <label htmlFor="height" className="form-label">Height (cm) *</label>
          </div>
          <div className="input-group">
            <input
              id="weight"
              name="weight"
              type="number"
              required
              value={formData.weight}
              onChange={handleChange}
                className="form-input"
              placeholder=" "
            />
            <label htmlFor="weight" className="form-label">Weight (kg) *</label>
          </div>
          <div className="input-group">
            <select
              id="disabilities"
              name="disabilities"
              value={formData.disabilities}
              onChange={handleChange}
                className="form-input"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
            <label htmlFor="disabilities" className="form-label">Any Disabilities?</label>
          </div>
          <div className="input-group md:col-span-2">
            <input
              id="previousDisease"
              name="previousDisease"
              type="text"
              value={formData.previousDisease}
              onChange={handleChange}
                className="form-input"
              placeholder=" "
            />
            <label htmlFor="previousDisease" className="form-label">Any Previous Disease (e.g., Diabetes, Hypertension)</label>
          </div>
        </div>
      </div>
    );

    const renderStep3 = () => (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
          <div className="input-group">
            <select
              id="employmentType"
              name="employmentType"
              required
              value={formData.employmentType}
              onChange={handleChange}
                className="form-input"
            >
              <option value="">Select Employment Type</option>
              <option value="construction">Construction Worker</option>
              <option value="factory">Factory Worker</option>
              <option value="domestic">Domestic Worker</option>
              <option value="agricultural">Agricultural Worker</option>
              <option value="other">Other</option>
            </select>
            <label htmlFor="employmentType" className="form-label">Employment Type *</label>
          </div>
          <div className="input-group">
            <input
              id="employerName"
              name="employerName"
              type="text"
              required
              value={formData.employerName}
              onChange={handleChange}
                className="form-input"
              placeholder=" "
            />
            <label htmlFor="employerName" className="form-label">Employer Name *</label>
          </div>
          <div className="input-group">
            <input
              id="employerContact"
              name="employerContact"
              type="tel"
              value={formData.employerContact}
              onChange={handleChange}
                className="form-input"
              placeholder=" "
            />
            <label htmlFor="employerContact" className="form-label">Employer Contact</label>
          </div>
          <div className="input-group">
            <input
              id="workLocation"
              name="workLocation"
              type="text"
              required
              value={formData.workLocation}
              onChange={handleChange}
                className="form-input"
              placeholder=" "
            />
            <label htmlFor="workLocation" className="form-label">Work Location *</label>
          </div>
          <div className="input-group">
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
                className="form-input"
            >
              <option value="">Select Duration</option>
              <option value="less-1">Less than 1 year</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="more-5">More than 5 years</option>
            </select>
            <label htmlFor="duration" className="form-label">Duration of Employment</label>
          </div>
          <div className="input-group">
            <input
              id="familyMembers"
              name="familyMembers"
              type="number"
              value={formData.familyMembers}
              onChange={handleChange}
                className="form-input"
              placeholder=" "
            />
            <label htmlFor="familyMembers" className="form-label">Number of Family Members</label>
          </div>
        </div>
      </div>
    );

    const renderStep4 = () => (
      <div className="space-y-6">
        <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
          <h3 className="text-lg font-semibold text-indigo-800 mb-2">Review Your Information</h3>
          <p className="text-sm text-indigo-700">Please review all the information you've entered. Go back to previous steps to make corrections.</p>
        </div>

        <div className="space-y-6 text-sm border border-gray-200 rounded-lg p-6">
          {/* Personal Information */}
          <div>
            <h4 className="text-base font-semibold text-gray-800 border-b pb-2 mb-4">Personal Information</h4>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
              <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
              <p><strong>Gender:</strong> {formData.gender}</p>
              <p><strong>Date of Birth:</strong> {formData.dob}</p>
              <p><strong>Aadhaar:</strong> {formData.aadhaar}</p>
              <p><strong>Mobile:</strong> {formData.mobile}</p>
              <p><strong>Email:</strong> {formData.email || 'N/A'}</p>
              <p className="md:col-span-2"><strong>Native State:</strong> {formData.nativeState}</p>
              <p className="md:col-span-2"><strong>Address:</strong> {formData.address}</p>
              <p><strong>District:</strong> {formData.district}</p>
              <p><strong>Pincode:</strong> {formData.pincode}</p>
            </div>
          </div>

          {/* Health Information */}
          <div>
            <h4 className="text-base font-semibold text-gray-800 border-b pb-2 mb-4 mt-6">Health Information</h4>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
              <p><strong>Blood Group:</strong> {formData.bloodGroup}</p>
              <p><strong>Height:</strong> {formData.height} cm</p>
              <p><strong>Weight:</strong> {formData.weight} kg</p>
              <p><strong>Disabilities:</strong> {formData.disabilities}</p>
              <p className="md:col-span-2"><strong>Previous Disease:</strong> {formData.previousDisease || 'N/A'}</p>
            </div>
          </div>

          {/* Employment Information */}
          <div>
            <h4 className="text-base font-semibold text-gray-800 border-b pb-2 mb-4 mt-6">Employment Information</h4>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
              <p><strong>Employment Type:</strong> {formData.employmentType}</p>
              <p><strong>Employer Name:</strong> {formData.employerName}</p>
              <p><strong>Employer Contact:</strong> {formData.employerContact || 'N/A'}</p>
              <p><strong>Work Location:</strong> {formData.workLocation}</p>
              <p><strong>Duration of Employment:</strong> {formData.duration || 'N/A'}</p>
              <p><strong>Family Members:</strong> {formData.familyMembers || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    );

    return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden">
      {/* Background decorative blobs */}
      <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-[40rem] h-[40rem] bg-gradient-to-br from-indigo-200 to-green-200 rounded-full opacity-30 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[40rem] h-[40rem] bg-gradient-to-tl from-orange-200 to-yellow-200 rounded-full opacity-30 blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>

      <div className="relative z-10 container mx-auto px-2 sm:px-4 py-8 sm:py-16">
        <Toaster position="top-center" />
        {/* Government-themed Banner */}
        <div className="max-w-4xl mx-auto mb-8 animate-fade-in-step">
          <div className="flex flex-col sm:flex-row items-center justify-center bg-gradient-to-r from-green-50 via-white to-yellow-50 border-2 border-gray-200 rounded-lg shadow-md p-4 relative overflow-hidden">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO7FMcZbPitFt45J-FrdfQc_QYPYH2S0SeZA&s" className="w-16 h-16 mr-4 drop-shadow-lg" style={{minWidth:'64px'}} />
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-indigo-900 tracking-wide">Government of Kerala Health Portal</h2>
              <p className="text-sm text-gray-600">Department of Health and Family Welfare</p>
              <p className="text-xs text-gray-500 mt-1">Empowering citizens with digital health solutions</p>
            </div>
          </div>
        </div>
        {/* Decorative Divider */}
        <div className="max-w-4xl mx-auto mb-8 flex items-center animate-fade-in-step">
          <div className="flex-1 h-px bg-gradient-to-r from-orange-400 via-gray-400 to-green-500 rounded-full" />
          <span className="mx-4 text-indigo-800 font-semibold text-lg">Migrant Worker Registration</span>
          <div className="flex-1 h-px bg-gradient-to-r from-green-500 via-gray-400 to-orange-400 rounded-full" />
        </div>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes buttonPop {
            0% { transform: scale(0.95); }
            60% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          @keyframes pulse-border {
            0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
            100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
          }

          .animate-fade-in, .animate-fade-in-step {
            animation: fadeIn 0.6s cubic-bezier(.4,0,.2,1) forwards;
          }
          .animate-fade-in-step {
            animation-fill-mode: both;
          }

          /* Step Indicator Enhancements */
          .step-indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
            font-weight: bold;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            color: white;
          }
          .step-indicator.pending {
            background-color: #d1d5db; /* gray-300 */
            color: #4b5563; /* gray-600 */
            border: 2px solid #9ca3af; /* gray-400 */
          }
          .step-indicator.current {
            background-color: #6366f1; /* indigo-500 */
            border: 2px solid #4f46e5; /* indigo-600 */
            transform: scale(1.1);
            box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
            animation: pulse-border 2s infinite;
          }
          .step-indicator.completed {
            background-color: #10b981; /* green-500 */
            border: 2px solid #059669; /* green-600 */
          }

          /* Floating Label Animation Styles */
          .input-group {
            position: relative;
          }
          .form-input {
            width: 100%;
            padding: 0.85rem 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            background-color: #ffffff;
            transition: transform 0.2s ease-in-out, border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
            font-size: 1rem;
            color: #111827;
            box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          }
          .form-input:hover {
            border-color: #6366f1; /* indigo-500 */
            transform: translateY(-1px);
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          }
          .form-label {
            position: absolute;
            top: 0.85rem;
            left: 0.75rem;
            color: #6b7280;
            pointer-events: none;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            background-color: transparent;
            padding: 0 0.25rem;
          }
          .form-input:focus {
              outline: none;
              border-color: #6366f1;
              background-color: #ffffff;
              box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.4), 0 4px 12px rgba(0,0,0,0.1);
              transform: translateY(-1px) scale(1.01);
          }
          select.form-input:focus,
          input[type="date"].form-input:focus {
              border-color: #3b82f6;
              box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4), 0 4px 12px rgba(0,0,0,0.1);
          }
          .form-input:focus ~ .form-label {
              color: #6366f1;
          }
          select:focus ~ .form-label,
          input[type="date"]:focus ~ .form-label {
              color: #3b82f6;
          }
          .form-input:not(:placeholder-shown) ~ .form-label,
          .form-input[type="date"]:not([value=""]) ~ .form-label,
          select.form-input:not([value=""]) ~ .form-label,
          .form-input:focus ~ .form-label {
            top: -0.6rem;
            left: 0.5rem;
            font-size: 0.75rem;
            background-color: #ffffff;
          }

          /* Button Enhancements */
          .animated-btn {
            transition: transform 0.2s, box-shadow 0.2s, background-size 0.3s;
            background-size: 200% auto;
          }
          .animated-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(0,0,0,0.15); 
            background-position: right center; /* change the direction of the change here */
          }
          .animated-btn:active {
            transform: scale(0.98) translateY(-1px);
          }
          .animated-btn-pop {
            animation: buttonPop 0.4s;
          }
          .btn-next {
            background-image: linear-gradient(to right, #6366f1 0%, #8b5cf6 50%, #6366f1 100%);
          }
          .btn-submit {
            background-image: linear-gradient(to right, #10b981 0%, #22c55e 50%, #10b981 100%);
          }

          /* Review Step (Step 4) Styling */
          .review-section {
            background-color: #f9fafb; /* gray-50 */
            border: 1px solid #e5e7eb; /* gray-200 */
            border-radius: 0.75rem;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
          }
          .review-section h4 {
            color: #4f46e5; /* indigo-600 */
          }
        `}</style>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-indigo-900 mb-2">Register for Digital Health Card</h1>
            <p className="text-gray-600">Complete your registration to get your unique health ID and access benefits.</p>
          </div>
          {renderStepIndicator()}

          <form>
            <div className="bg-white/80 backdrop-blur-md p-4 sm:p-8 rounded-2xl shadow-lg border border-white/20 transition-all duration-500 animate-fade-in">
              <div className="transition-all duration-500 animate-fade-in">
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
              </div>

              <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4 transition-all duration-500">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 animated-btn animated-btn-pop"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 transform transition-transform duration-300 group-hover:-translate-x-1" />
                    Previous
                  </button>
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 ml-auto transition-all duration-300 animated-btn animated-btn-pop"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 ml-auto disabled:opacity-50 transition-all duration-300 animated-btn animated-btn-pop"
                  >
                    {loading ? 'Submitting...' : 'Submit Registration'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    );
  };

  export default Register;
