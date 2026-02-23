import axios from 'axios';

const WALLET_API_URL = "http://turfy.runasp.net/Turfy/GetByIdWalletEndpoint/Execute";

// Map frontend filter strings to Backend Enum values (from your screenshot)
const FILTER_MAP = {
  "All Transactions": 1, // All
  "Debit": 2,            // Payments
  "Credit": 3            // Refunds
};

// Helper to get headers with Token
const getAuthHeaders = () => {
  const userStr = localStorage.getItem('turfy_user');
  if (!userStr) return {};
  
  const user = JSON.parse(userStr);
  return user.token ? { Authorization: `Bearer ${user.token}` } : {};
};

/**
 * Fetches the user's current wallet balance.
 * Uses the same endpoint but limits transaction count to 0 to just get the balance metadata.
 * @returns {Promise<Object>} Object containing amount and currency.
 */
export const getWalletBalance = async () => {
  try {
    const response = await axios.get(WALLET_API_URL, {
      params: {
        TakenCount: 0,
        NeededCount: 0, // We only want the wallet balance details
        filter: 1,      // Default to All
      },
      headers: getAuthHeaders()
    });

    if (response.data?.isSuccess) {
      const data = response.data.data;
      return { 
        data: {
          amount: data.balance || data.totalBalance || 0, // Adjust key based on actual API response
          currency: "EGP" 
        }, 
        error: null 
      };
    }
    
    return { data: null, error: response.data?.message || "Failed to fetch balance" };

  } catch (error) {
    console.error("API Error: getWalletBalance", error);
    return { data: null, error: "Could not load wallet balance." };
  }
};

/**
 * Fetches transaction history with API filters.
 * @param {string} filterType - 'All Transactions', 'Credit', or 'Debit'
 * @param {string} date - Specific date to filter by (YYYY-MM-DD)
 */
export const getTransactions = async (filterType = "All Transactions", date = "") => {
  try {
    // 1. Prepare Params
    const filterValue = FILTER_MAP[filterType] || 1; // Default to 1 (All)
    
    const params = {
      TakenCount: 0,   // Skip (Pagination start)
      NeededCount: 100, // Take (Pagination limit)
      filter: filterValue,
    };

    // Only add Date if it's selected/valid
    if (date) {
      params.Date = date;
    }

    // 2. Call API
    const response = await axios.get(WALLET_API_URL, {
      params: params,
      headers: getAuthHeaders()
    });

    // 3. Process Response
    if (response.data?.isSuccess) {
      const apiTransactions = response.data.data?.transactions || []; // Adjust path if nested differently

      // 4. Map Backend Data to Frontend Format
      const mappedTransactions = apiTransactions.map((t, index) => {
        // Determine Credit vs Debit logic
        // If API returns an Enum type (2=Payment/Debit, 3=Refund/Credit)
        // Or if it simply sends "isCredit"
        // Fallback: Check if Amount is negative or assume based on type
        
        let isCredit = false;
        
        // Logic: If filter was 'Credit' (3), it's definitely credit. 
        // If backend sends 'transactionType': 3 -> Credit, 2 -> Debit
        if (t.transactionType === 3 || t.type === "Refund" || t.type === "Deposit") {
            isCredit = true;
        } 
        // Fallback if backend doesn't send explicit type ID but we requested 'Payments'
        else if (filterValue === 2) { 
            isCredit = false;
        }
        else if (filterValue === 3) {
            isCredit = true;
        }

        return {
          id: t.id || t.transactionId || index,
          type: t.name || t.title || (isCredit ? "Refund / Credit" : "Payment"), // Use backend Name or default
          date: t.date ? t.date.split('T')[0] : new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
          amount: Math.abs(t.amount || 0), // Ensure positive number for display
          isCredit: isCredit
        };
      });

      return { data: mappedTransactions, error: null };
    }

    return { data: [], error: response.data?.message || "Failed to load transactions." };

  } catch (error) {
    console.error("API Error: getTransactions", error);
    return { data: [], error: "Could not load transactions." };
  }
};