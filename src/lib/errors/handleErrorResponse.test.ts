import { handleErrorResponse } from '@/lib/errors/handleErrorResponse';
import { UnauthorizedError } from '@/lib/errors/UnauthorizedError';

describe('handleErrorResponse', () => {
  it('should return 401 for unauthorized', async () => {
    const response = handleErrorResponse(new UnauthorizedError());
    expect(response.status).toEqual(401);
    expect(await response.json()).toEqual({ error: 'Unauthorized' });
  });

  it('should return 500 for unknown', async () => {
    const response = handleErrorResponse(new Error());
    expect(response.status).toEqual(500);
    expect(await response.json()).toEqual({ error: 'Unknown error' });
  });
});
