const layerPath = 'api-src/layers/common/';
const Invoke = require(`${layerPath}aws/invoke`);
const { getAddress, isValidCep, isCovered } = require(`${layerPath}services/cep.service`);

describe('Cep service', () => {
  describe('getAddress', () => {
    beforeEach(() => {
      Invoke.invoke = jest.fn(() => ({ body: JSON.stringify({ success: true }) }));
    });
    it('invoke calculator function', async () => {
      const data = { cep: '99999000', trackCode: '123' };
      const event = {
        pathParameters: {
          cep: data.cep
        },
        queryStringParameters: {
          trackCode: data.trackCode
        }
      };
      await getAddress(data);
      expect(Invoke.invoke).toHaveBeenCalledWith('CepGetFn', event);
    });
  });

  describe('isValidCep', () => {
    it('returns true if address is valid', async () => {
      const address = { status: 'OK' };

      expect(await isValidCep(address)).toBe(true);
    });
    it('throws invalid cep error', async () => {
      const address = { status: 'INVALID' };

      try {
        await isValidCep(address);
      } catch (error) {
        expect(error.message).toBe('Invalid CEP');
      }
    });
  });
  describe('isCovered', () => {
    it('returns true if is covered', async () => {
      const address = { status: 'OK' };

      expect(await isCovered(address)).toBe(true);
    });
    it('returns false if is not covered', async () => {
      const address = { status: 'NOK' };
      expect(await isCovered(address)).toBe(false);
    });
  });
});
