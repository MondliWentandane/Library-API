# Library API

A RESTful API for managing a library system with authors and books, built with Node.js, Express, and TypeScript.

##  Quick Start===  Library API will be available at http://localhost:3000

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build and run in production
npm run build
npm start
````
=============================================
Create an Author
bash
POST /authors
Content-Type: application/json

{
  "name": "J.K. Rowling",
  "bio": "British author best known for Harry Potter series",
  "nationality": "British",
  "birthYear": 1965
}

================================  
Create a Book
bash
POST /books
Content-Type: application/json

{
  "title": "Harry Potter and the Philosopher's Stone",
  "authorId": "1",
  "isbn": "9780747532743",
  "publicationYear": 1997,
  "genre": "Fantasy",
  "description": "The first book in the Harry Potter series"
}
=================================================  

Error response format:

json
{
  "success": false,
  "error": "Error message description"
}

===========================================








