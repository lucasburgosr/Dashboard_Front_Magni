import { useAuth0 } from "@auth0/auth0-react";

const SignUpButton = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <button onClick={() => 
            loginWithRedirect({
                appState: {
                    returnTo: "/empleado/perfil",
                },
                authorizationParams: {
                    screen_hint: "signup",
                },
            })
        }
        className="btn btn-primary"
        >
            Registrarse
        </button>
    );
}

export default SignUpButton;