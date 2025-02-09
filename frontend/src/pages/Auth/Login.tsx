import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../../api/axios';
import { toast, ToastContainer } from 'react-toastify';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    interface LoginData {
      username: string;
      password: string;
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();

      // Create the data to be sent to the server
      const loginData: LoginData = {
        username,
        password
      };

      try {
        // Send POST request to the /login endpoint
        const response = await api.post('/login', loginData);
  
        // Check if login was successful
        if (response.status === 200) {
          // Redirect to /home if login is successful
          navigate('/home');
        } else {
          // Handle login error (invalid credentials)
          toast.error('Invalid email or password');
        }
      } catch (error) {
        console.error('Error during login:', error);
        toast.error('There was an error logging in. Please try again later.');
      }
    };

    return (
      <div className="container">
        {/* From Uiverse.io by Yaya12085 */}
        <form className="form" onSubmit={(e) => handleSubmit(e)}>
          <p className="form-title">Sign in to your account</p>
          <div className="input-container">
            <input placeholder="Enter email" 
              type="email" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
            />
            <span>
              <svg
                stroke="currentColor"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></path>
              </svg>
            </span>
          </div>
          <div className="input-container">
            {/* Let's pretend the password is prefilled */}
            <input placeholder="Enter password" type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span>
              <svg
                stroke="currentColor"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></path>
                <path
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></path>
              </svg>
            </span>
          </div>
          <button className="submit" type="submit">
            Sign in
          </button>
          <p className="signup-link" onClick={() => navigate('/')}>
            No account? <a href="#">Sign up</a>
          </p>
          <p className="signup-link" onClick={() => navigate('/')}>
            {/* Redirect to /home */}
            <a href="#">Back</a>
          </p>
        </form>
        <ToastContainer />
      </div>
    );
  };
  
  export default Login;
  