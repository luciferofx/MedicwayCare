import React, { useState } from 'react';
import { 
  Calendar, Clock, User, Phone, Mail, 
  Hospital, UserPlus, CheckCircle, XCircle, 
  Trash2, Eye, Filter, MessageSquare,
  AlertCircle
} from 'lucide-react';
import { 
  useGetBookingsQuery, 
  useUpdateBookingStatusMutation, 
  useDeleteBookingMutation 
} from '../../rtk/slices/bookingApiSlice';
import { toast } from 'react-hot-toast';

const AppointmentManagement = () => {
  const [filterType, setFilterType] = useState('all'); // all, appointment, query
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // RTK Query hooks
  const { data: bookingsData, isLoading, error, refetch } = useGetBookingsQuery({
    type: filterType === 'all' ? undefined : filterType,
    status: filterStatus === 'all' ? undefined : filterStatus
  });

  const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();
  const [deleteBooking] = useDeleteBookingMutation();

  const bookings = bookingsData?.data || [];

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateStatus({ 
        id, 
        status: { mainStatus: newStatus } 
      }).unwrap();
      toast.success(`Status updated to ${newStatus}`);
      if (selectedBooking?._id === id) {
        setSelectedBooking(prev => ({
          ...prev,
          status: { ...prev.status, mainStatus: newStatus }
        }));
      }
    } catch (err) {
      toast.error('Failed to update status');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      await deleteBooking(id).unwrap();
      toast.success('Booking deleted successfully');
      setShowModal(false);
    } catch (err) {
      toast.error('Failed to delete booking');
    }
  };

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
    // Mark as read if it's new (logic can be added to backend)
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 border border-red-100 rounded-xl m-6">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-red-800">Connection Error</h3>
        <p className="text-red-600">Could not load appointment data. Please verify your backend connection.</p>
        <button onClick={() => refetch()} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg text-sm">Retry</button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Appointment Management</h1>
          <p className="text-gray-500 text-sm">Track consultations and patient inquiries</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">
            <Filter size={14} className="text-gray-400 mr-2" />
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="text-sm font-medium focus:outline-none bg-transparent"
            >
              <option value="all">All Types</option>
              <option value="appointment">Appointments</option>
              <option value="query">Queries</option>
            </select>
          </div>

          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm font-medium focus:outline-none bg-transparent"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Patient Info</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Requested For</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <Calendar size={32} className="text-gray-200" />
                      <span>No records found matching your filters</span>
                    </div>
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          booking.type === 'appointment' ? 'bg-teal-100 text-teal-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {booking.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-800">{booking.name}</div>
                          <div className="text-[11px] text-gray-500 flex items-center gap-1">
                            <span className={`px-1 rounded text-[8px] uppercase font-black ${
                              booking.type === 'appointment' ? 'bg-teal-50 text-teal-600' : 'bg-blue-50 text-blue-600'
                            }`}>
                              {booking.type}
                            </span>
                            {booking.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-700">
                        {booking.doctor?.name || 'Doctor Not Found'}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <Hospital size={10} /> {booking.hospital?.name || 'Unknown Hospital'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {booking.type === 'appointment' ? (
                        <>
                          <div className="text-sm font-medium text-gray-700 flex items-center gap-1">
                            <Calendar size={12} className="text-teal-600" />
                            {new Date(booking.date).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={12} /> {booking.time}
                          </div>
                        </>
                      ) : (
                        <div className="text-xs text-gray-400 flex items-center gap-1 italic">
                          <MessageSquare size={12} /> Inquiry Only
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        booking.status?.mainStatus === 'scheduled' ? 'bg-yellow-100 text-yellow-700' :
                        booking.status?.mainStatus === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status?.mainStatus === 'completed' ? 'bg-teal-100 text-teal-700' :
                        booking.status?.mainStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {booking.status?.mainStatus || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button 
                          onClick={() => openModal(booking)}
                          className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(booking._id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col scale-100 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${
                  selectedBooking.type === 'appointment' ? 'bg-teal-100 text-teal-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {selectedBooking.type === 'appointment' ? <Calendar size={20} /> : <MessageSquare size={20} />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Booking Details</h2>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">ID: {selectedBooking._id}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto space-y-8">
              {/* Patient and Request Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Patient Information</label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><User size={14} className="text-gray-500" /></div>
                      <span className="text-sm font-bold text-gray-800">{selectedBooking.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><Mail size={14} className="text-gray-500" /></div>
                      <span className="text-sm text-gray-600">{selectedBooking.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><Phone size={14} className="text-gray-500" /></div>
                      <span className="text-sm text-gray-600">{selectedBooking.phone}</span>
                    </div>
                  </div>
                </section>

                <section>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Medical Details</label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><UserPlus size={14} className="text-teal-600" /></div>
                      <div>
                          Dr. {selectedBooking.doctor?.name || 'Unknown'}
                        <span className="text-[10px] text-gray-400 uppercase">{selectedBooking.doctor?.specialty || 'General Practice'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><Hospital size={14} className="text-teal-600" /></div>
                      <span className="text-sm text-gray-600">{selectedBooking.hospital?.name}</span>
                    </div>
                  </div>
                </section>
              </div>

              {/* Schedule and Message */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Date</label>
                    <div className="text-sm font-bold text-gray-800">
                      {selectedBooking.date ? new Date(selectedBooking.date).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Time</label>
                    <div className="text-sm font-bold text-gray-800">{selectedBooking.time || 'N/A'}</div>
                  </div>
                </div>
                
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase block mb-2">Message / Note</label>
                  <div className="text-sm text-gray-600 leading-relaxed bg-white p-4 rounded-xl border border-gray-100">
                    {selectedBooking.message || "No specific instructions provided."}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer (Actions) */}
            <div className="p-6 border-t border-gray-100 bg-white flex flex-wrap gap-3 justify-end items-center">
              <div className="mr-auto">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                  selectedBooking.status?.mainStatus === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  Current Status: {selectedBooking.status?.mainStatus}
                </span>
              </div>
              
              {selectedBooking.status?.mainStatus !== 'cancelled' && (
                <button 
                  onClick={() => handleStatusUpdate(selectedBooking._id, 'cancelled')}
                  className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2"
                >
                  <XCircle size={16} /> Cancel
                </button>
              )}

              {selectedBooking.status?.mainStatus !== 'confirmed' && selectedBooking.status?.mainStatus !== 'completed' && (
                <button 
                  onClick={() => handleStatusUpdate(selectedBooking._id, 'confirmed')}
                  disabled={isUpdating}
                  className="px-6 py-2 text-sm font-bold bg-teal-600 text-white hover:bg-teal-700 rounded-xl transition-shadow shadow-sm hover:shadow-md disabled:bg-gray-300 flex items-center gap-2"
                >
                  <CheckCircle size={16} /> {isUpdating ? 'Updating...' : 'Confirm Appointment'}
                </button>
              )}

              {selectedBooking.status?.mainStatus === 'confirmed' && (
                <button 
                  onClick={() => handleStatusUpdate(selectedBooking._id, 'completed')}
                  className="px-6 py-2 text-sm font-bold bg-gray-900 text-white hover:bg-black rounded-xl transition-shadow shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  <CheckCircle size={16} /> Mark as Completed
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;
