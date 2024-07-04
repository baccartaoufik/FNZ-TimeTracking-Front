import React, { useState, useRef } from 'react';
import { FaCamera } from 'react-icons/fa';
import Webcam from 'react-webcam';
import Modal from 'react-modal';
import axios from 'axios';
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

  const sendImageToBackend = async (imageSrc) => {
    setIsLoading(true);
    setError(null);
    try {
      // Convert base64 image to Blob
      const byteString = atob(imageSrc.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: 'image/jpeg' });

      // Create FormData and append the Blob
      const formData = new FormData();
      formData.append('file', blob, 'image.jpg');

      const response = await axios.post('http://localhost:8080/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200 && response.data.token) {
        setJwtToken(response.data.token);
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
      <button className="button" onClick={openCamera}>
        <FaCamera className="camera-icon" />
        Facial Login
      </button>

      <Modal isOpen={isModalOpen} onRequestClose={closeCamera} className="modal-content">
        <div className="modal-content">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="webcam"
          />
          <button className="button" onClick={captureImage}>Capture</button>
          <button className="button" onClick={closeCamera}>Close</button>
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
