import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import "./NavBar.css"
import "../NotesContainer/NotesContainer"
import AuthService from "../../services/auth.service";

function logOut() {
  AuthService.logout();
  this.setState({
    showModeratorBoard: false,
    showAdminBoard: false,
    currentUser: undefined,
  });
}

const API_URL = "http://localhost:3000";
const currentUser = AuthService.getCurrentUser();

function NavBar() {
  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <div class="container-fluid">
        <Navbar.Brand href="/">My Notes App</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent">
          <Nav className="me-auto mb-2 mb-lg-0">
            <Nav.Item>
              <NavLink to="/" exact activeClassName="active" className="nav-link">
                Notas
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to="/collections" activeClassName="active" className="nav-link">
                Colecciones
              </NavLink>
            </Nav.Item>
          </Nav>

          <Form className="d-flex" role="search">
            <FormControl
              type="search"
              placeholder="Buscar"
              className="me-2"
              aria-label="Search"
            />
            <Button type="submit">Buscar</Button>
          </Form>
          <Nav>
            <NavDropdown
              title={
                <img
                  src={currentUser.avatar.url ? API_URL + currentUser.avatar.url : "https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/fox.jpg"}
                  width="40"
                  height="40"
                  className="rounded-circle"
                  alt="User profile"
                  zIndex="1000"
                />
              }
              id="navbarDropdownMenuLink"
            >
              <NavDropdown.Item href="/profile">Perfil</NavDropdown.Item>
              <NavDropdown.Item href="/settings">Ajustes</NavDropdown.Item>
              <NavDropdown.Item href="/login" onClick={logOut}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

export default NavBar;