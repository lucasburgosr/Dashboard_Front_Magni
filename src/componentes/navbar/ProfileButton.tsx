import { useNavigate } from "react-router-dom";

const ProfileButton = () => {
const navigate = useNavigate();

return(
    <button
        onClick={()=> navigate("/empleado/perfil")}
        className="btn mx-2"
        >
        Perfil
    </button>
)

}

export default ProfileButton;