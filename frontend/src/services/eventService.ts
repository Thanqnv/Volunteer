/**
 * @file eventService.js
 * @description Event service (User + Admin)
 */
import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  console.log('[EventService] Token from localStorage:', token ? 'exists' : 'missing');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const eventService = {
  /* USER */

  getAllEvents: async (params = {}) => {
    const res = await axios.get(`${API_BASE_URL}/api/events`, { params });
    return res;
  },

  getEventDetails: async (eventId) => {
    const res = await axios.get(`${API_BASE_URL}/api/events/${eventId}`);
    // API returns {data: {...}, message, detail} - extract actual event data
    return res.data?.data || res.data;
  },

  registerEvent: async (eventId) => {
    const res = await axios.post(
      `${API_BASE_URL}/api/events/${eventId}/participants`,
      {},
      { 
        headers: getAuthHeader(),
        withCredentials: true
      }
    );
    return res.data;
  },

  cancelRegistration: async (eventId) => {
    const res = await axios.post(
      `${API_BASE_URL}/api/events/${eventId}/cancel`,
      {},
      { headers: getAuthHeader() }
    );
    return res.data;
  },

  /* ADMIN */

  getAllEventsAdmin: async () => {
    const normalizeAdminEvent = (event = {}) => ({
      id: event.id || event.event_id,
      name: event.name || event.title || '',
      category: event.category || '',
      status: event.status || 'PENDING',
      createdBy: event.createdBy || event.creatorName || '',
      location: event.location || '',
      startDate: event.startDate || event.start_time || '',
      endDate: event.endDate || event.end_time || '',
      description: event.description || '',
      volunteerCount: event.volunteerCount ?? 0,
      pendingRegistrations: event.pendingRegistrations ?? 0,
      notes: event.notes || '',
    });

    const res = await axios.get(`${API_BASE_URL}/api/admin/events`, {
      headers: getAuthHeader(),
    });

    const rawEvents = res.data?.data || res.data || [];

    return rawEvents.map(normalizeAdminEvent);
  },

  approveEvent: async (eventId) => {
    const res = await axios.put(
      `${API_BASE_URL}/api/admin/events/${eventId}/approval`,
      { status: 'APPROVED' },
      { headers: getAuthHeader() }
    );
    return res.data;
  },

  rejectEvent: async (eventId, reason) => {
    const res = await axios.put(
      `${API_BASE_URL}/api/admin/events/${eventId}/approval`,
      { status: 'REJECTED', reason },
      { headers: getAuthHeader() }
    );
    return res.data;
  },

  deleteEvent: async (eventId) => {
    const res = await axios.delete(
      `${API_BASE_URL}/api/admin/events/${eventId}`,
      { headers: getAuthHeader() }
    );
    return res.data;
  },

  getUpcomingEventsCount: async () => {
    const res = await axios.get(`${API_BASE_URL}/api/events/upcoming-count`);
    const data = res.data?.data;
    // Backend returns { data: [...], message: "...", detail: null }
    // So we need to get array length
    return Array.isArray(data) ? data.length : 0;
  },

  getRegisteredEventsCount: async () => {
    const res = await axios.get(`${API_BASE_URL}/api/events/registered-events-count`);
    // Backend returns { data: number, message: "...", detail: null }
    return res.data?.data || 0;
  },
};
