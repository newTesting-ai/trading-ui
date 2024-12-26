import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AuthPage = () => {
  const navigate = useNavigate();
  
  // State management
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!isLogin) {
      // Signup specific validations
      if (!username) {
        setError('Username is required');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }
    }

    try {
      const endpoint = isLogin 
        ? 'https://sheep-gorgeous-absolutely.ngrok-free.app/api/v1/auth/login'
        : 'https://sheep-gorgeous-absolutely.ngrok-free.app/api/v1/auth/signup';
      
      const payload = isLogin 
        ? { email, password }
        : { email, password, username };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Authentication failed');
        return;
      }

      // Successfully authenticated
      if (data.access_token) {
        // Store JWT token
        localStorage.setItem('authToken', data.access_token);
        
        // Store user information
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to dashboard
        navigate('/');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Authentication error:', err);
    }
  };

  return (
    <Container fluid className="vh-100">
      <Row className="h-100">
        {/* Left Side - Image */}
        <Col 
          md={6} 
          className="d-none d-md-flex align-items-center justify-content-center bg-primary"
        >
          <Image 
            src="/api/placeholder/600/800" 
            alt="Authentication Background"
            fluid
            className="w-100 h-100 object-cover"
          />
        </Col>

        {/* Right Side - Authentication Form */}
        <Col 
          md={6} 
          className="d-flex align-items-center justify-content-center"
        >
          <div className="w-75">
            <h2 className="text-center mb-4">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h2>

            {error && (
              <Alert variant="danger" className="text-center">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              {!isLogin && (
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              {!isLogin && (
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Group>
              )}

              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 mb-3"
              >
                {isLogin ? 'Login' : 'Sign Up'}
              </Button>

              <div className="text-center">
                <Button 
                  variant="link"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin 
                    ? "Don't have an account? Sign Up" 
                    : "Already have an account? Login"}
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthPage;