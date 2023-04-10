import React, { useState, useRef } from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import CheckButton from 'react-validation/build/button';
import { useNavigate, Link } from 'react-router-dom';

import AuthService from '../services/auth.service';
import { withRouter } from '../common/with-router';

const required = (value) => {
  if (!value) {
    return (
      <div className='alert alert-danger' role='alert'>
        This field is required!
      </div>
    );
  }
};

const Login = (props) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const form = useRef(null);
  const checkBtn = useRef(null);

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage('');
    setLoading(true);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.login(email, password).then(
        (response) => {
          props.onLogin(response.user); // Llama al prop onLogin con el usuario logueado
          if(response.user.admin) navigate('/admin/notes');
          else navigate('/');
        },
        (error) => {
          const resMessage =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();

          setLoading(false);
          setMessage(resMessage);
        }
      );
    } else {
      setLoading(false);
    }
  };

  return (
    <div className='container mt-3'>
      <div className='col-md-12'>
        <div className='card card-container'>
          <img
            src='//ssl.gstatic.com/accounts/ui/avatar_2x.png'
            alt='profile-img'
            className='profile-img-card'
          />
  
          <Form
            onSubmit={handleLogin} // Cambiar "this.handleLogin" a "handleLogin"
            ref={form}
          >
            <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <Input
                type='text'
                className='form-control'
                name='email'
                value={email} // Cambiar "this.state.email" a "email"
                onChange={onChangeEmail} // Cambiar "this.onChangeemail" a "onChangeEmail"
                validations={[required]}
              />
            </div>
  
            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <Input
                type='password'
                className='form-control'
                name='password'
                value={password} // Cambiar "this.state.password" a "password"
                onChange={onChangePassword} // Cambiar "this.onChangePassword" a "onChangePassword"
                validations={[required]}
              />
            </div>
  
            <div className='form-group'>
              <button
                className='btn btn-primary btn-block'
                disabled={loading} // Cambiar "this.state.loading" a "loading"
              >
                {loading && (
                  <span className='spinner-border spinner-border-sm'></span>
                )}
                <span>Login</span>
              </button>
              <div className='text-right mt-2'>
                <Link to='/register'>¿No tienes una cuenta? ¡Crea una!</Link>
              </div>
            </div>
  
            {message && (
              <div className='form-group'>
                <div className='alert alert-danger' role='alert'>
                  {message} // Cambiar "this.state.message" a "message"
                </div>
              </div>
            )}
            <CheckButton style={{ display: 'none' }} ref={checkBtn} />
          </Form>
        </div>
      </div>
    </div>
  );
  
}

export default withRouter(Login);