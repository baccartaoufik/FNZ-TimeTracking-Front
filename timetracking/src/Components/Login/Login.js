import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCamera } from 'react-icons/fa';
import Webcam from 'react-webcam';
import Modal from 'react-modal';
import axios from 'axios';
import Button from '../Button/Button';
import './Login.css';

Modal.setAppElement('#root');

const Login = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jwtToken, setJwtToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const webcamRef = useRef(null);

  
  const openCamera = () => {
    setIsModalOpen(true);
    setError(null);
  };

  const closeCamera = () => {
    setIsModalOpen(false);
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    sendImageToBackend(imageSrc);
  };
  const navigate = useNavigate();


  const sendImageToBackend = async (imageSrc) => {
    setIsLoading(true);
    setError(null);
    try {
      const byteString = atob(imageSrc.split(',')[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }
      const imageBlob = new Blob([uint8Array], { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', imageBlob, 'image.jpg');

      const response = await axios.post('http://localhost:8080/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200 && response.data.token) {
        setJwtToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
        closeCamera();
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <img src="./images/FNZ_Logo_1.png" alt="FNZ Logo" className="logo" />
      <Button onClick={openCamera} icon={<FaCamera />}>
         Login
      </Button>

      <Modal isOpen={isModalOpen} onRequestClose={closeCamera} className="modal-content">
        <div className="modal-content">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="webcam"
          />
          <Button onClick={captureImage}>Capture</Button>
          <Button onClick={closeCamera}>Close</Button>
        </div>
      </Modal>

      {isLoading && <div>Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      {jwtToken && (
        <div>
          <h2>JWT Token:</h2>
          <p>{jwtToken}</p>
        </div>
      )}
    </div>
  );
};

export default Login;
