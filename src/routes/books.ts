import { Router, Request, Response } from 'express';
import { 
  getBooks, 
  getBookById, 
  createBook, 
  updateBook, 
  deleteBook, 
  searchBooks 
} from '../models/book';
import { successResponse, errorResponse } from '../middleware/errorHandler';
import { validateBook } from '../middleware/validation';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const { q, authorId, genre, year, page, limit } = req.query;
    
    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 10;
    const yearNumber = year ? parseInt(year as string) : undefined;
    
    if (q || authorId || genre || year) {
      const result = searchBooks(
        q as string, 
        authorId as string, 
        genre as string, 
        yearNumber,
        pageNumber, 
        limitNumber
      );
      res.json(successResponse(result.data, 'Books retrieved successfully', result.pagination));
    } else {
      const books = getBooks();
      const startIndex = (pageNumber - 1) * limitNumber;
      const endIndex = startIndex + limitNumber;
      const paginatedBooks = books.slice(startIndex, endIndex);
      
      res.json(successResponse(
        paginatedBooks, 
        'Books retrieved successfully',
        {
          page: pageNumber,
          limit: limitNumber,
          total: books.length,
          totalPages: Math.ceil(books.length / limitNumber)
        }
      ));
    }
  } catch (error) {
    res.status(500).json(errorResponse('Failed to fetch books'));
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = getBookById(id);
    res.json(successResponse(book, 'Book retrieved successfully'));
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Failed to fetch book'));
    }
  }
});

router.post('/', validateBook, (req: Request, res: Response) => {
  try {
    const newBook = createBook(req.body);
    res.status(201).json(successResponse(newBook, 'Book created successfully'));
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      res.status(400).json(errorResponse(error.message));
    } else if (error.name === 'ConflictError') {
      res.status(409).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Failed to create book'));
    }
  }
});

router.put('/:id', validateBook, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedBook = updateBook(id, req.body);
    res.json(successResponse(updatedBook, 'Book updated successfully'));
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json(errorResponse(error.message));
    } else if (error.name === 'ValidationError' || error.name === 'ConflictError') {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Failed to update book'));
    }
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    deleteBook(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Failed to delete book'));
    }
  }
});

export default router;