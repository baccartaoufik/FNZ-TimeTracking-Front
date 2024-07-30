import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';

const CreateUserDialog = ({ open, handleClose, refreshUsers }) => {
  // State for user data
  const [user, setUser] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    titre: '',
    sexe: 'Female',
    role: {
      nomRole: 'ROLE_USER',
      privilege: 'USER'
    },
    département: '',
    photo: null,
  });

  // State for form validation and snackbar
  const [isFormValid, setIsFormValid] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Function to validate the form
  const validateForm = () => {
    const requiredFields = ['nom', 'prenom', 'email', 'telephone', 'role', 'département'];
    const isValid = requiredFields.every(field => {
      if (field === 'role') {
        return user[field] && user[field].nomRole && user[field].nomRole.trim() !== '';
      }
      return user[field] && user[field].toString().trim() !== '';
    });
    setIsFormValid(isValid);
  };

  // Effect to validate form whenever user data changes
  useEffect(() => {
    validateForm();
  }, [user]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'role') {
      setUser({
        ...user,
        role: {
          nomRole: value,
          privilege: value === 'ROLE_ADMIN' ? 'ADMIN' : 'USER'
        }
      });
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setUser({ ...user, photo: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const userData = { ...user };
      delete userData.photo;
  
      const formData = new FormData();
      formData.append('utilisateur', new Blob([JSON.stringify(userData)], {
        type: "application/json"
      }));
      if (user.photo) {
        formData.append('photo', user.photo);
      }
  
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8081/api/users', formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSnackbar({ open: true, message: 'User created successfully', severity: 'success' });
      refreshUsers();
      handleClose();
      resetForm();
    } catch (error) {
      console.error('Error creating user:', error);
      setSnackbar({ open: true, message: 'Error creating user', severity: 'error' });
    }
  };

  // Reset the form
  const resetForm = () => {
    setUser({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      titre: '',
      sexe: 'Female',
      role: {
        nomRole: 'ROLE_USER',
        privilege: 'USER'
      },
      département: '',
      photo: null,
    });
    setIsFormValid(false);
  };

  // Handle closing of snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <TextField
            name="nom"
            label="Last Name"
            fullWidth
            margin="normal"
            onChange={handleInputChange}
            required
          />
          <TextField
            name="prenom"
            label="First Name"
            fullWidth
            margin="normal"
            onChange={handleInputChange}
            required
          />
          <TextField
            name="email"
            label="Email"
            fullWidth
            margin="normal"
            onChange={handleInputChange}
            required
          />
          <TextField
            name="telephone"
            label="Mobile"
            fullWidth
            margin="normal"
            onChange={handleInputChange}
            required
          />
          <TextField
            name="titre"
            label="Post"
            fullWidth
            margin="normal"
            onChange={handleInputChange}
          />
          <RadioGroup
            name="sexe"
            value={user.sexe}
            onChange={handleInputChange}
            row
          >
            <FormControlLabel value="Male" control={<Radio />} label="Male" />
            <FormControlLabel value="Female" control={<Radio />} label="Female" />
          </RadioGroup>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={user.role.nomRole}
              onChange={handleInputChange}
            >
              <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
              <MenuItem value="ROLE_USER">User</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="département"
            label="Département"
            fullWidth
            margin="normal"
            onChange={handleInputChange}
            required
          />
          <input
            accept="image/*"
            type="file"
            onChange={handleFileChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!isFormValid}>Submit</Button>
        </DialogActions>
      </Dialog>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateUserDialog;