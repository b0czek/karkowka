import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { Session } from "../api/session";
import { useLoginState } from "../loginContext";

interface NavLink {
    path: string;
    name: string;
}

const navLinks: NavLink[] = [
    {
        path: "/questionLists",
        name: "Question Lists",
    },
];

export const NavBar = () => {
    const [loginState, dispatchLoginState] = useLoginState();
    const location = useLocation();

    return location.pathname.startsWith("/login") ? null : (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="px-3 py-2">
            <Link className="navbar-brand" to="/">
                Karkówka
            </Link>
            <Navbar.Toggle aria-controls="responsive-navbar-bar" />
            <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-between">
                <Nav className="mr-auto">
                    {navLinks.map((navLink, idx) => (
                        <Nav.Link
                            as={Link}
                            eventKey={idx}
                            // className={location.pathname.startsWith(navLink.path) ? "active" : ""}
                            to={navLink.path}
                            key={idx}
                        >
                            {navLink.name}
                        </Nav.Link>
                    ))}
                </Nav>
                <Nav>
                    {loginState.user ? (
                        <NavDropdown title={loginState.user.name}>
                            <NavDropdown.Item onClick={() => Session.logout()}>Log out</NavDropdown.Item>
                        </NavDropdown>
                    ) : null}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};
