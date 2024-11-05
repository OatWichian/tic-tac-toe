import { useContext } from 'react';
import { AuthContext } from '../contexts/jwt-context';
// import { AuthContext } from 'src/auth/context/jwt/auth-context';
// import { AuthContext } from '../contexts/FirebaseContext';
// import { AuthContext } from '../contexts/AwsCognitoContext';
// import { AuthContext } from '../contexts/Auth0Context';

// ----------------------------------------------------------------------

const useAuth = () => useContext(AuthContext);

export default useAuth;
