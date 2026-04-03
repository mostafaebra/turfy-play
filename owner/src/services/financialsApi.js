import API from './api'; 

export const fetchOwnerFields = async () => {
  try {
    const response = await API.get('/Turfy/GetFieldsByOwnerEndpoint/GetFieldsByOwner');
    return response.data;
  } catch (error) {
    console.error("Error fetching owner fields:", error);
    throw error;
  }
};

// 1. GetBalances
export const fetchBalances = async (fieldWalletId) => {
  try {
    const response = await API.get('/Turfy/GetFieldWalletBalancesEndpoint/GetBalances', {
      params: { fieldWalletId } 
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching balances:", error);
    throw error;
  }
};


export const fetchWithdrawals = async (fieldWalletId, limit = 10, cursor = null) => {
  try {
    const response = await API.post('/Turfy/GetWithdrawalRequestsEndpoint/GetWithdrawals', {
      fieldWalletId,
      limit,
      cursor
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    throw error;
  }
};

export const fetchTransactions = async (fieldWalletId, limit = 10, cursor = null) => {
  try {
    const response = await API.post('/Turfy/GetFieldTransactionsEndpoint/GetTransactions', {
      fieldWalletId,
      limit,
      cursor
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};


export const requestWithdrawal = async (fieldWalletId, amount, notes) => {
  try {
    const response = await API.post('/Turfy/RequestWithdrawalEndpoint/RequestWithdrawal', {
      fieldWalletId,
      amount,
      notes
    });
    return response.data;
  } catch (error) {
    console.error("Error requesting withdrawal:", error);
    throw error;
  }
};