import { User } from '@prisma/client';

type Session = {
  user: User;
};

export default Session;
