import "./../styles/Navbar.css"
import navlogo from "./../images/navlogo.png"
import { NavLink } from 'react-router-dom'

function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">
                <img src={navlogo} alt="Logo" className="logoDot" />
                Critterpedia
            </div>
            <div className="links">
                <NavLink to="/" end className={({ isActive }) => "link" + (isActive ? " active" : "")}>Home</NavLink>
                <NavLink to="/fish" className={({ isActive }) => "link" + (isActive ? " active" : "")}>Fish</NavLink>
                <NavLink to="/bugs" className={({ isActive }) => "link" + (isActive ? " active" : "")}>Bugs</NavLink>
            </div>

        </nav>
    )
}

export default Navbar;