import React, { useState } from 'react'
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Axios from "axios";


function register() {

  const [isRegistering, setIsRegistering] = useState(false);
  const [registerStatus, setRegisterStatus] = useState("");


  const baseURL = "http://localhost:3001"; // Backend API URL

  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginStatus, setLoginStatus] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  



  const register = (e) => {
    e.preventDefault();

    if (!fname || !lname || !email || !password) {
      setRegisterStatus('Please fill out all fields.');
      return;
    }

    Axios.post(`${baseURL}/register`, {
      fname,
      lname,
      email,
      password,
    })
      .then((response) => {
        console.log("Backend Response:", response.data);

        if (response.data.message === 'ACCOUNT CREATED SUCCESSFULLY') {
          setRegisterStatus(response.data.message);
          window.location.href = "/"; 
        } else {
          setRegisterStatus(response.data.message || 'Unexpected server response.');
        }
      })
      .catch((err) => {
        console.error("Error during registration:", err);
        setRegisterStatus('An error occurred during registration.');
      });
  };


  
  const login = (e) => {
    e.preventDefault();
    if (!email || !password) {
        setLoginStatus('Please fill out both email and password fields.');
        return;
    }
    Axios.post(`${baseURL}/login`, {
        email: email,
        password: password,
    }).then((response) => {
        console.log(response.data)

        if (response.data.message === "Wrong password") {
            setLoginStatus('Incorrect password');
        } else if (response.data.message === "User not found") {
            setLoginStatus('User does not exist');
        } else if (response.data.message) {
            setLoginStatus(response.data.message);
        } else {
            setLoginStatus('Login success');
            setIsLoggedIn(true);
            sessionStorage.setItem('username', response.data.fname);
            sessionStorage.setItem('useid', response.data.id);
            localStorage.setItem('isLoggedIn', true); 
            window.location.href = "/";
        }
    })
    .catch((error) => {
        console.error("Login error:", error);
        setLoginStatus('An error occurred during login');
    });
};


  

  return (
    <div>
    <Container className="my-5">
      <Row className="justify-content-md-center">
        <Col md={8} lg={6} xl={4}>
          <Card className="shadow-lg rounded">
            <Card.Body>
              <h3 className="text-center mb-4">
                {isRegistering ? "Register" : "Login"}
              </h3>

              {isRegistering ? (
                // **Registration Form**
                <Form onSubmit={register}>
                <Form.Group controlId="formFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter first name"
                    value={fname}
                    onChange={(e) => setFname(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter last name"
                    value={lname}
                    onChange={(e) => setLname(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

  
                <Form.Group controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm your password"
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="mt-3 w-100"
                >
                  Register
                </Button>
              </Form>

              ) : (
                // **Login Form**
                <Form >
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      ype="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      
                    
                    />
                  </Form.Group>

                  <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                     type="password"
                     placeholder="Enter password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="mt-3 w-100"
                    onClick={login}
                  >
                    Login
                  </Button >
                </Form>
              )}

              <div className="text-center mt-4">
                {isRegistering ? (
                  <p>
                    Already have an account?{" "}
                    <a href="#" onClick={() => setIsRegistering(false)}>
                      Login here.
                    </a>
                  </p>
                ) : (
                  <p>
                    Don't have an account?{" "}
                    <a href="#" onClick={() => setIsRegistering(true)}>
                      Register here.
                    </a>
                  </p>
                )}
              </div>

              {/* Display status messages */}
              {isRegistering ? (
                registerStatus && (
                  <p className="text-center text-danger">{registerStatus}</p>
                )
              ) : (
                loginStatus && (
                  <p className={`text-center ${loginStatus === 'Login success' ? 'text-success' : 'text-danger'}`}>
                    {loginStatus}
                  </p>
                )
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </div> 
  )
}

export default register