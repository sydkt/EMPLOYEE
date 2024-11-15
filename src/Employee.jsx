import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

const Employee = () => {
  const [show, setShow] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [empId, setEmpId] = useState('');
  const [empName, setEmpName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('Active');
  const [editId, setEditId] = useState(null);

  const apiUrl = 'https://employee-server-sgay.onrender.com/contact';

  // Fetch employees from the server
  const fetchEmployees = async () => {
    const response = await axios.get(apiUrl);
    setEmployees(response.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleClose = () => {
    setShow(false);
    clearForm();
  };

  const handleShow = (employee = null) => {
    if (employee) {
      setEmpId(employee.empId);
      setEmpName(employee.empName);
      setEmail(employee.email);
      setStatus(employee.status);
      setEditId(employee.id);
    }
    setShow(true);
  };

  const clearForm = () => {
    setEmpId('');
    setEmpName('');
    setEmail('');
    setStatus('Active');
    setEditId(null);
  };

  // Add or update employee
  const handleSubmit = async () => {
    const newEmployee = { empId, empName, email, status };

    if (editId) {
      // Edit employee
      await axios.put(`${apiUrl}/${editId}`, newEmployee);
    } else {
      // Add new employee
      await axios.post(apiUrl, newEmployee);
    }

    fetchEmployees();
    handleClose();
  };

  // Delete employee
  const handleDelete = async (id) => {
    await axios.delete(`${apiUrl}/${id}`);
    fetchEmployees();
  };

  const handleStatusChange = (newStatus) => setStatus(newStatus);

  return (
    <div>
      <nav className='bg-primary' style={{ width: '100%', height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ fontWeight: 'bold', textAlign: 'center' }}>Employee Management App</h2>
      </nav>
      <center>
        <div style={{ width: '700px', height: '400px', border: '1px solid black' }} className='mt-1'>
          <h1 className='mt-1'>Add Employee</h1>
          <TextField label="EmpId" variant="outlined" className='mt-3' value={empId} onChange={(e) => setEmpId(e.target.value)} /><br />
          <TextField label="EmpName" variant="outlined" className='mt-3' value={empName} onChange={(e) => setEmpName(e.target.value)} /><br />
          <TextField label="Email" variant="outlined" className='mt-3' value={email} onChange={(e) => setEmail(e.target.value)} />
          <Dropdown className='mt-3'>
            <Dropdown.Toggle variant="" id="dropdown-basic">
              {status}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleStatusChange('Active')}>Active</Dropdown.Item>
              <Dropdown.Item onClick={() => handleStatusChange('Inactive')}>Inactive</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <button className='btn btn-success' onClick={handleSubmit}>Submit</button>
          <button className='btn btn-danger ms-2' onClick={clearForm}>Cancel</button>
        </div>
      </center>
      <center>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>EmpID</th>
              <th>EmpName</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.empId}</td>
                <td>{employee.empName}</td>
                <td>{employee.email}</td>
                <td>{employee.status}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShow(employee)}>Edit</Button>
                  <Button variant="danger" className="ms-2" onClick={() => handleDelete(employee.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </center>

      {/* Edit Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Edit Employee Details' : 'Add Employee'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center align-items-center flex-column">
          <TextField label="EmpName" variant="outlined" className="mt-3" value={empName} onChange={(e) => setEmpName(e.target.value)} /><br />
          <TextField label="Email" variant="outlined" className="mt-3" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Dropdown className="mt-3">
            <Dropdown.Toggle variant="" id="dropdown-basic">
              {status}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleStatusChange('Active')}>Active</Dropdown.Item>
              <Dropdown.Item onClick={() => handleStatusChange('Inactive')}>Inactive</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handleSubmit}>{editId ? 'Update' : 'Add'}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Employee;
