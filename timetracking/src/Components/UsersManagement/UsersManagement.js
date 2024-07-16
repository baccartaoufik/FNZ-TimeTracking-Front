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
  Avatar,
  Checkbox,
  TablePagination
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
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
    fetchUsers();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ width: '80vw', overflow: 'hidden' }}>
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>
      <TableContainer component={Paper} sx={{ border: '5px solid #e0e0e0' }}>
        <Table sx={{ minWidth: 1000}} aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Mobile Phone</TableCell>
              <TableCell>Gender</TableCell>
              
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <TableRow key={user.idUtilisateur}>
                <TableCell>
                <img src={`http://localhost:5000/static/images/${user.photo}`} alt={`${user.nom} ${user.prenom}`} width="50" height="50" />
                </TableCell>
                <TableCell>{user.idUtilisateur}</TableCell>
                <TableCell>{`${user.nom} ${user.prenom}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role ? user.role.nomRole : 'N/A'}</TableCell>
                <TableCell>
                  <Checkbox checked={user.active} />
                </TableCell>
                <TableCell>{user.telephone}</TableCell>
                <TableCell>{user.sexe}</TableCell>
                <TableCell>
                  <IconButton>
                    <Edit />
                  </IconButton>
                  <IconButton>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button variant="contained" sx={{ backgroundColor: '#595959', color: '#fff' }}>
          Create
        </Button>
      </Box>
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