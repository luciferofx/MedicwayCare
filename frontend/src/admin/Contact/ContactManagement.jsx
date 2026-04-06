import React, { useState, useEffect } from 'react';
import { Mail, Phone, User, MessageSquare, Trash2, Eye, CheckCircle, Clock } from 'lucide-react';
import url_prefix from '../../data/variable';

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${url_prefix}/contact`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setContacts(data.data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${url_prefix}/contact/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setContacts(contacts.filter(c => c._id !== id));
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${url_prefix}/contact/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (data.success) {
        setContacts(contacts.map(c => c._id === id ? { ...c, status: { ...c.status, mainStatus: status } } : c));
        if (selectedContact && selectedContact._id === id) {
          setSelectedContact({ ...selectedContact, status: { ...selectedContact.status, mainStatus: status } });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const openModal = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
    if (contact.status.mainStatus === 'new') {
      handleUpdateStatus(contact._id, 'processing');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading inquiries...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Contact Inquiries</h1>
          <p className="text-gray-500 text-sm">Manage messages from users</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">User</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Service/Subject</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {contacts.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-400">No inquiries found</td>
              </tr>
            ) : (
              contacts.map((contact) => (
                <tr key={contact._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-800">{contact.name}</div>
                    <div className="text-xs text-gray-500">{contact.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-main">{contact.service || 'General Inquiry'}</div>
                    <div className="text-xs text-gray-500 line-clamp-1">{contact.subject}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      contact.status?.mainStatus === 'new' ? 'bg-blue-100 text-blue-600' :
                      contact.status?.mainStatus === 'processing' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {contact.status?.mainStatus || 'New'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => openModal(contact)} className="p-1.5 text-gray-400 hover:text-main transition-colors">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => handleDelete(contact._id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {showModal && selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-800">Inquiry Details</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Full Name</label>
                  <p className="font-semibold text-gray-800 flex items-center gap-2"><User size={14} className="text-main" /> {selectedContact.name}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Email</label>
                  <p className="font-semibold text-gray-800 flex items-center gap-2"><Mail size={14} className="text-main" /> {selectedContact.email}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Phone</label>
                  <p className="font-semibold text-gray-800 flex items-center gap-2"><Phone size={14} className="text-main" /> {selectedContact.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Service</label>
                  <p className="font-semibold text-main uppercase text-xs tracking-wider">{selectedContact.service || 'General'}</p>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Subject</label>
                <p className="font-semibold text-gray-800 mb-2">{selectedContact.subject}</p>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={12} /> Received: {new Date(selectedContact.createdAt).toLocaleString()}
                </div>
                <div className="flex gap-2">
                  {selectedContact.status?.mainStatus !== 'completed' && (
                    <button 
                      onClick={() => handleUpdateStatus(selectedContact._id, 'completed')}
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                    >
                      <CheckCircle size={16} /> Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactManagement;
