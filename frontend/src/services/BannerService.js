import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL_BACKEND}/banner`;

export const getAllBanner = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};


export const createBanner = async (data, acces_token) => {
  const res = await axios.post(`${API_URL}`, data, {
    headers: {
      token: `Bearer ${acces_token}`,
    }
  })
  return res.data;
};

export const updateBanner = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteBanner = async (id, access_token) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      token: `Bearer ${access_token}`
    }
  });
  return res.data;
}; 