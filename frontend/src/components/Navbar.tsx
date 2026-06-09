import "./../styles/Navbar.css"
import { Link as RouteLink } from 'react-router-dom'

function Navbar() {
    return (
        <nav className="navbar">
            <div className="links">
                <RouteLink to="/" className="link active">Home</RouteLink>
            </div>
        </nav>
    )
}

export default Navbar;