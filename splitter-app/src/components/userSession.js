export const setUserSession = (user) => {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  };
  
  export const getUserSession = () => {
    const userStr = sessionStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  };
  
  export const clearUserSession = () => {
    sessionStorage.removeItem('currentUser');
  };