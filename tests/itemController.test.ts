import { Request, Response } from 'express';
import { getItems } from '../src/controllers/itemController';
import ItemModel from '../src/models/item';

jest.mock('../src/models/item', () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
  },
}));

describe('Item Controller', () => {
  it('should return an empty array when no items exist', async () => {
    const req = {} as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    (ItemModel.find as jest.Mock).mockResolvedValue([]);

    await getItems(req, res, next);

    expect(res.json).toHaveBeenCalledWith([]);
    expect(next).not.toHaveBeenCalled();
  });
});
