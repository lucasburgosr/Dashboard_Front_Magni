import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <button onClick={() => 
            loginWithRedirect({
                appState: {
                    returnTo: window.location.pathname,
                },
                authorizationParams: {
                    initialScreen: "login"
                },
                
            })
        }
        className="btn btn-primary mx-2"
        >
            Iniciar sesión
        </button>
    );
}

export default LoginButton;