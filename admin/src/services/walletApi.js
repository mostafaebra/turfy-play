// src/services/walletApi.js

/**
 * Simulates an API call delay.
 * @param {number} ms - Milliseconds to delay
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock Data
const MOCK_BALANCE = { amount: 500, currency: "EGP" };

const MOCK_TRANSACTIONS = [
  { id: 1, type: "Booking Refund", date: "2024-06-15", amount: 100, isCredit: true },
  { id: 2, type: "Venue Booking", date: "2024-06-14", amount: 250, isCredit: false },
  { id: 3, type: "Competition Payout", date: "2024-06-12", amount: 500, isCredit: true },
  { id: 4, type: "Wallet Top Up", date: "2024-06-10", amount: 300, isCredit: true },
  { id: 5, type: "Competition Entry Fee", date: "2024-06-09", amount: 150, isCredit: false },
];

/**
 * Fetches the user's current wallet balance.
 * @returns {Promise<Object>} Object containing amount and currency.
 */
export const getWalletBalance = async () => {
  try {
    await delay(500); // Simulate network latency
    
    // Edge Case: Simulate occasional server error (optional, for testing)
    // if (Math.random() < 0.1) throw new Error("Failed to fetch balance");

    return { data: MOCK_BALANCE, error: null };
  } catch (error) {
    console.error("API Error: getWalletBalance", error);
    return { data: null, error: "Could not load wallet balance." };
  }
};

/**
 * Fetches transaction history with optional filters.
 * @param {string} filterType - 'All', 'Credit', or 'Debit'
 * @param {string} date - Specific date to filter by (YYYY-MM-DD)
 */
export const getTransactions = async (filterType = "All Transactions", date = "") => {
  try {
    await delay(800); 

    let filtered = [...MOCK_TRANSACTIONS];

    // Filter by Type (Credit/Debit)
    if (filterType === "Credit") {
      filtered = filtered.filter((t) => t.isCredit);
    } else if (filterType === "Debit") {
      filtered = filtered.filter((t) => !t.isCredit);
    }

    // Filter by Date
    if (date) {
      filtered = filtered.filter((t) => t.date === date);
    }

    return { data: filtered, error: null };
  } catch (error) {
    console.error("API Error: getTransactions", error);
    return { data: [], error: "Could not load transactions." };
  }
};