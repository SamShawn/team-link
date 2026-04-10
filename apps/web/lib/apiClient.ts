import type { Channel, Message, User, DirectMessage, Workspace } from '@teamlink/shared/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiError {
  status: number;
  code?: string;
  message: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = {
        status: response.status,
        message: response.statusText || 'An error occurred',
      };
      try {
        const data = await response.json();
        error.code = data.code;
        error.message = data.message || error.message;
      } catch {
        // Response body might be empty
      }
      throw error;
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(
    email: string,
    password: string,
    displayName: string
  ): Promise<{ token: string; user: User }> {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName }),
    });
  }

  async logout(): Promise<void> {
    return this.request('/api/auth/logout', { method: 'POST' });
  }

  async getMe(): Promise<User> {
    return this.request('/api/auth/me');
  }

  // Workspaces
  async getWorkspaces(): Promise<Workspace[]> {
    return this.request('/api/workspaces');
  }

  async getWorkspace(workspaceId: string): Promise<Workspace> {
    return this.request(`/api/workspaces/${workspaceId}`);
  }

  // Channels
  async getChannels(workspaceId: string): Promise<Channel[]> {
    return this.request(`/api/workspaces/${workspaceId}/channels`);
  }

  async getChannel(workspaceId: string, channelId: string): Promise<Channel> {
    return this.request(`/api/workspaces/${workspaceId}/channels/${channelId}`);
  }

  async createChannel(
    workspaceId: string,
    data: { name: string; description?: string; isPrivate?: boolean }
  ): Promise<Channel> {
    return this.request(`/api/workspaces/${workspaceId}/channels`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateChannel(
    workspaceId: string,
    channelId: string,
    data: Partial<{ name: string; description: string; isPrivate: boolean }>
  ): Promise<Channel> {
    return this.request(`/api/workspaces/${workspaceId}/channels/${channelId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteChannel(workspaceId: string, channelId: string): Promise<void> {
    return this.request(`/api/workspaces/${workspaceId}/channels/${channelId}`, {
      method: 'DELETE',
    });
  }

  // Messages
  async getMessages(
    channelId: string,
    options?: { limit?: number; before?: string; after?: string }
  ): Promise<Message[]> {
    const params = new URLSearchParams();
    if (options?.limit) params.set('limit', String(options.limit));
    if (options?.before) params.set('before', options.before);
    if (options?.after) params.set('after', options.after);
    const query = params.toString();
    return this.request(`/api/channels/${channelId}/messages${query ? `?${query}` : ''}`);
  }

  async getThreadMessages(threadId: string): Promise<Message[]> {
    return this.request(`/api/threads/${threadId}/messages`);
  }

  async sendMessage(
    channelId: string,
    content: string,
    options?: { threadId?: string; mentions?: string[] }
  ): Promise<Message> {
    return this.request(`/api/channels/${channelId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, ...options }),
    });
  }

  async updateMessage(
    channelId: string,
    messageId: string,
    content: string
  ): Promise<Message> {
    return this.request(`/api/channels/${channelId}/messages/${messageId}`, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    });
  }

  async deleteMessage(channelId: string, messageId: string): Promise<void> {
    return this.request(`/api/channels/${channelId}/messages/${messageId}`, {
      method: 'DELETE',
    });
  }

  async addReaction(
    channelId: string,
    messageId: string,
    emoji: string
  ): Promise<void> {
    return this.request(`/api/channels/${channelId}/messages/${messageId}/reactions`, {
      method: 'POST',
      body: JSON.stringify({ emoji }),
    });
  }

  async removeReaction(
    channelId: string,
    messageId: string,
    emoji: string
  ): Promise<void> {
    return this.request(`/api/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`, {
      method: 'DELETE',
    });
  }

  // Direct Messages
  async getDirectMessages(dmId: string): Promise<Message[]> {
    return this.request(`/api/direct-messages/${dmId}/messages`);
  }

  async createDirectMessage(participantIds: string[]): Promise<DirectMessage> {
    return this.request('/api/direct-messages', {
      method: 'POST',
      body: JSON.stringify({ participantIds }),
    });
  }

  // Users
  async getUsers(workspaceId: string): Promise<User[]> {
    return this.request(`/api/workspaces/${workspaceId}/users`);
  }

  async getUser(userId: string): Promise<User> {
    return this.request(`/api/users/${userId}`);
  }

  async updateUser(
    userId: string,
    data: Partial<{ displayName: string; avatarUrl: string; status: string }>
  ): Promise<User> {
    return this.request(`/api/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Search
  async search(
    workspaceId: string,
    query: string,
    options?: { channelId?: string; limit?: number }
  ): Promise<{ messages: Message[]; channels: Channel[]; users: User[] }> {
    const params = new URLSearchParams({ q: query });
    if (options?.channelId) params.set('channelId', options.channelId);
    if (options?.limit) params.set('limit', String(options.limit));
    return this.request(`/api/workspaces/${workspaceId}/search?${params.toString()}`);
  }

  // File uploads
  async uploadFile(
    channelId: string,
    file: File,
    messageId?: string
  ): Promise<{ url: string; filename: string; mimeType: string }> {
    const formData = new FormData();
    formData.append('file', file);
    if (messageId) formData.append('messageId', messageId);

    const headers: Record<string, string> = {};
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

    const response = await fetch(`${this.baseUrl}/api/channels/${channelId}/files`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error: ApiError = {
        status: response.status,
        message: 'File upload failed',
      };
      throw error;
    }

    return response.json();
  }
}

// Singleton instance
export const apiClient = new ApiClient();

// Auth helpers using the singleton
export const auth = {
  login: (email: string, password: string) => apiClient.login(email, password),
  register: (email: string, password: string, displayName: string) =>
    apiClient.register(email, password, displayName),
  logout: () => apiClient.logout(),
  me: () => apiClient.getMe(),
};
