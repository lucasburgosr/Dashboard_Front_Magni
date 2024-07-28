import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      onClick={() =>
        loginWithRedirect({
          appState: {
            returnTo: window.location.pathname,
          },
          authorizationParams: {
            initialScreen: "login",
          },
        })
      }
      className="btn"
      style={{ backgroundColor: '#5bbec0', color: '#fff' }}
    >
      Iniciar sesión
    </button>
  );
};

export default LoginButton;
