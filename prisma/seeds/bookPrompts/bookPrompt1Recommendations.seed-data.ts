import { Prisma } from '@prisma/client';

const BOOK_PROMPT_1_RECOMMENDATIONS: Omit<
  Prisma.BookRecommendationCreateInput,
  'bookPrompt'
>[] = [
  {
    book: {
      connect: {
        isbn13: '9780765376671',
      },
    },
    confidenceScore: 1.0,
    explanation:
      "This is the first book in a new epic series that showcases Sanderson's ability to build complex worlds and intricate plots. 'The Way of Kings' is noted for its expansive scope and detailed character development, appealing to fans of epic fantasy. It has received high praise for its depth and Sanderson's imaginative storytelling.",
  },
  {
    book: {
      connect: {
        isbn13: '9781429914567',
      },
    },
    confidenceScore: 0.97,
    explanation:
      "The Mistborn series is a fantastic entry point for readers new to Sanderson's work. Known for its meticulously crafted magic system and engaging plot, this book offers a richly layered world where 'allomancy'—the ability to harness metals—plays a central role. Sanderson's storytelling skills shine through, making it one of his most popular and well-loved series.",
  },
  {
    book: {
      connect: {
        isbn13: '9780593307120',
      },
    },
    confidenceScore: 0.9,
    explanation:
      "Part of the Reckoners series, 'Steelheart' shifts from Sanderson's typical fantasy to a post-apocalyptic superhero setting. This book is praised for its fast-paced storyline and thrilling action, ideal for those interested in seeing Sanderson apply his world-building skills to a different genre.",
  },
  {
    book: {
      connect: {
        isbn13: '9781429914550',
      },
    },
    confidenceScore: 0.8,
    explanation:
      "This standalone novel is set in a world where mortals live in the shadow of their very literal deities. Known for its complex characters and unique magic system, 'Elantris' is a great showcase of Sanderson's knack for crafting immersive narratives. This novel is compelling, albeit shorter, offering a complete experience of Sanderson's writing style.",
  },
  {
    book: {
      connect: {
        isbn13: '9781429967945',
      },
    },
    confidenceScore: 0.85,
    explanation:
      "Another standalone in Sanderson's collection, this novel has garnered acclaim for its deep dive into a magic system involving color and breath. The story is filled with surprising plot twists and features a rich tapestry of characters, making it a must-read for fans of innovative fantasy tales.",
  },
];

export default BOOK_PROMPT_1_RECOMMENDATIONS;
