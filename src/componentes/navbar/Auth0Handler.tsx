import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthHandler = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const storeToken = async () => {
      if (isAuthenticated) {
        const token = await getAccessTokenSilently({
          authorizationParams:{audience:import.meta.env.VITE_AUTH0_AUDIENCE}
        });
        localStorage.setItem('token', token);
      }
    };
    storeToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  return null;
};

export default AuthHandler;
