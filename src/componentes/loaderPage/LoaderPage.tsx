import { CircularProgress } from "@mui/material"
import './loader-page.css';

function LoaderPage() {
    return (
        <div className="loader-page">
            <CircularProgress />
        </div>
    )
}

export default LoaderPage