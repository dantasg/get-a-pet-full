import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Container from './components/layout/Container';
import Message from './components/layout/Message';

// Pages Users
import Login from './components/pages/Auth/Login';
import Register from './components/pages/Auth/Register';
import Home from './components/pages/Home';
import Profile from './components/pages/User/Profile';

// Pages Pets
import MyPets from './components/pages/Pets/MyPets';
import AddPet from './components/pages/Pets/AddPet';
import EditPet from './components/pages/Pets/EditPet';
import PetDetails from './components/pages/Pets/PetDetails';
import MyAdoptions from './components/pages/Pets/MyAdoptions';

// Context
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <Message />
        <Container>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/user/profile">
              <Profile />
            </Route>
            <Route path="/pet/mypets">
              <MyPets />
            </Route>
            <Route path="/pet/add">
              <AddPet />
            </Route>
            <Route path="/pet/myadoptions">
              <MyAdoptions />
            </Route>
            <Route path="/pet/edit/:id">
              <EditPet />
            </Route>
            <Route path="/pet/:id">
              <PetDetails />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Container>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
