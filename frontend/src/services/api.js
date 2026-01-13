import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const extractReceipt = async (bank, url) => {
  const response = await api.post('/receipts/extract', { bank, url });
  return response.data.data;
};

export const getSupportedBanks = async () => {
  const response = await api.get('/receipts/banks');
  return response.data.data;
};

export const getReceiptById = async (id) => {
  const response = await api.get(`/receipts/${id}`);
  return response.data.data;
};
