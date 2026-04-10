// API client — stub for now, will be implemented when backend is connected
export const apiClient = {
  getChannels: async () => { throw new Error('Not implemented'); },
  getMessages: async (channelId: string) => { throw new Error('Not implemented'); },
  sendMessage: async (channelId: string, content: string) => { throw new Error('Not implemented'); },
};
