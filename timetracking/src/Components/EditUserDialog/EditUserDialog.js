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
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const EditUserDialog = ({ open, handleClose, refreshUsers, user }) => {
  const [editedUser, setEditedUser] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    post: '',
    sexe: 'Female',
    role: '',
    department: '',
    ...user
  });
  const [isFormValid, setIsFormValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && JSON.stringify(user) !== JSON.stringify(editedUser)) {
      setEditedUser(user);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setEditedUser({ ...editedUser, [name]: value });
    validateForm();
  };

  const handleFileChange = (e) => {
    setEditedUser({ ...editedUser, photo: e.target.files[0] });
    validateForm();
  };

  const validateForm = () => {
    const requiredFields = ['nom', 'prenom', 'email', 'telephone', 'role', 'département'];
    const isValid = requiredFields.every(field => editedUser[field] && editedUser[field].toString().trim() !== '');
    setIsFormValid(isValid);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      const formData = new FormData();
      const userData = {
      id_utilisateur: editedUser.id_utilisateur,
      nom: editedUser.nom,
      prenom: editedUser.prenom,
      email: editedUser.email,
      telephone: editedUser.telephone,
      titre: editedUser.titre,
      sexe: editedUser.sexe,
      role: editedUser.role,
      département: editedUser.département
    };
      formData.append('utilisateur', JSON.stringify(userData));
      if (editedUser.photo instanceof File) {
        formData.append('photo', editedUser.photo);
      }
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8081/api/users/${editedUser.id_utilisateur}`, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      handleClose();
      refreshUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      if (error.response) {
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
        setError(`Error: ${error.response.data.message || 'Failed to update user'}`);
      } else if (error.request) {
        console.error(error.request);
        setError('No response received from server. Please try again.');
      } else {
        console.error('Error', error.message);
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <TextField
          name="nom"
          label="Last Name"
          fullWidth
          margin="normal"
          value={editedUser.nom || ''}
          onChange={handleInputChange}
          required
        />
        <TextField
          name="prenom"
          label="First Name"
          fullWidth
          margin="normal"
          value={editedUser.prenom || ''}
          onChange={handleInputChange}
          required
        />
        <TextField
          name="email"
          label="Email"
          fullWidth
          margin="normal"
          value={editedUser.email || ''}
          onChange={handleInputChange}
          required
        />
        <TextField
          name="telephone"
          label="Mobile"
          fullWidth
          margin="normal"
          value={editedUser.telephone || ''}
          onChange={handleInputChange}
          required
        />
        <TextField
          name="titre"
          label="Post"
          fullWidth
          margin="normal"
          value={editedUser.titre || ''}
          onChange={handleInputChange}
        />
        <RadioGroup
          name="sexe"
          value={editedUser.sexe || 'Female'}
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
            value={editedUser.role?.nomRole || ''}
            onChange={(e) => setEditedUser({...editedUser, role: {nomRole: e.target.value}})}
          >
            <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
            <MenuItem value="ROLE_USER">User</MenuItem>
          </Select>
        </FormControl>
        <TextField
          name="département"
          label="Department"
          fullWidth
          margin="normal"
          value={editedUser.département || ''}
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
        <Button 
          onClick={handleSubmit} 
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? 'Updating...' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default EditUserDialog;