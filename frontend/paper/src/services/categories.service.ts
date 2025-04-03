import axios from 'axios';
import { Categories } from '@/types/categories';
import { API_BASE_URL } from '@/config/api';

export const categoriesService = {
  async getCategories(): Promise<Categories> {
    const { data } = await axios.get(`${API_BASE_URL}/categories`);
    return data;
  }
};