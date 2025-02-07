import koruLogo from '/koru.svg'
import otppLogo from '/otpp.png'
import './App.css'
import { Outlet, useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  return (
    <>
      <div>
        <a href="https://www.hellokoru.com/" target="_blank">
          <img src={koruLogo} className="logo" alt="Koru logo" />
        </a>
        <a href="https://www.otpp.com/en-ca/" target="_blank">
          <img src={otppLogo} className="logo" alt="OTPP logo" />
        </a>
      </div>
      <h1>OnClass</h1>
      <h2>Streamlining observation process for teachers</h2>
      <div className="card">
        <button className="login-button" onClick={() => navigate("/login")}>Login</button>
      </div>
      
      <Outlet />
    </>
  )
}

export default App
