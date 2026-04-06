import React, { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaLinkedin,
  FaReddit,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { SiQuora } from "react-icons/si";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import url_prefix from "../data/variable";
import toast from "react-hot-toast";

export default function Footer() {
  const { isAuthenticated, getToken } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Default content
  const defaultContent = {
    about: "MWCare connects patients worldwide with the best hospitals and doctors for affordable medical treatment abroad. We provide expert healthcare guidance and support globally.",
    partners: [
      { name: "Join With Us", url: "/contact" },
      { name: "Internship", url: "/contact" },
      { name: "Observership", url: "/contact" },
      { name: "Jobs", url: "/contact" },
    ],
    attribution: "Anukur Digital"
  };

  const [content, setContent] = useState(defaultContent);

  // Load from backend API
  useEffect(() => {
    const fetchFooterContent = async () => {
      try {
        const response = await fetch(`${url_prefix}/admin/content?page=global&section=footer`);
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
          const newContent = { ...defaultContent };
          result.data.forEach(item => {
            if (item.key === 'about') newContent.about = item.value;
            if (item.key === 'attribution') newContent.attribution = item.value;
            if (item.key.startsWith('partner_')) {
              const [_, index, type] = item.key.split('_');
              if (newContent.partners[index]) {
                newContent.partners[index][type] = item.value;
              }
            }
          });
          setContent(newContent);
        }
      } catch (e) {
        console.error("Error fetching footer content", e);
      }
    };

    fetchFooterContent();
  }, []);

  const handleSave = async () => {
    const token = getToken();
    const saveItems = [
      { key: 'about', value: content.about },
      { key: 'attribution', value: content.attribution },
      ...content.partners.flatMap((p, i) => [
        { key: `partner_${i}_name`, value: p.name },
        { key: `partner_${i}_url`, value: p.url }
      ])
    ];

    try {
      const promises = saveItems.map(item => 
        fetch(`${url_prefix}/admin/content`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            page: 'global',
            section: 'footer',
            key: item.key,
            value: item.value,
            language: 'EN'
          })
        })
      );

      await Promise.all(promises);
      toast.success("Footer updated permanently!");
      setIsEditing(false);
    } catch (e) {
      console.error("Error saving footer content", e);
      toast.error("Failed to save to server. Saved locally only.");
      localStorage.setItem("footer_content", JSON.stringify(content));
    }
  };

  const updatePartner = (index, field, value) => {
    const newPartners = [...content.partners];
    newPartners[index][field] = value;
    setContent({ ...content, partners: newPartners });
  };

  return (
    <footer className="bg-gradient-to-r from-primary to-[#0A2E50] text-white py-12 px-6 md:px-16 relative group">
      {/* Admin Edit Trigger */}
      {isAuthenticated && !isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 bg-accent text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform z-20"
          title="Edit Footer"
        >
          <FaEdit />
        </button>
      )}

      {isEditing && (
        <div className="absolute top-4 right-4 flex gap-2 z-20">
          <button
            onClick={handleSave}
            className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
            title="Save Changes"
          >
            <FaSave />
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-colors"
            title="Cancel"
          >
            <FaTimes />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">About MWCare</h3>
            {isEditing ? (
              <textarea
                value={content.about}
                onChange={(e) => setContent({ ...content, about: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded p-2 text-sm text-white focus:outline-none focus:border-accent h-32"
              />
            ) : (
              <p className="text-sm opacity-90 leading-relaxed text-slate-200">
                {content.about}
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="hover:text-accent transition-colors duration-200 opacity-90">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-accent transition-colors duration-200 opacity-90">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-accent transition-colors duration-200 opacity-90">
                  Doctors
                </Link>
              </li>
              <li>
                <Link to="/hospitals" className="hover:text-accent transition-colors duration-200 opacity-90">
                  Hospitals
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-accent transition-colors duration-200 opacity-90">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Partner With Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white hover:text-accent transition-colors">
              Partner With Us
            </h3>
            <ul className="space-y-3 text-sm">
              {content.partners.map((partner, index) => (
                <li key={index}>
                  {isEditing ? (
                    <div className="flex flex-col gap-1 mb-2">
                      <input
                        type="text"
                        value={partner.name}
                        onChange={(e) => updatePartner(index, "name", e.target.value)}
                        className="bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white"
                        placeholder="Link Name"
                      />
                      <input
                        type="text"
                        value={partner.url}
                        onChange={(e) => updatePartner(index, "url", e.target.value)}
                        className="bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white"
                        placeholder="URL"
                      />
                    </div>
                  ) : (
                    <Link
                      to={partner.url}
                      className="hover:text-accent transition-colors duration-200 opacity-90"
                    >
                      {partner.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Medical Destinations */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Our Medical Destinations
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2 text-sm">
              {[
                { name: "India", code: "in" },
                { name: "Thailand", code: "th" },
                { name: "UAE", code: "ae" },
                { name: "Germany", code: "de" },
                { name: "Turkey", code: "tr" },
                { name: "Singapore", code: "sg" },
              ].map((dest) => (
                <div key={dest.code} className="flex items-center gap-2 pr-1 min-w-0">
                  <img 
                    src={`https://flagcdn.com/w20/${dest.code}.png`} 
                    alt={dest.name}
                    className="flex-shrink-0"
                    width="20"
                  />
                  <span className="truncate opacity-90 text-[13px]">{dest.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social + CTA */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Connect With Us</h3>
            <div className="flex flex-wrap gap-4 mb-4">
              <a
                href="https://www.facebook.com/share/1LEebindtd/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transform transition duration-300"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="https://www.instagram.com/medicwaycare?igsh=MXU4MWZyZTFrdHV3Yw=="
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transform transition duration-300"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://www.youtube.com/@MedicwayCare"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transform transition duration-300"
              >
                <FaYoutube size={20} />
              </a>
              <a
                href="#"
                className="hover:scale-110 transform transition duration-300"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="#"
                className="hover:scale-110 transform transition duration-300"
              >
                <FaReddit size={20} />
              </a>
              <a
                href="#"
                className="hover:scale-110 transform transition duration-300"
              >
                <SiQuora size={20} />
              </a>
            </div>
            <a
              href="https://wa.me/919354799090"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-lg transition transform hover:scale-105 w-fit"
            >
              <FaWhatsapp className="mr-2" /> Need Assistance
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-white/20"></div>

        {/* Disclaimer */}
        <div className="text-xs opacity-80 leading-relaxed">
          <p>
            <strong>Note:</strong> MWCare does not provide medical advice,
            diagnosis or treatment. The services and information offered on
            www.mwcare.in are intended solely for informational purposes and
            cannot replace the professional consultation or treatment by a
            physician. MWCare discourages copying, cloning of its webpages and its
            content and it will follow the legal procedures to protect its
            intellectual property.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center text-sm opacity-80 flex flex-col items-center gap-2">
          <p>© {new Date().getFullYear()} MWCare. All Rights Reserved.</p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wide text-white/60">
              Website made by
            </span>
            {isEditing ? (
              <input
                type="text"
                value={content.attribution}
                onChange={(e) => setContent({ ...content, attribution: e.target.value })}
                className="bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white w-32 focus:outline-none"
              />
            ) : (
              <span className="text-xs font-semibold tracking-wide text-[#93c5fd] hover:scale-105 transition-transform duration-300">
                {content.attribution}
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
