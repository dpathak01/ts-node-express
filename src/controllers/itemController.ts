import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import ItemModel from '../models/item';

// Create an item
export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body;
    const newItem = await ItemModel.create({ name });
    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  }
};

// Read all items
export const getItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const items = await ItemModel.find();
    res.json(items);
  } catch (error) {
    next(error);
  }
};

// Read single item
export const getItemById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ message: 'Invalid item id' });
      return;
    }

    const item = await ItemModel.findById(req.params.id);
    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
};

// Update an item
export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ message: 'Invalid item id' });
      return;
    }

    const { name } = req.body;
    const item = await ItemModel.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true },
    );
    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
};

// Delete an item
export const deleteItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ message: 'Invalid item id' });
      return;
    }

    const deletedItem = await ItemModel.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    res.json(deletedItem);
  } catch (error) {
    next(error);
  }
};
