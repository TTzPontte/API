const financing = require('../../../../packages/financing');

describe('Financing', () => {
  it('should be able status 200', async () => {
    const response = await financing.hello('Hello Word');

    expect(response.statusCode).toEqual(200);
  });
});
