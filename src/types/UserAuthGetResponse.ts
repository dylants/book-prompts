import { User } from '@prisma/client';

type UserAuthGetResponse =
  | {
      isLoggedIn: true;
      email: User['email'];
    }
  | {
      isLoggedIn: false;
    };

export default UserAuthGetResponse;
