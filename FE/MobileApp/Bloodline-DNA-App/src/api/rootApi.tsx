import axios from 'axios';

const rootApi = axios.create({
  baseURL: 'http://173.208.142.11:8084/api',
});

export default rootApi;

export const BASE_URL = "http://173.208.142.11:8084/api";

export const STAFF_BASE_URL = "https://api.adntester.duckdns.org";