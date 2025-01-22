import { Prisma } from '@prisma/client';

const BOOKS_SEED_DATA: Prisma.BookCreateInput[] = [
  {
    authors: {
      connectOrCreate: {
        create: {
          name: 'Brandon Sanderson',
        },
        where: {
          name: 'Brandon Sanderson',
        },
      },
    },
    confirmedExists: true,
    imageUrl:
      'https://books.google.com/books/content?id=QVn-CgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    isbn13: '9780765376671',
    title: 'The Way of Kings',
  },
  {
    authors: {
      connectOrCreate: {
        create: {
          name: 'Brandon Sanderson',
        },
        where: {
          name: 'Brandon Sanderson',
        },
      },
    },
    confirmedExists: true,
    imageUrl:
      'https://books.google.com/books/content?id=t_ZYYXZq4RgC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    isbn13: '9781429914567',
    title: 'Mistborn: The Final Empire',
  },
  {
    authors: {
      connectOrCreate: {
        create: {
          name: 'Brandon Sanderson',
        },
        where: {
          name: 'Brandon Sanderson',
        },
      },
    },
    confirmedExists: true,
    imageUrl:
      'https://books.google.com/books/content?id=F_T2DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    isbn13: '9780593307120',
    title: 'Steelheart',
  },
  {
    authors: {
      connectOrCreate: {
        create: {
          name: 'Brandon Sanderson',
        },
        where: {
          name: 'Brandon Sanderson',
        },
      },
    },
    confirmedExists: true,
    imageUrl:
      'https://books.google.com/books/content?id=ZnHFzj4wKIQC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    isbn13: '9781429914550',
    title: 'Elantris',
  },
  {
    authors: {
      connectOrCreate: {
        create: {
          name: 'Brandon Sanderson',
        },
        where: {
          name: 'Brandon Sanderson',
        },
      },
    },
    confirmedExists: true,
    imageUrl:
      'https://books.google.com/books/content?id=Prj1iTmPJn4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    isbn13: '9781429967945',
    title: 'Warbreaker',
  },
];

export default BOOKS_SEED_DATA;
