import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
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

function NavBar() {
  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <div class="container-fluid">
        <Navbar.Brand href="/">My Notes App</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent">
          <Nav className="me-auto mb-2 mb-lg-0">
            <Nav.Link href="/collections">Colecciones</Nav.Link>
            <Nav.Link href="/friends">Amigos</Nav.Link>
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
                  src="https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/fox.jpg"
                  width="40"
                  height="40"
                  className="rounded-circle"
                  alt="User profile"
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