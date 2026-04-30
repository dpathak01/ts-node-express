import { NextFunction, Request, Response } from 'express';
import {
  createItem,
  deleteItem,
  getItemById,
  getItems,
  updateItem,
} from '../src/controllers/itemController';
import ItemModel from '../src/models/item';

jest.mock('../src/models/item', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

const validItemId = '507f1f77bcf86cd799439011';
const mockCreate = ItemModel.create as jest.Mock;
const mockFind = ItemModel.find as jest.Mock;
const mockFindById = ItemModel.findById as jest.Mock;
const mockFindByIdAndUpdate = ItemModel.findByIdAndUpdate as jest.Mock;
const mockFindByIdAndDelete = ItemModel.findByIdAndDelete as jest.Mock;

function mockResponse(): Response {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  return res as unknown as Response;
}

function mockNext(): NextFunction {
  return jest.fn() as NextFunction;
}

describe('Item Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createItem', () => {
    it('creates an item and returns 201', async () => {
      const item = { _id: validItemId, name: 'Laptop' };
      const req = { body: { name: 'Laptop' } } as Request;
      const res = mockResponse();
      const next = mockNext();

      mockCreate.mockResolvedValue(item);

      await createItem(req, res, next);

      expect(ItemModel.create).toHaveBeenCalledWith({ name: 'Laptop' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(item);
      expect(next).not.toHaveBeenCalled();
    });

    it('passes create errors to next', async () => {
      const error = new Error('create failed');
      const req = { body: { name: 'Laptop' } } as Request;
      const res = mockResponse();
      const next = mockNext();

      mockCreate.mockRejectedValue(error);

      await createItem(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getItems', () => {
    it('returns all items', async () => {
      const items = [
        { _id: validItemId, name: 'Laptop' },
        { _id: '507f1f77bcf86cd799439012', name: 'Keyboard' },
      ];
      const req = {} as Request;
      const res = mockResponse();
      const next = mockNext();

      mockFind.mockResolvedValue(items);

      await getItems(req, res, next);

      expect(ItemModel.find).toHaveBeenCalledWith();
      expect(res.json).toHaveBeenCalledWith(items);
      expect(next).not.toHaveBeenCalled();
    });

    it('returns an empty array when no items exist', async () => {
      const req = {} as Request;
      const res = mockResponse();
      const next = mockNext();

      mockFind.mockResolvedValue([]);

      await getItems(req, res, next);

      expect(res.json).toHaveBeenCalledWith([]);
      expect(next).not.toHaveBeenCalled();
    });

    it('passes read errors to next', async () => {
      const error = new Error('find failed');
      const req = {} as Request;
      const res = mockResponse();
      const next = mockNext();

      mockFind.mockRejectedValue(error);

      await getItems(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getItemById', () => {
    it('returns a single item by id', async () => {
      const item = { _id: validItemId, name: 'Laptop' };
      const req = { params: { id: validItemId } } as unknown as Request;
      const res = mockResponse();
      const next = mockNext();

      mockFindById.mockResolvedValue(item);

      await getItemById(req, res, next);

      expect(ItemModel.findById).toHaveBeenCalledWith(validItemId);
      expect(res.json).toHaveBeenCalledWith(item);
      expect(next).not.toHaveBeenCalled();
    });

    it('returns 400 for an invalid item id', async () => {
      const req = { params: { id: 'bad-id' } } as unknown as Request;
      const res = mockResponse();
      const next = mockNext();

      await getItemById(req, res, next);

      expect(ItemModel.findById).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid item id' });
      expect(next).not.toHaveBeenCalled();
    });

    it('returns 404 when the item is not found', async () => {
      const req = { params: { id: validItemId } } as unknown as Request;
      const res = mockResponse();
      const next = mockNext();

      mockFindById.mockResolvedValue(null);

      await getItemById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item not found' });
      expect(next).not.toHaveBeenCalled();
    });

    it('passes findById errors to next', async () => {
      const error = new Error('findById failed');
      const req = { params: { id: validItemId } } as unknown as Request;
      const res = mockResponse();
      const next = mockNext();

      mockFindById.mockRejectedValue(error);

      await getItemById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateItem', () => {
    it('updates an item by id', async () => {
      const item = { _id: validItemId, name: 'Monitor' };
      const req = {
        params: { id: validItemId },
        body: { name: 'Monitor' },
      } as unknown as Request;
      const res = mockResponse();
      const next = mockNext();

      mockFindByIdAndUpdate.mockResolvedValue(item);

      await updateItem(req, res, next);

      expect(ItemModel.findByIdAndUpdate).toHaveBeenCalledWith(
        validItemId,
        { name: 'Monitor' },
        { new: true, runValidators: true },
      );
      expect(res.json).toHaveBeenCalledWith(item);
      expect(next).not.toHaveBeenCalled();
    });

    it('returns 400 when updating with an invalid item id', async () => {
      const req = {
        params: { id: 'bad-id' },
        body: { name: 'Monitor' },
      } as unknown as Request;
      const res = mockResponse();
      const next = mockNext();

      await updateItem(req, res, next);

      expect(ItemModel.findByIdAndUpdate).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid item id' });
      expect(next).not.toHaveBeenCalled();
    });

    it('returns 404 when the item to update is not found', async () => {
      const req = {
        params: { id: validItemId },
        body: { name: 'Monitor' },
      } as unknown as Request;
      const res = mockResponse();
      const next = mockNext();

      mockFindByIdAndUpdate.mockResolvedValue(null);

      await updateItem(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item not found' });
      expect(next).not.toHaveBeenCalled();
    });

    it('passes update errors to next', async () => {
      const error = new Error('update failed');
      const req = {
        params: { id: validItemId },
        body: { name: 'Monitor' },
      } as unknown as Request;
      const res = mockResponse();
      const next = mockNext();

      mockFindByIdAndUpdate.mockRejectedValue(error);

      await updateItem(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteItem', () => {
    it('deletes an item by id', async () => {
      const deletedItem = { _id: validItemId, name: 'Laptop' };
      const req = { params: { id: validItemId } } as unknown as Request;
      const res = mockResponse();
      const next = mockNext();

      mockFindByIdAndDelete.mockResolvedValue(deletedItem);

      await deleteItem(req, res, next);

      expect(ItemModel.findByIdAndDelete).toHaveBeenCalledWith(validItemId);
      expect(res.json).toHaveBeenCalledWith(deletedItem);
      expect(next).not.toHaveBeenCalled();
    });

    it('returns 400 when deleting with an invalid item id', async () => {
      const req = { params: { id: 'bad-id' } } as unknown as Request;
      const res = mockResponse();
      const next = mockNext();

      await deleteItem(req, res, next);

      expect(ItemModel.findByIdAndDelete).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid item id' });
      expect(next).not.toHaveBeenCalled();
    });

    it('returns 404 when the item to delete is not found', async () => {
      const req = { params: { id: validItemId } } as unknown as Request;
      const res = mockResponse();
      const next = mockNext();

      mockFindByIdAndDelete.mockResolvedValue(null);

      await deleteItem(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item not found' });
      expect(next).not.toHaveBeenCalled();
    });

    it('passes delete errors to next', async () => {
      const error = new Error('delete failed');
      const req = { params: { id: validItemId } } as unknown as Request;
      const res = mockResponse();
      const next = mockNext();

      mockFindByIdAndDelete.mockRejectedValue(error);

      await deleteItem(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
