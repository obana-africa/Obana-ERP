import { useState, useCallback } from 'react';

export const useIntegrations = () => {
  const [integration, setIntegration] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const connect = useCallback(async (config) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // API call to validate and save integration
      const response = await fetch('/api/integrations/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      
      if (!response.ok) throw new Error('Connection failed');
      
      const data = await response.json();
      setIntegration(data);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      await fetch('/api/integrations/disconnect', { method: 'POST' });
      setIntegration(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  return { integration, isLoading, error, connect, disconnect };
};