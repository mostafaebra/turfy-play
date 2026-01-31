import React, { useState } from "react";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Edit2, 
  Plus, 
  Menu // Imported Menu icon for mobile toggle
} from "lucide-react";

import Sidebar from "../../components/Sidebar/Sidebar";

// Modal Imports
import AddOfflineBookingModal from "../../components/Schedule/Modals/AddOfflineBookingModal";
import VerifyBookingModal from "../../components/Schedule/Modals/VerifyBookingModal";
import EditBookingModal from "../../components/Schedule/Modals/EditBookingModal";
import SetPricingModal from "../../components/Schedule/Modals/SetPricingModal";

const SchedulePage = () => {
  // Mock Data for UI visualization
  const mockSchedule = [
    { id: 1, time: "10:00", ampm: "AM", status: "closed" },
    {
      id: 2,
      time: "11:00",
      ampm: "AM",
      status: "online",
      player: "Ahmed Ali",
      type: "3 Hours",
      price: 300,
      isPaid: true,
    },
    {
      id: 3,
      time: "12:00",
      ampm: "PM",
      status: "offline",
      player: "Captain Mohamed",
      price: 250,
      paymentStatus: "Manual / Cash",
    },
    { id: 4, time: "01:00", ampm: "PM", status: "available", price: 300 },
    { id: 5, time: "02:00", ampm: "PM", status: "available", price: 300 },
  ];

  // --- State Management ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state
  
  // Modals state
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  // --- Handlers ---
  const handleOpenAddModal = (slot) => {
    setSelectedSlot(slot);
    setIsAddModalOpen(true);
  };

  const handleOpenVerifyModal = (slot) => {
    setSelectedSlot(slot);
    setIsVerifyModalOpen(true);
  };

  const handleOpenEditModal = (slot) => {
    setSelectedSlot(slot);
    setIsEditModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      
      {/* --- Mobile Sidebar Overlay --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- Sidebar (Responsive) --- */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar />
      </div>

      {/* --- Main Content --- */}
      <div className="flex-1 h-screen overflow-y-auto p-4 md:p-6">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-6">
          
          {/* Top Row: Mobile Menu + Title */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 bg-white border rounded-lg text-gray-600 md:hidden hover:bg-gray-50"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Schedule Management
            </h1>
          </div>

          {/* Controls Row (Wrapped for mobile) */}
          <div className="flex flex-wrap items-center gap-3 justify-between md:justify-end">
            
            {/* Edit Pricing Button */}
            <button
              onClick={() => setIsPricingModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg text-sm text-gray-600 hover:bg-gray-50 shadow-sm transition-all flex-grow md:flex-grow-0 justify-center"
            >
              <Edit2 size={16} />
              <span>Edit Pricing</span>
            </button>

            {/* Field Select */}
            <div className="relative flex-grow md:flex-grow-0">
              <select className="w-full appearance-none bg-white border rounded-lg px-4 py-2 pr-8 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer">
                <option>Al Ahly Field 1</option>
                <option>Al Ahly Field 2</option>
              </select>
            </div>

            {/* Date Navigator */}
            <div className="flex items-center bg-white border rounded-lg shadow-sm flex-grow md:flex-grow-0 justify-center">
              <button className="p-2 hover:bg-gray-100 rounded-l-lg">
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-2 px-3 py-2 border-x min-w-[120px] justify-center">
                <Calendar size={16} className="text-gray-500" />
                <span className="text-sm font-medium">10/27/2023</span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-r-lg">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Legend Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-4 md:gap-6 items-center border border-gray-100 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-200"></span>
            <span className="text-gray-600">Online (Paid)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600 shadow-sm shadow-blue-200"></span>
            <span className="text-gray-600">Offline (Cash)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border border-gray-300 bg-gray-50"></span>
            <span className="text-gray-600">Available</span>
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-4 pb-20">
          {mockSchedule.map((slot) => (
            <div
              key={slot.id}
              className="flex flex-col md:flex-row gap-2 md:gap-4 group"
            >
              {/* Time Column */}
              <div className="flex items-center md:block md:w-24 md:pt-4 text-gray-500 font-semibold text-lg">
                <span className="mr-2 md:mr-0">{slot.time}</span>
                <span className="text-sm font-normal text-gray-400">
                  {slot.ampm}
                </span>
              </div>

              {/* Slot Card */}
              <div className="flex-1">
                
                {/* 1. Closed State */}
                {slot.status === "closed" && (
                  <div className="w-full bg-gray-100 h-20 md:h-24 rounded-xl flex items-center justify-center text-gray-400 font-medium border border-gray-200 text-sm md:text-base">
                    Closed
                  </div>
                )}

                {/* 2. Available State */}
                {slot.status === "available" && (
                  <div className="w-full bg-white border border-dashed border-gray-300 h-auto min-h-[5rem] md:h-24 rounded-xl p-3 md:p-4 flex justify-between items-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group-hover:shadow-sm">
                    <div className="text-gray-500">
                      <p className="font-bold text-base md:text-lg text-gray-700">
                        {slot.price} EGP
                      </p>
                      <p className="text-xs md:text-sm">Available Slot</p>
                    </div>
                    <button
                      onClick={() => handleOpenAddModal(slot)}
                      className="flex items-center gap-1 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-sm"
                    >
                      <Plus size={16} /> <span className="hidden xs:inline">Book</span> Offline
                    </button>
                  </div>
                )}

                {/* 3. Online State */}
                {slot.status === "online" && (
                  <div className="w-full bg-green-50 border border-green-200 h-auto min-h-[5rem] md:h-24 rounded-xl p-3 md:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center relative overflow-hidden shadow-sm gap-3 sm:gap-0">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500"></div>
                    <div className="pl-2">
                      <h3 className="font-bold text-gray-800 flex flex-wrap items-center gap-2 text-base md:text-lg">
                        {slot.player}
                        <span className="text-[10px] md:text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200 whitespace-nowrap">
                          Paid Online
                        </span>
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <Calendar size={14} /> {slot.type}
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenVerifyModal(slot)}
                      className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium shadow-md shadow-green-200 transition-all text-sm"
                    >
                      Verify
                    </button>
                  </div>
                )}

                {/* 4. Offline State */}
                {slot.status === "offline" && (
                  <div className="w-full bg-blue-50 border border-blue-200 h-auto min-h-[5rem] md:h-24 rounded-xl p-3 md:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center relative overflow-hidden shadow-sm gap-3 sm:gap-0">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600"></div>
                    <div className="pl-2">
                      <h3 className="font-bold text-gray-800 text-base md:text-lg">
                        {slot.player}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 mt-1">
                        Status:{" "}
                        <span className="font-medium text-blue-700">
                          {slot.paymentStatus}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenEditModal(slot)}
                      className="w-full sm:w-auto bg-white border border-blue-200 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium transition-all text-sm"
                    >
                      Edit / Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* --- Modals Injection --- */}
        <SetPricingModal
          isOpen={isPricingModalOpen}
          onClose={() => setIsPricingModalOpen(false)}
        />

        <AddOfflineBookingModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          slotData={selectedSlot}
          fullSchedule={mockSchedule}
        />

        <VerifyBookingModal
          isOpen={isVerifyModalOpen}
          onClose={() => setIsVerifyModalOpen(false)}
          slotData={selectedSlot}
        />

        <EditBookingModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          slotData={selectedSlot}
        />
      </div>
    </div>
  );
};

export default SchedulePage;