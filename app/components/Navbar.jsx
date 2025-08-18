import { Link } from "react-router";

const Navbar = () => {
    return ( 
        <nav className="navbar">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient">JobFit</p>
            </Link>

            <Link to="/upload" className="primary-button">
                Upload Resume
            </Link>
        </nav>
     );
}
 
export default Navbar;