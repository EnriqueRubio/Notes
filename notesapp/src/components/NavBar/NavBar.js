import React, { useContext } from 'react';
import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, NavLink } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import "./NavBar.css"
import "../NotesContainer/NotesContainer"
import AuthService from "../../services/auth.service";
import AuthContext from '../../AuthContext';
/*
function logOut() {
  AuthService.logout();
  this.setState({
    showModeratorBoard: false,
    showAdminBoard: false,
    currentUser: undefined,
  });
}
const currentUser = AuthService.getCurrentUser();
*/

const API_URL = "http://localhost:3000";

function NavBar({ onLogout }) {
  const currentUser = AuthService.getCurrentUser();

  function logOut() {
    AuthService.logout();
    onLogout();
  }

  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <div class="container-fluid">
        <Navbar.Brand>My Notes App</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent">
          <Nav className="me-auto mb-2 mb-lg-0">
            <Nav.Item>
              <NavLink to={currentUser.admin ? "/admin/notes" : "/"} exact activeClassName="active" className="nav-link">
                Notes
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to={currentUser.admin ? "/admin/collections" : "/collections"} activeClassName="active" className="nav-link">
                Collections
              </NavLink>
            </Nav.Item>
            {currentUser?.admin && (
              <>
                <Nav.Item>
                  <NavLink to="/admin/users" activeClassName="active" className="nav-link">
                    Users
                  </NavLink>
                </Nav.Item>
                <Nav.Item>
                  <NavLink to="/admin/relations" activeClassName="active" className="nav-link">
                    Relations
                  </NavLink>
                </Nav.Item>
              </>
            )}
          </Nav>

          {currentUser?.admin && (
            <Nav>
              <Nav.Item>
                <NavLink className="logout-admins" to="/login" href="/login" onClick={logOut} >
                  Logout
                </NavLink>
              </Nav.Item>
            </Nav>
          )}

          {currentUser?.admin == false && (<>
            <Nav>
              <NavDropdown
                title={
                  <img
                    src={currentUser?.avatar.url ? API_URL + currentUser.avatar.url : "https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/fox.jpg"}
                    width="40"
                    height="40"
                    className="rounded-circle"
                    alt="User profile"
                    zIndex="1000"
                  />
                }
                id="navbarDropdownMenuLink"
              >
                <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                {/* <NavDropdown.Item href="/settings">Ajustes</NavDropdown.Item> */}
                <NavDropdown.Item href="/login" onClick={logOut}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </>
          )}
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

export default NavBar;