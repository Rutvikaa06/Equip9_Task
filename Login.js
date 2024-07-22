import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';
import axios from 'axios';

function Login() {
  const [values, setValues] = useState({
    mobile: '',
    password: '',
    profilePic: null
  });

  const [errors, setErrors] = useState({});
  const [profilePicPreview, setProfilePicPreview] = useState(null); // For preview
  const navigate = useNavigate();

  const handleInput = (event) => {
    if (event.target.name === 'profilePic') {
      setValues(prev => ({ ...prev, profilePic: event.target.files[0] }));
      setProfilePicPreview(URL.createObjectURL(event.target.files[0])); // Preview
    } else {
      setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const formData = new FormData();
      formData.append('mobile', values.mobile);
      formData.append('password', values.password);
      if (values.profilePic) formData.append('profilePic', values.profilePic);

      try {
        await axios.post('http://localhost:8081/login', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        navigate('/home');
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
      <div className='bg-white p-3 rounded w-25'>
        <h2>Sign-In</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="mobile"><strong>Mobile Number</strong></label>
            <input type="text" placeholder='Enter Mobile Number' name='mobile'
              value={values.mobile} onChange={handleInput} className='form-control rounded-0' />
            {errors.mobile && <span className='text-danger'>{errors.mobile}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor="password"><strong>Password</strong></label>
            <input type="password" placeholder='Enter Password' name='password'
              value={values.password} onChange={handleInput} className='form-control rounded-0' />
            {errors.password && <span className='text-danger'>{errors.password}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor="profilePic"><strong>Profile Picture</strong></label>
            <div className='d-flex'>
              <div className='profile-pic-container'>
                {profilePicPreview && <img src={profilePicPreview} alt="Profile Preview" className='profile-pic' />}
              </div>
              <input type="file" name='profilePic' onChange={handleInput} className='form-control rounded-0 ms-2' />
            </div>
          </div>
          <button type='submit' className='btn btn-success w-100 rounded-0'>Log in</button>
          <p>You agree to our terms and policies</p>
          <Link to="/signup" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Create Account</Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
