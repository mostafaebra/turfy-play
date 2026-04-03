import React from 'react';
import { MapPin, Star, Edit2 } from 'lucide-react';

const FieldCard = ({ field, onToggle, onManageSchedule, onEdit }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><span className="w-1.5 h-1.5 bg-white rounded-full"></span>Active</span>;
      case 'Pending Review':
        return <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><span className="w-1.5 h-1.5 bg-white rounded-full"></span>Pending Approval</span>;
      case 'Maintenance':
        return <span className="absolute top-3 right-3 bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><span className="w-1.5 h-1.5 bg-white rounded-full"></span>Maintenance</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="relative h-48 w-full bg-gray-200">
        <img src={field.image} alt={field.name} className="w-full h-full object-cover" />
        {getStatusBadge(field.status)}
      </div>

      <div className="p-5 flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-3">{field.name}</h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500 gap-2">
            <span>⚽</span> {field.sportType} • {field.size}
          </div>
          <div className="flex items-center text-sm text-gray-500 gap-2">
            <MapPin size={16} className="text-gray-400" /> {field.location}
          </div>
          <div className="flex items-center text-sm text-gray-500 gap-2">
            <span className="font-bold">💵</span> {field.price} EGP / Hour
          </div>
          <div className="flex items-center text-sm text-gray-500 gap-2">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="text-gray-700 font-medium">{field.rating}</span> ({field.reviews} Reviews)
          </div>
        </div>
      </div>

      <div className="px-5 py-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onManageSchedule(field.id)}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            Manage Schedule
          </button>
          <button 
            onClick={() => onEdit(field)}
            className="text-sm font-semibold text-gray-500 hover:text-gray-800 flex items-center gap-1 transition-colors"
          >
            <Edit2 size={14} /> Edit
          </button>
        </div>
        
        {/* زرار الـ Toggle */}
        <button 
          onClick={() => onToggle(field.id)}
          className={`w-11 h-6 rounded-full relative transition-colors duration-300 focus:outline-none ${field.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${field.isActive ? 'left-6' : 'left-1'}`}></span>
        </button>
      </div>
    </div>
  );
};

export default FieldCard;