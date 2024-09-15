import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import OpenAI from 'openai';

import openai from '../src/lib/openai';

jest.mock('../src/lib/openai', () => ({
  __esModule: true,
  default: mockDeep<OpenAI>(),
}));

beforeEach(() => {
  mockReset(openaiMock);
});

export const openaiMock = openai as unknown as DeepMockProxy<OpenAI>;
