import { useNavigate} from 'react-router-dom';
import { useEffect } from 'react';

export const Logout = () => {
    const navigateTo = useNavigate();
  
    useEffect(() => {
      localStorage.removeItem('token');
      navigateTo('/login');
    }, [navigateTo]);
  
    return null;
  };