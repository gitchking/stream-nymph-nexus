
import { useCallback } from 'react';

interface TelegramAPIOptions {
  method: string;
  channelId?: string;
  data?: any;
}

export const useTelegramAPI = () => {
  const callTelegramAPI = useCallback(async ({ method, channelId, data }: TelegramAPIOptions) => {
    try {
      const response = await fetch('/api/functions/v1/telegram-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method,
          channelId,
          data
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Telegram API call failed:', error);
      throw error;
    }
  }, []);

  return { callTelegramAPI };
};
