
import { 
  Zap, CheckCircle2, DollarSign, TrendingUp, 
  Calendar, Timer, Star 
} from 'lucide-react';
export const STATS_DATA = [
  { id: 1, label: 'Active Offers', value: '12', icon: Zap, color: 'text-[#10b77f]' },
  { id: 2, label: 'Vouchers Redeemed', value: '1,248', icon: CheckCircle2, color: 'text-[#3b82f6]' },
  { id: 3, label: 'Total Revenue Saved', value: '$3,420', icon: DollarSign, color: 'text-[#10b77f]' },
  { id: 4, label: 'Avg. Redemption Rate', value: '14.2%', icon: TrendingUp, color: 'text-[#3b82f6]' },
];
// Add this to src/services/voucherapi.js
// Add these to your existing voucherapi.js file

const DASHBOARD_API_URL = "http://turfyplaydev.runasp.net/Turfy/GetVoucherDashboardEndpoint/Handle";
// Assuming you have an endpoint like this for deactivation; adjust if needed.
const TOGGLE_STATUS_API_URL = "http://turfyplaydev.runasp.net/Turfy/ToggleVoucherStatusEndpoint/Handle"; 
// Add page and pageSize parameters (defaults to page 1)
export const getVoucherDashboard = async (page = 1, pageSize = 10) => {
  try {
    // Append the pagination parameters to your URL. 
    // CHANGE THESE if your backend expects different names (like ?skip=10&take=10)
    const url = `${DASHBOARD_API_URL}?pageNumber=${page}&pageSize=${pageSize}`;
    
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) throw new Error("Failed to fetch dashboard data");
    
    const result = await response.json();
    if (!result.isSuccess) throw new Error(result.message);
    
    return result.data;
  } catch (error) {
    console.error("Dashboard Fetch Failed:", error);
    throw error;
  }
};

export const toggleVoucherStatus = async (id, currentStatus) => {
  try {
    // Replace with your actual Deactivate API logic if it differs
    const response = await fetch(`${TOGGLE_STATUS_API_URL}?id=${id}&isActive=${!currentStatus}`, {
      method: "get", 
    });
    if (!response.ok) throw new Error("Failed to change voucher status");
    return await response.json();
  } catch (error) {
    console.error("Status Toggle Failed:", error);
    throw error;
  }
};
const GET_BY_ID_URL = "http://turfyplaydev.runasp.net/Turfy/GetByIdVoucherEndpoint/Handle";

/**
 * Fetches voucher details by ID
 */
export const getVoucherById = async (id) => {
  try {
    const response = await fetch(`${GET_BY_ID_URL}?Id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    // Based on your JSON, the API returns { isSuccess, data, message }
    if (!result.isSuccess) {
      throw new Error(result.message || "Failed to fetch voucher details");
    }

    return result.data;
  } catch (error) {
    console.error("Fetch Voucher by ID Failed:", error);
    throw error;
  }
};
// RENAMED from VENUE_OFFERS to VENUE_VOUCHERS to match your import
export const VENUE_VOUCHERS = [
  {
    id: 1,
    title: '20% Off Mondays',
    desc: 'Valid every Monday between 5:00 PM - 7:00 PM',
    tag: 'Timed Promotion',
    tagColor: 'text-[#10b77f] bg-[#10b77f]/10',
    icon: Calendar,
    iconBg: 'bg-[#10b77f]/10 text-[#10b77f]',
  },
  {
    id: 2,
    title: 'Happy Hour Slots',
    desc: 'Flat $10 discount on late night weekday bookings',
    tag: 'Limited Time',
    tagColor: 'text-orange-600 bg-orange-100',
    icon: Timer,
    iconBg: 'bg-orange-100 text-orange-600',
  },
  {
    id: 3,
    title: 'Weekend Special',
    desc: 'Extra 15% off for groups larger than 10 players',
    tag: 'Recurring',
    tagColor: 'text-purple-600 bg-purple-100',
    icon: Star,
    iconBg: 'bg-purple-100 text-purple-600',
  },
];

export const NORMAL_VOUCHERS = [
  { id: 'TRF-7729-XC', type: 'TRUSTED', percent: '15%', desc: 'Standard loyalty reward', date: 'Oct 12, 2023', statusColor: 'bg-[#10b77f]/10 text-[#10b77f]' },
  { id: 'TRF-1102-AQ', type: 'NORMAL', percent: '5%', desc: 'New user first booking', date: 'Oct 10, 2023', statusColor: 'bg-slate-100 text-slate-500' },
  { id: 'TRF-8891-PL', type: 'ABUSER', percent: '0%', desc: 'Blocked - Suspicious activity', date: 'Oct 08, 2023', statusColor: 'bg-red-100 text-red-600' },
];

export const SPECIAL_VOUCHERS = [
  { code: 'SUMMER2024', usage: '500 / 1000', expiry: 'Aug 31, 2024', segment: 'All Customers', status: 'Active', statusColor: 'text-green-600' },
  { code: 'VIPEXCLU', usage: '12 / 50', expiry: 'Dec 31, 2023', segment: 'Tier 3 VIPs', status: 'Active', statusColor: 'text-green-600' },
  { code: 'WINBACK50', usage: '100 / 100', expiry: 'Expired', segment: 'Churned Users', status: 'Closed', statusColor: 'text-slate-400' },
];


const API_URL = "http://turfyplaydev.runasp.net/Turfy/CreateVoucherEndpoint/Handle";


export const createVoucher = async (payload) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add "Authorization": "Bearer <token>" here if needed
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Voucher Creation Failed:", error);
    throw error;
  }
};


const EDIT_API_URL = "http://turfyplaydev.runasp.net/Turfy/EditVoucherEndpoint/Handle";

export const editVoucher = async (payload) => {
  try {
    const response = await fetch(EDIT_API_URL, {
      method: "PUT", // 👈 CHANGED FROM "POST" TO "PUT"
      headers: {
        "Content-Type": "application/json",
        // "Authorization": "Bearer <token>" 
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Voucher Update Failed:", error);
    throw error;
  }
};


const DELETE_API_URL = "http://turfyplaydev.runasp.net/Turfy/DeleteVoucherEndpoint/Handle";

/**
 * Deletes a voucher by its ID
 */
export const deleteVoucher = async (id) => {
  try {
    const response = await fetch(`${DELETE_API_URL}?id=${id}`, {
      method: "DELETE", // Note: Change this to "POST" if your backend strictly uses POST for this endpoint
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Voucher Deletion Failed:", error);
    throw error;
  }
};
// Replace the old getFieldById with this native fetch version

export const getFieldById = async (fieldId) => {
  try {
    if (!fieldId) throw new Error('Field ID is required');

    const response = await fetch(
      `http://turfyplaydev.runasp.net/Turfy/GetByIdFieldEndpoint/Execute?FieldId=${fieldId}`,
      {
        method: 'GET',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Error fetching field');
    }

    const data = await response.json();

    return {
      success: true,
      data: data,
      message: 'Field retrieved successfully'
    };
  } catch (error) {
     return { 
       success: false, 
       message: error.message || 'Failed to connect to the server' 
     };
  }
};