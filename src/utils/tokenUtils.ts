// Token expiration time in milliseconds (8 days)
export const TOKEN_EXPIRATION_TIME = 8 * 24 * 60 * 60 * 1000;

// Function to set token and expiration
export const setAuthToken = (token: string): void => {
  // Store the token
  localStorage.setItem('access_token', token);
  localStorage.setItem('isAuthenticated', 'true');
  
  // Store the token expiration time (current time + 8 days in milliseconds)
  const expirationTime = new Date().getTime() + TOKEN_EXPIRATION_TIME;
  localStorage.setItem('token_expiration', expirationTime.toString());
};

// Function to clear token and auth data
export const clearAuthToken = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('token_expiration');
  localStorage.setItem('isAuthenticated', 'false');
};

// Function to check if token is expired
export const isTokenExpired = (): boolean => {
  const tokenExpiration = localStorage.getItem('token_expiration');
  if (!tokenExpiration) return true;
  
  const expirationTime = parseInt(tokenExpiration, 10);
  const currentTime = new Date().getTime();
  
  return currentTime > expirationTime;
};

// Function to get time remaining until token expiration (in milliseconds)
export const getTokenTimeRemaining = (): number => {
  const tokenExpiration = localStorage.getItem('token_expiration');
  if (!tokenExpiration) return 0;
  
  const expirationTime = parseInt(tokenExpiration, 10);
  const currentTime = new Date().getTime();
  
  return Math.max(0, expirationTime - currentTime);
};

// Function to format time remaining in a human-readable format
export const formatTimeRemaining = (milliseconds: number): string => {
  if (milliseconds <= 0) return 'Expired';
  
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} remaining`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} remaining`;
  } else {
    return `${seconds} second${seconds > 1 ? 's' : ''} remaining`;
  }
};
