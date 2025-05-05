
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Listing from './pages/Listing'
import Home from './pages/Home'
import Update from './pages/Update'
import Delete from './pages/ConfirmDelete'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './components/AuthContext';
import { useAuth } from './components/AuthContext';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar bg="dark" data-bs-theme="dark">
          <Container>
            <Nav className='me-auto mx-auto'>
              <Nav.Link href="/">Home</Nav.Link> | <Nav.Link href="/list">Listing</Nav.Link> | <Nav.Link href="/register">Register</Nav.Link> |
            </Nav>
          </Container>
        </Navbar>

        <Routes>
          <Route path="/" element={<PrivateRoute> <Home /> </PrivateRoute>}></Route>
          <Route path="/register" element={<PrivateRoute> <Update /></PrivateRoute>} />
          <Route path="/list" element={<PrivateRoute> <Listing /></PrivateRoute>} />
          <Route path="/update/:id" element={<PrivateRoute> <Update /></PrivateRoute>} />
          <Route path="/delete/:id" element={<PrivateRoute> <Delete /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
