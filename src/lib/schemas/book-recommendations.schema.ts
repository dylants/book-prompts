import { JSONSchema7Type } from 'json-schema';

const bookRecommendationsSchema: JSONSchema7Type = {
  name: 'bookRecommendations',
  schema: {
    additionalProperties: false,
    properties: {
      recommendations: {
        items: {
          additionalProperties: false,
          properties: {
            author: {
              description: 'The author of the book',
              type: 'string',
            },
            confidenceScore: {
              description:
                'How confident you are in this recommendation using a score from 0 (low) to 1 (high)',
              type: 'string',
            },
            explanationToReader: {
              description:
                'Explain why you think this would be a good book for me to read',
              type: 'string',
            },
            title: {
              description: 'The title of the book',
              type: 'string',
            },
          },
          required: [
            'author',
            'confidenceScore',
            'explanationToReader',
            'title',
          ],
          type: 'object',
        },
        type: 'array',
      },
    },
    required: ['recommendations'],
    type: 'object',
  },
  strict: true,
};

export default bookRecommendationsSchema;
