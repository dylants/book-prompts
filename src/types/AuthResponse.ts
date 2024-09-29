import User from '@/types/User';

type AuthResponse =
  | {
      isLoggedIn: true;
      email: User['email'];
    }
  | {
      isLoggedIn: false;
    };

export default AuthResponse;
