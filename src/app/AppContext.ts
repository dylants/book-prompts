import Auth from '@/types/Auth';
import { createContext } from 'react';

export type AppContextType = {
  auth: Auth;
  setAuth: (auth: Auth) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export default AppContext;
