import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } }).then(() =>
          localStorage.setItem("usuario", "")
        )
      }
      className="btn"
      style={{ backgroundColor: '#5bbec0', color: '#fff' }}
    >
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;
