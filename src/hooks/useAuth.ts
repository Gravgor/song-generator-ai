// hooks/useAuth.ts
import { useState } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = (email: string, password: string) => {
    // Implement login logic (e.g., call an API endpoint)
    setIsAuthenticated(true); // Set to true after successful login
  };

  const register = (email: string, username: string, password: string) => {
    // Implement registration logic (e.g., call an API endpoint)
    setIsAuthenticated(true); // Set to true after successful registration
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    login,
    register,
    logout,
  };
};
