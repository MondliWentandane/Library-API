import { Router, Request, Response } from 'express';
import { 
  getAuthors, 
  getAuthorById, 
  createAuthor, 
  updateAuthor, 
  deleteAuthor, 
  searchAuthors,
  getBooksByAuthor 
} from '../models/author'; // CHANGED FROM '../models/book'
import { successResponse, errorResponse } from '../middleware/errorHandler';
import { validateAuthor } from '../middleware/validation';

const router = Router();

// GET /authors - Get all authors with optional search and pagination
router.get('/', (req: Request, res: Response) => {
  try {
    const { q, page, limit } = req.query;
    
    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 10;
    
    if (q) {
      // Search authors
      const result = searchAuthors(q as string, pageNumber, limitNumber);
      res.json(successResponse(result.data, 'Authors retrieved successfully', result.pagination));
    } else {
      // Get all authors with pagination
      const authors = getAuthors();
      const startIndex = (pageNumber - 1) * limitNumber;
      const endIndex = startIndex + limitNumber;
      const paginatedAuthors = authors.slice(startIndex, endIndex);
      
      res.json(successResponse(
        paginatedAuthors, 
        'Authors retrieved successfully',
        {
          page: pageNumber,
          limit: limitNumber,
          total: authors.length,
          totalPages: Math.ceil(authors.length / limitNumber)
        }
      ));
    }
  } catch (error) {
    res.status(500).json(errorResponse('Failed to fetch authors'));
  }
});

// GET /authors/:id - Get author by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const author = getAuthorById(id);
    res.json(successResponse(author, 'Author retrieved successfully'));
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Failed to fetch author'));
    }
  }
});

// POST /authors - Create new author
router.post('/', validateAuthor, (req: Request, res: Response) => {
  try {
    const newAuthor = createAuthor(req.body);
    res.status(201).json(successResponse(newAuthor, 'Author created successfully'));
  } catch (error: any) {
    if (error.name === 'ConflictError') {
      res.status(409).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Failed to create author'));
    }
  }
});

// PUT /authors/:id - Update author
router.put('/:id', validateAuthor, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedAuthor = updateAuthor(id, req.body);
    res.json(successResponse(updatedAuthor, 'Author updated successfully'));
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json(errorResponse(error.message));
    } else if (error.name === 'ConflictError') {
      res.status(409).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Failed to update author'));
    }
  }
});

// DELETE /authors/:id - Delete author
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    deleteAuthor(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Failed to delete author'));
    }
  }
});

// GET /authors/:id/books - Get all books by author
router.get('/:id/books', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const books = getBooksByAuthor(id);
    res.json(successResponse(books, 'Author books retrieved successfully'));
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      res.status(404).json(errorResponse(error.message));
    } else {
      res.status(500).json(errorResponse('Failed to fetch author books'));
    }
  }
});

export default router;