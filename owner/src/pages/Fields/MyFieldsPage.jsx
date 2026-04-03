import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FieldCard from '../../components/Fields/FieldCard';
import { Plus } from 'lucide-react';

const DUMMY_FIELDS = [
  { id: 1, name: 'Sunrise Football Court A', sportType: 'Football', size: '5-a-side', location: 'Maadi, Cairo', price: 250, rating: 4.8, reviews: 120, status: 'Active', isActive: true, image: 'https://images.unsplash.com/photo-1518605368461-1ee7c688b5ea?q=80&w=800&auto=format&fit=crop' },
  { id: 2, name: 'Sunrise Basketball Arena', sportType: 'Basketball', size: 'Full Court', location: 'Downtown, Cairo', price: 300, rating: 4.9, reviews: 88, status: 'Pending Review', isActive: false, image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop' },
  { id: 3, name: 'Downtown Tennis Court', sportType: 'Tennis', size: 'Singles', location: 'New Cairo, Cairo', price: 200, rating: 4.5, reviews: 54, status: 'Maintenance', isActive: false, image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800&auto=format&fit=crop' }
];

const MyFieldsPage = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState(DUMMY_FIELDS);
  const [activeTab, setActiveTab] = useState('All');

  // دالة الـ Toggle (بتفتح وتقفل الملعب وتغير لونه)
  const handleToggleField = (id) => {
    setFields(prevFields => prevFields.map(field => {
      if (field.id === id) {
        const newActiveState = !field.isActive;
        const newStatus = field.status === 'Pending Review' ? 'Pending Review' : (newActiveState ? 'Active' : 'Maintenance');
        return { ...field, isActive: newActiveState, status: newStatus };
      }
      return field;
    }));
  };

  // الذهاب لصفحة الجدول
  const handleManageSchedule = (id) => {
    navigate('/schedule');
  };

  // تعديل الملعب
  const handleEditField = (field) => {
    alert(`Editing: ${field.name} \nقريباً هنربطها بصفحة التعديل!`);
  };

  // 🚨 زرار إضافة ملعب (غير المسار ده للمسار بتاع صفحتك الحقيقية)
  const handleAddNewField = () => {
    navigate('/add-new-field'); // <--- غير دي يا هندسة
  };

  const counts = {
    All: fields.length,
    Active: fields.filter(f => f.status === 'Active').length,
    'Pending Review': fields.filter(f => f.status === 'Pending Review').length,
    Maintenance: fields.filter(f => f.status === 'Maintenance').length,
  };

  const filteredFields = fields.filter(field => {
    if (activeTab === 'All') return true;
    return field.status === activeTab;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Fields</h1>
          <p className="text-sm text-gray-500">Dashboard / My Fields</p>
        </div>
        <button 
          onClick={handleAddNewField}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-5 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={20} /> Add New Field
        </button>
      </div>

      <div className="border-b border-gray-200 mb-8">
        <nav className="flex gap-8">
          {['All', 'Active', 'Pending Review', 'Maintenance'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-medium relative transition-colors ${activeTab === tab ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab === 'All' ? 'All Fields' : tab === 'Maintenance' ? 'Inactive/Maintenance' : tab} 
              <span className="ml-1.5 text-xs bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full">{counts[tab]}</span>
              {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFields.map(field => (
          <FieldCard 
            key={field.id} 
            field={field} 
            onToggle={handleToggleField}
            onManageSchedule={handleManageSchedule}
            onEdit={handleEditField}
          />
        ))}
        {filteredFields.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 border-dashed">
            No fields found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFieldsPage;