const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Property {
  id: string;
  name: string;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  max_guests?: number;
}

export interface Reservation {
  id: string;
  property_id: string;
  check_in: string;
  check_out: string;
  guest_name?: string;
  status: string;
  total_price?: number;
}

export interface Message {
  id: string;
  reservation_id: string;
  body: string;
  created_at: string;
  sender: string;
}

export interface Review {
  id: string;
  property_id: string;
  rating: number;
  comment: string;
  guest_name?: string;
  created_at: string;
}

export class HospitableAPI {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('hospitable_token', token);
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('hospitable_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hospitable_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // User endpoints
  async getUser() {
    return this.request('/user');
  }

  async getTokenInfo() {
    return this.request('/token-info');
  }

  // Properties endpoints
  async listProperties(params?: {
    include?: string;
    page?: number;
    per_page?: number;
  }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<{ data: Property[] }>(`/properties?${query}`);
  }

  async getProperty(propertyId: string, include?: string) {
    const query = include ? `?include=${include}` : '';
    return this.request<Property>(`/properties/${propertyId}${query}`);
  }

  async getCalendar(propertyId: string, startDate: string, endDate: string) {
    return this.request(
      `/properties/${propertyId}/calendar?start_date=${startDate}&end_date=${endDate}`
    );
  }

  // Reservations endpoints
  async queryReservations(params: {
    properties?: string[];
    start_date?: string;
    end_date?: string;
    include?: string;
    page?: number;
    per_page?: number;
  }) {
    return this.request<{ data: Reservation[] }>('/reservations/query', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getReservation(reservationId: string, include?: string) {
    const query = include ? `?include=${include}` : '';
    return this.request<Reservation>(`/reservations/${reservationId}${query}`);
  }

  // Messages endpoints
  async getMessages(reservationId: string) {
    return this.request<{ data: Message[] }>(`/messages/${reservationId}`);
  }

  async sendMessage(reservationId: string, body: string, images?: string[]) {
    return this.request(`/messages/${reservationId}`, {
      method: 'POST',
      body: JSON.stringify({ body, images }),
    });
  }

  // Reviews endpoints
  async getReviews(propertyId: string, include?: string) {
    const query = include ? `?include=${include}` : '';
    return this.request<{ data: Review[] }>(`/reviews/${propertyId}${query}`);
  }

  async respondToReview(reviewId: string, response: string) {
    return this.request(`/reviews/${reviewId}/respond`, {
      method: 'POST',
      body: JSON.stringify({ response }),
    });
  }
}

export const api = new HospitableAPI();
