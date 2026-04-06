import { useEffect, useState } from "react";
import axios from "axios";
import { FaFilter, FaGraduationCap, FaHospital, FaMoneyBill, FaSearch, FaStar, FaUserMd } from "react-icons/fa";
import { Helmet } from 'react-helmet';
import DoctorCard from "../components/DoctorCard";
import SectionHeading from "../components/home/SectionHeading";
import url_prefix from "../data/variable";
import { useLanguage } from '../hooks/useLanguage';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language] = useLanguage();
  const [headings, setHeadings] = useState({
    'title': 'Doctors & Specialists',
    'sub': '',
    'desc': ''
  });

  // Fetch doctors data from API
  useEffect(() => {
    if (!language) {
      console.log('Language not yet available, skipping fetch');
      return;
    }

    const fetchDoctors = async () => {
      setLoading(true);
      try {
        console.log(`[FETCH] Calling: ${url_prefix}/doctors/all`);
        const response = await axios.get(`${url_prefix}/doctors/all`);
        
        // Axios uses .data for the response body. 
        // Per requirement: user wants response.data.data
        const result = response.data;
        console.log("API RESPONSE (Axios):", result);
        
        if (result.success) {
          const rawData = result.data || [];
          const dataToSet = Array.isArray(rawData) ? rawData : [rawData];
          
          // Normalize: fallback for _id, name, and language
          const normalizedData = dataToSet.map(d => ({
            ...d,
            _id: d._id || d.id,
            fullName: d.fullName || d.name || `${d.firstName || ''} ${d.lastName || ''}`.trim() || 'Doctor',
            language: d.language || 'EN',
            image: d.image || d.profileImage || d.photo || null
          }));
          
          setDoctors(normalizedData);
          setError(null);
          
          if (normalizedData.length > 0) {
            setHeadings({
              title: normalizedData[0].ptitle || normalizedData[0].title || "Verified Specialists",
              desc: normalizedData[0].pdesc || normalizedData[0].excerpt || "Expert doctors and medical specialists for your healthcare needs."
            });
          }
        } else {
          throw new Error(result.error || 'Failed to load data');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.error || err.message);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [language]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    specialty: "",
    hospital: "",
    minRating: "",
    maxFee: "",
    minExperience: ""
  });

  // Extract unique values for filters from doctors data
  const specialties = [...new Set(doctors.map((d) => d.specialty).filter(Boolean))];

  const hospitals = [...new Set(doctors
    .map((d) => d.hospital && (typeof d.hospital === 'string' ? d.hospital : d.hospital.name))
    .filter(Boolean)
  )];

  const experienceRanges = [
    { value: "5", label: "5+ years" },
    { value: "10", label: "10+ years" },
    { value: "15", label: "15+ years" },
    { value: "20", label: "20+ years" }
  ];

  // Disable all filters temporarily as requested
  const filteredDoctors = doctors;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-auto">
          <div className="text-red-500 text-6xl mb-4">👨‍⚕️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Notice</h2>
          <p className="text-gray-600 mb-6">{error === 'HTTP error! Status: 404' ? 'The doctors endpoint was not found (404).' : error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors w-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Find Best Doctors & Medical Specialists | MedicwayCare</title>
        <meta name="description" content="Browse verified doctors and medical specialists on MedicwayCare. Connect with expert healthcare professionals for affordable treatment abroad." />
      </Helmet>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-6 border border-gray-100 h-fit">
            <div className="flex items-center gap-2 mb-6">
              <FaFilter className="text-teal-600 text-lg" />
              <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
            </div>

            <div className="mb-5">
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <FaSearch className="text-teal-500" />
                Search Doctors
              </label>
              <input
                type="text"
                placeholder="Search..."
                className="w-full border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="mb-5">
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <FaUserMd className="text-teal-500" />
                Specialty
              </label>
              <select
                className="w-full border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                value={filters.specialty}
                onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
              >
                <option value="">All Specialties</option>
                {specialties.map((specialty, i) => (
                  <option key={i} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>

            <div className="mb-5 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Showing {filteredDoctors.length} of {doctors.length} doctors
              </p>
            </div>

            <button
              onClick={() => {
                setSearchTerm("");
                setFilters({
                  specialty: "",
                  hospital: "",
                  minRating: "",
                  maxFee: "",
                  minExperience: ""
                });
              }}
              className="w-full bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Reset Filters
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <SectionHeading center={false} title={headings.title} desc={headings.desc} />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {filteredDoctors?.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <DoctorCard key={doctor._id} doc={doctor} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">👨‍⚕️</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Data</h3>
                  <p className="text-gray-600 mb-4">The database is currently empty or filters are too restrictive.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Doctors;