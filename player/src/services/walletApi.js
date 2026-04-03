import  API  from './API';

const WALLET_API_URL = "http://turfy.runasp.net/Turfy/GetPlayerWalletEndpoint/Execute";
const TRANSACTIONS_API_URL = "http://turfy.runasp.net/Turfy/GetWalletTransactionsEndpoint/Execute";

const FILTER_MAP = {
  "All Transactions": 1,
  "Debit": 2,
  "Credit": 3
};

export const getWalletBalance = async () => {
  try {
    const response = await API.get(WALLET_API_URL);

    if (response.data?.isSuccess) {
      const data = response.data.data;
      return {
        data: {
          amount: data.balance || data.totalBalance || 0,
          currency: "EGP",
          walletId: data.walletId || data.id || null,
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

export const getTransactions = async (walletId, filterType = "All Transactions", date = "") => {
  try {
    if (!walletId) {
      console.warn("getTransactions called without a walletId");
      return { data: [], error: "Wallet ID is missing." };
    }

    const filterValue = FILTER_MAP[filterType] || 1;

    const params = {
      
      limit: 100,
      filter: filterValue,
    };

    if (date) {
      params.date = date;
    }

    const response = await API.get(TRANSACTIONS_API_URL, { params });

    if (response.data?.isSuccess) {
      // Response uses "history" not "transactions"
      const APITransactions = response.data.data?.items || [];

      const mappedTransactions = APITransactions.map((t, index) => ({
        id: t.id ?? t.transactionId ?? index,
        type: t.title || (t.isCredit ? "Refund / Credit" : "Payment"),
        date: t.transactionDate ? t.transactionDate.split('T')[0] : new Date().toISOString().split('T')[0],
        amount: Math.abs(t.amount || 0),
        currency: t.currency || "EGP",
        isCredit: t.isCredit,
      }));

      return { data: mappedTransactions, error: null };
    }

    return { data: [], error: response.data?.message || "Failed to load transactions." };

  } catch (error) {
    console.error("API Error: getTransactions", error);
    return { data: [], error: "Could not load transactions." };
  }
};