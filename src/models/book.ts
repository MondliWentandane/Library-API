import { Book, CreateBookRequest, UpdateBookRequest } from '../types';
import { NotFoundError, ConflictError, ValidationError } from '../middleware/errorHandler';
import { getAuthorById } from './author'; // ADD THIS IMPORT

let books: Book[] = [];
let bookNextId = 1;

export const getBooks = (): Book[] => {
  return books;
};

export const getBookById = (id: string): Book => {
  const book = books.find(b => b.id === id);
  if (!book) {
    throw new NotFoundError(`Book with ID ${id} not found`);
  }
  return book;
};

export const createBook = (bookData: CreateBookRequest): Book => {
  // Check if author exists
  try {
    getAuthorById(bookData.authorId);
  } catch (error) {
    throw new ValidationError(`Author with ID ${bookData.authorId} does not exist`);
  }

  // Check for duplicate book title by same author
  const existingBook = books.find(
    b => b.title.toLowerCase() === bookData.title.toLowerCase() && 
         b.authorId === bookData.authorId
  );
  
  if (existingBook) {
    throw new ConflictError(`Book with title '${bookData.title}' by this author already exists`);
  }

  // Check for duplicate ISBN if provided
  if (bookData.isbn) {
    const existingIsbn = books.find(b => b.isbn === bookData.isbn);
    if (existingIsbn) {
      throw new ConflictError(`Book with ISBN '${bookData.isbn}' already exists`);
    }
  }

  const newBook: Book = {
    id: bookNextId.toString(),
    title: bookData.title,
    authorId: bookData.authorId,
    isbn: bookData.isbn,
    publicationYear: bookData.publicationYear,
    genre: bookData.genre,
    description: bookData.description,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  books.push(newBook);
  bookNextId++;
  return newBook;
};

export const updateBook = (id: string, updates: UpdateBookRequest): Book => {
  const bookIndex = books.findIndex(b => b.id === id);
  
  if (bookIndex === -1) {
    throw new NotFoundError(`Book with ID ${id} not found`);
  }

  // Check if author exists if authorId is being updated
  if (updates.authorId) {
    try {
      getAuthorById(updates.authorId);
    } catch (error) {
      throw new ValidationError(`Author with ID ${updates.authorId} does not exist`);
    }
  }

  // Check for duplicate book title by same author
  if (updates.title) {
    const existingBook = books.find(
      b => b.id !== id && 
           b.title.toLowerCase() === updates.title!.toLowerCase() && 
           b.authorId === (updates.authorId || books[bookIndex].authorId)
    );
    
    if (existingBook) {
      throw new ConflictError(`Book with title '${updates.title}' by this author already exists`);
    }
  }

  // Check for duplicate ISBN if provided
  if (updates.isbn) {
    const existingIsbn = books.find(b => b.id !== id && b.isbn === updates.isbn);
    if (existingIsbn) {
      throw new ConflictError(`Book with ISBN '${updates.isbn}' already exists`);
    }
  }

  books[bookIndex] = {
    ...books[bookIndex],
    ...updates,
    updatedAt: new Date()
  };
  
  return books[bookIndex];
};

export const deleteBook = (id: string): void => {
  const bookIndex = books.findIndex(b => b.id === id);
  
  if (bookIndex === -1) {
    throw new NotFoundError(`Book with ID ${id} not found`);
  }

  books.splice(bookIndex, 1);
};

export const getBooksByAuthor = (authorId: string): Book[] => {
  // Verify author exists
  getAuthorById(authorId);
  
  return books.filter(book => book.authorId === authorId);
};

// Get books with search, filter, and pagination
export const searchBooks = (
  query?: string, 
  authorId?: string, 
  genre?: string, 
  year?: number,
  page: number = 1, 
  limit: number = 10
) => {
  let filteredBooks = books;

  // Filter by author
  if (authorId) {
    filteredBooks = filteredBooks.filter(book => book.authorId === authorId);
  }

  // Filter by genre
  if (genre) {
    filteredBooks = filteredBooks.filter(book => 
      book.genre?.toLowerCase().includes(genre.toLowerCase())
    );
  }

  // Filter by year
  if (year) {
    filteredBooks = filteredBooks.filter(book => book.publicationYear === year);
  }

  // Search in title and description
  if (query) {
    const searchTerm = query.toLowerCase();
    filteredBooks = filteredBooks.filter(book =>
      book.title.toLowerCase().includes(searchTerm) ||
      book.description?.toLowerCase().includes(searchTerm)
    );
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

  return {
    data: paginatedBooks,
    pagination: {
      page,
      limit,
      total: filteredBooks.length,
      totalPages: Math.ceil(filteredBooks.length / limit)
    }
  };
};