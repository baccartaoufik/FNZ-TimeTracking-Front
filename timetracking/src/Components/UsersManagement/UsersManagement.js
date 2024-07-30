import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Typography,
  Box,
  Checkbox,
  TablePagination
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import CreateUserDialog from '../CreateUserDialog/CreateUserDialog';
import EditUserDialog from '../EditUserDialog/EditUserDialog';
import DeleteConfirmationDialog from '../DeleteConfiramationDialog/DeleteConfiramationDialog';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8081/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please make sure you have admin privileges.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleOpenEditDialog = (user) => {
    setSelectedUser(user);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedUser(null);
  };

  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8081/api/users/${userToDelete.id_utilisateur}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const roleMapping = {
    'ROLE_ADMIN' : 'Admin',
    "ROLE_USER" : 'User',
     "ROle_RH" : 'rh'  };
  return (
    <Box sx={{ width: '80vw', overflow: 'hidden' }}>
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>
      <TableContainer component={Paper} sx={{ border: '5px solid #e0e0e0' }}>
        <Table sx={{ minWidth: 1000 }} aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Full Name</TableCell>              
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              {/* <TableCell>Active</TableCell> */}
              <TableCell>Mobile Phone</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <TableRow key={user.id_utilisateur}>
                <TableCell>
                  <img
                    src={`http://localhost:5000/static/images/${user.photo}`}
                    alt={`${user.nom} ${user.prenom}`}
                    width="50"
                    height="50"
                    style={{
                      borderRadius: '50%',
                      border: '2px solid #ddd',
                      boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
                      objectFit: 'cover',
                      display: 'block',
                      overflow: 'hidden', 
                    }}
                    onError={(e) => {
                      e.target.src = 'path_to_placeholder_image.jpg'; 
                      e.target.alt = 'Image not available';
                    }}
                  />
                </TableCell>
                <TableCell>{`${user.nom} ${user.prenom}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role ? roleMapping[user.role.nomRole] || 'Unknown Role' : 'N/A'}</TableCell>             
               {/*<TableCell> <Checkbox checked={user.active} /> </TableCell>*/}
                <TableCell>{user.telephone}</TableCell>
                <TableCell>{user.sexe}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenEditDialog(user)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteDialog(user)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#595959', color: '#fff' }}
          onClick={handleOpenCreateDialog}
        >
          Create
        </Button>
      </Box>
      <CreateUserDialog
        open={openCreateDialog}
        handleClose={handleCloseCreateDialog}
        refreshUsers={fetchUsers}
      />
      {selectedUser && (
      <EditUserDialog
        open={openEditDialog}
        handleClose={handleCloseEditDialog}
        refreshUsers={fetchUsers}
        user={selectedUser}
      />
      )}
      <DeleteConfirmationDialog
        open={openDeleteDialog}
        handleClose={handleCloseDeleteDialog}
        handleConfirm={handleConfirmDelete}
        userName={userToDelete ? `${userToDelete.nom} ${userToDelete.prenom}` : ''}
      />
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};
export default UsersManagement;
