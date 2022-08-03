import Auth from './components/Auth';
import Counter from './components/Counter';
import { useSelector } from 'react-redux';
import UserForm from './components/UserForm';
import Header from './components/Header'
import UserProfile from './components/UserProfile'

function App() {
  const isAuthenticate = useSelector(state => state.auth.isAuth)
  return (
    <>
    <Header/>

    {!isAuthenticate && <Auth/>}
    
    {isAuthenticate && <UserProfile/>}
  
    <Counter/> 
    
    </>
  );
}

export default App;
