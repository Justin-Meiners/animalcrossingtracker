import "./../styles/Navbar.css"
import navlogo from "./../images/navlogo.png"
import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

function Navbar() {
    const { username, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="logo">
                <img src={navlogo} alt="Logo" className="logoDot" />
                Critter Tracker
            </div>
            <div className="links">
                <NavLink to="/" end className={({ isActive }) => "link" + (isActive ? " active" : "")}>Home</NavLink>
                <NavLink to="/fish" className={({ isActive }) => "link" + (isActive ? " active" : "")}>Fish</NavLink>
                <NavLink to="/bugs" className={({ isActive }) => "link" + (isActive ? " active" : "")}>Bugs</NavLink>
            </div>
            <div className="nav-auth">
                {username ? (
                    <>
                        <span className="nav-user">{username}</span>
                        <button className="nav-auth-btn" onClick={logout}>Sign Out</button>
                    </>
                ) : (
                    <NavLink to="/login" className="nav-auth-btn">Sign In</NavLink>
                )}
            </div>
        </nav>
    )
}

export default Navbar;