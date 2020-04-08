const layerPath = '../../../../src/layers/common/';
const Invoke = require(`${layerPath}aws/invoke`);
const { getAddress } = require(`${layerPath}services/cep.service`);

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
});
