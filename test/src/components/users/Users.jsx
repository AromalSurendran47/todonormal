import React, { useState, useEffect } from 'react'
import { Container, Form, Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams, useNavigate } from 'react-router-dom';

function Users() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    fname: '',
    lname: '',
    email: ''
  });
  const [message, setMessage] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const baseURL = "http://localhost:3001";

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseURL}/person/${id}`);
      const userData = await response.json();
      setUser(userData);
      setEditForm({
        fname: userData.fname,
        lname: userData.lname,
        email: userData.email
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
      setMessage('Error fetching user details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseURL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('User updated successfully');
        setTimeout(() => {
          navigate('/'); // Redirect to home page after successful update
        }, 1500);
      } else {
        setMessage(data.message || 'Error updating user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setMessage('Error updating user');
    }
  };

  const handleCancel = () => {
    navigate('/'); // Go back to home page
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center mt-5">User not found</div>;
  }

  return (
    <Container className="my-5">
      <Card>
        <Card.Body>
          <h3 className="mb-4">Edit User Details</h3>
          
          {message && (
            <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
              {message}
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={editForm.fname}
                onChange={(e) => setEditForm({...editForm, fname: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={editForm.lname}
                onChange={(e) => setEditForm({...editForm, lname: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                required
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Users;