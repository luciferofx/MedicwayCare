import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import url_prefix from '../data/variable';
import { Edit2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const EditableText = ({ page, section, itemKey, initialValue, className, tagName = 'div', isRichText = false, value: propValue }) => {
  const { isAuthenticated, getToken } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(propValue || initialValue);
  const [tempValue, setTempValue] = useState(propValue || initialValue);
  const [loading, setLoading] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const newValue = propValue !== undefined ? propValue : initialValue;
    setValue(newValue);
    setTempValue(newValue);
  }, [initialValue, propValue]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${url_prefix}/admin/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          page,
          section,
          key: itemKey,
          value: tempValue,
          language: 'EN' // Default to EN for now
        })
      });

      const result = await response.json();
      if (result.success) {
        setValue(tempValue);
        setIsEditing(false);
        toast.success('Content updated successfully');
      } else {
        toast.error(result.error || 'Failed to update content');
      }
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('Error updating content');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const Tag = tagName;

  if (!isAuthenticated) {
    return <Tag className={className}>{value}</Tag>;
  }

  return (
    <div className={`relative group/editable ${isEditing ? 'ring-2 ring-teal-500 rounded p-1' : ''}`}>
      {isEditing ? (
        <div className="flex flex-col gap-2">
          {isRichText ? (
            <textarea
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800 ${className}`}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              rows={4}
            />
          ) : (
            <input
              type="text"
              className={`w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800 ${className}`}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
            />
          )}
          <div className="flex justify-end gap-2 mt-1">
            <button
              onClick={handleSave}
              disabled={loading}
              className="p-1 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50"
              title="Save"
            >
              <Check size={16} />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 bg-gray-400 text-white rounded hover:bg-gray-500"
              title="Cancel"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <Tag className={className}>{value}</Tag>
          <button
            onClick={() => setIsEditing(true)}
            className="absolute -top-2 -right-2 p-1 bg-teal-600 text-white rounded-full opacity-0 group-hover/editable:opacity-100 transition-opacity shadow-lg z-20"
            title="Edit"
          >
            <Edit2 size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableText;
