import React, { useState } from 'react'
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from 'react-router-dom';

function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const baseURL = "http://localhost:3001"; 

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseURL}/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (userId) => {
    navigate(`/users/${userId}`);
  };

  const handleAddProduct = () => {
    navigate('/product');
  };

  const handleViewProducts = () => {
    navigate('/productdetail');
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`${baseURL}/del/${userId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setUsers(users.filter(user => user.id !== userId));
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '20px', margin: '20px' }}>
        <button 
          onClick={fetchUserDetails}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          User Details
        </button>

        <button 
          onClick={handleAddProduct}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Add Product
        </button>
        <button 
          onClick={handleViewProducts}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          View Products
        </button>
      </div>

      {loading && <p>Loading...</p>}
      
      {users.length > 0 && (
        <div style={{ margin: '20px' }}>
          <h2>User Details</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', maxWidth: '800px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>First Name</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Last Name</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ backgroundColor: 'white' }}>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.id}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.fname}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.lname}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.email}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <button
                      onClick={() => handleEdit(user.id)}
                      style={{
                        padding: '5px 10px',
                        marginRight: '5px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Home