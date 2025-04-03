import axios from 'axios';
import { Categories } from '@/types/categories';

const API_URL = 'http://localhost:8001/categories';

export const categoriesService = {
  async getCategories(): Promise<Categories> {
    const { data } = await axios.get(API_URL);
    return data;
  }
};