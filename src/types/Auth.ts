import User from '@/types/User';

type Auth =
  | {
      isLoggedIn: true;
      email: User['email'];
    }
  | {
      isLoggedIn: false;
    };

export default Auth;
