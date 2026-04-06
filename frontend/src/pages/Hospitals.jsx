import { useEffect, useState } from "react";
import axios from "axios";
import { FaFilter, FaHospital, FaMapMarkerAlt, FaSearch, FaStar } from "react-icons/fa";
import { Helmet } from 'react-helmet';
import SectionHeading from "../components/home/SectionHeading";
import ServiceBreadCrumbs from "../components/ServiceBreadcums";
import HospitalCard from "../components/HospitalCard";
import url_prefix from "../data/variable";
import { useLanguage } from '../hooks/useLanguage';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language] = useLanguage();
  const [headings, setHeadings] = useState({
    'title': 'Healthcare Facilities',
    'sub': '',
    'desc': 'Discover world-class hospitals and healthcare centers.'
  });

  // Fetch hospitals data from API
  useEffect(() => {
    if (!language) return;

    const fetchHospitals = async () => {
      setLoading(true);
      try {
        console.log(`[FETCH] Calling: ${url_prefix}/hospitals/all`);
        const response = await axios.get(`${url_prefix}/hospitals/all`);

        const result = response.data;
        console.log("API RESPONSE (Axios):", result);

        if (result.success) {
          const rawData = result.data || [];
          const dataToSet = Array.isArray(rawData) ? rawData : [rawData];

          // Normalize
          const normalizedData = dataToSet.map(h => ({
            ...h,
            _id: h._id || h.id,
            name: h.name || h.hname || 'Hospital',
            image: h.image || h.logo || h.photo || null
          }));

          setHospitals(normalizedData);
          setError(null);

          if (normalizedData.length > 0) {
            setHeadings({
              title: normalizedData[0].htitle || normalizedData[0].title || "Top Hospitals & Clinics",
              sub: normalizedData[0].hsubtitle || "",
              desc: normalizedData[0].hdesc || "Find the best hospitals worldwide with advanced healthcare technology."
            });
          }
        } else {
          throw new Error(result.error || 'Failed to load data');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.error || err.message);
        setHospitals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [language]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    country: "",
    city: "",
    specialty: "",
    accreditation: "",
    minRating: ""
  });

  // Extract unique values for filters from hospitals data
  // const countries = [...new Set(hospitals.map((h) => h.country).filter(Boolean))];
  // const cities = [...new Set(hospitals.map((h) => h.city).filter(Boolean))];
  // const specialties = [...new Set(hospitals.flatMap(h => h.specialties || []).filter(Boolean))];

  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch = (hospital.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = filters.country ? hospital.country === filters.country : true;
    const matchesCity = filters.city ? hospital.city === filters.city : true;
    const matchesSpecialty = filters.specialty ? hospital.specialties?.includes(filters.specialty) : true;
    const matchesRating = filters.minRating ? hospital.rating >= parseFloat(filters.minRating) : true;

    return matchesSearch && matchesCountry && matchesCity && matchesSpecialty && matchesRating;
  });

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
          <div className="text-red-500 text-6xl mb-4">🏥</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Notice</h2>
          <p className="text-gray-600 mb-6">{error}</p>
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

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Healthcare', path: '/hospitals' },
  ];

  return (
    <>
      <Helmet>
        <title>Best Hospitals Worldwide | MedicwayCare</title>
        <meta name="description" content="Find and compare the world's best hospitals on MedicwayCare." />
      </Helmet>
      <ServiceBreadCrumbs items={breadcrumbItems} headText="Find Healthcare Facilities" />
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
                Search Hospitals
              </label>
              <input
                type="text"
                placeholder="Search..."
                className="w-full border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="mb-5 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Found {filteredHospitals.length} facilities
              </p>
            </div>

            <button
              onClick={() => {
                setSearchTerm("");
                setFilters({ country: "", city: "", specialty: "", accreditation: "", minRating: "" });
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
              {filteredHospitals.length > 0 ? (
                filteredHospitals.map((hospital) => (
                  <HospitalCard key={hospital._id} hospital={hospital} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">🏥</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No hospitals found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hospitals;