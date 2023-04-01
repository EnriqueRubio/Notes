import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, ListGroup, Form, Button, Offcanvas, Accordion } from 'react-bootstrap';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { BsTrash, BsFillPlusSquareFill, BsXSquare, BsCheckSquare } from 'react-icons/bs';
import { Toast } from 'bootstrap'
import AuthService from '../services/auth.service';
import AuthHeader from "../services/auth-header";

const API_URL_USERS = "http://localhost:3000/api/users/";
let notification_title;
let notification_content;

const Profile = () => {
  const user = AuthService.getCurrentUser();

  console.log(user);

  return (
      <div className="container">
        <div>
        <header className="jumbotron">
          <h3>
            <strong>{user.username}</strong> Profile
          </h3>
        </header>
        <p>
          <strong>Id:</strong>{" "}
          {user._id.$oid}
        </p>
        <p>
          <strong>Email:</strong>{" "}
          {user.email}
        </p>
      </div>
      </div>
  );
}

export default Profile;