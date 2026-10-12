import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';

export default function Books() {

  const [books, setBooks] = useLocalStorage('libraryBooks', []);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = (searchParams.get('search') || '').trim().toLowerCase();
  const filteredBooks = books.filter((book) =>
    [book.title, book.author, book.genre, book.isbn].some((value) =>
      String(value ?? '').toLowerCase().includes(searchTerm)
    )
  );

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Fiction');
  const [isbn, setIsbn] = useState('');
  const [quantity, setQuantity] = useState('');

  const [editingBookId, setEditingBookId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSaveBook = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanTitle = title.trim();
    const cleanAuthor = author.trim();
    const cleanIsbn = isbn.trim().replace(/[ -]/g, '').toUpperCase();
    const parsedQty = parseInt(quantity, 10);

    if (!cleanTitle || !cleanAuthor || !cleanIsbn || quantity === '') {
      setErrorMessage('Please complete all book information fields.');
      return;
    }

    if (isNaN(parsedQty) || parsedQty < 0 || !Number.isInteger(Number(quantity))) {
      setErrorMessage('Please enter a whole-number quantity of zero or more.');
      return;
    }

    if (!/^(?:[0-9]{9}[0-9Xx]|[0-9]{13})$/.test(cleanIsbn.replace(/[ -]/g, ''))) {
      setErrorMessage('Please enter a valid 10- or 13-character ISBN (spaces and hyphens are allowed).');
      return;
    }

    if (editingBookId) {

      const isbnConflict = books.find(b => b.isbn.toLowerCase() === cleanIsbn.toLowerCase() && b.id !== editingBookId);
      if (isbnConflict) {
        setErrorMessage('A book with this ISBN already exists.');
        return;
      }

      setBooks(books.map(b => b.id === editingBookId ? { ...b, title: cleanTitle, author: cleanAuthor, genre, isbn: cleanIsbn, quantity: parsedQty } : b));
      setEditingBookId(null);
    } else {

      const duplicateIsbn = books.find(b => b.isbn.toLowerCase() === cleanIsbn.toLowerCase());
      if (duplicateIsbn) {
        setErrorMessage('A book with this ISBN already exists in the system directory.');
        return;
      }

      const newBook = {
        id: Date.now(),
        title: cleanTitle,
        author: cleanAuthor,
        genre: genre,
        isbn: cleanIsbn,
        quantity: parsedQty
      };

      setBooks([...books, newBook]);
    }

    setTitle('');
    setAuthor('');
    setGenre('Fiction');
    setIsbn('');
    setQuantity('');
  };

  const startEditBook = (book) => {
    setEditingBookId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre);
    setIsbn(book.isbn);
    setQuantity(book.quantity.toString());
    setErrorMessage('');
  };

  const handleDeleteBook = (id, bookTitle) => {
    if (window.confirm(`Are you sure you want to delete "${bookTitle}" from inventory storage maps?`)) {
      setBooks(books.filter(b => b.id !== id));

      if (editingBookId === id) {
        setEditingBookId(null);
        setTitle('');
        setAuthor('');
        setGenre('Fiction');
        setIsbn('');
        setQuantity('');
      }
    }
  };

  return (
    <section className="section-card">
      <div className="section-header">
        <h2><i className="fa-solid fa-book"></i> Book Management Page</h2>
      </div>

      {errorMessage && (
        <div style={{ backgroundColor: '#ffe5e5', color: '#c62828', padding: '12px', borderRadius: '15px', marginBottom: '20px', fontWeight: '600' }}>
          {errorMessage}
        </div>
      )}

      <form id="mylibraryform" onSubmit={handleSaveBook} className="form-card">
        <div className="form-grid">
          <div className="form-group">
            <label><i className="fa-solid fa-heading"></i> Book Title</label>
            <input 
              type="text" 
              className="form-control"
              required
              maxLength={150}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
            />
          </div>

          <div className="form-group">
            <label><i className="fa-solid fa-user-pen"></i> Author Name</label>
            <input 
              type="text" 
              className="form-control"
              required
              maxLength={120}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
            />
          </div>

          <div className="form-group">
            <label><i className="fa-solid fa-tags"></i> Book Genre Category</label>
            <div className="radio-group">
              <label>
                <input 
                  type="radio" 
                  name="book-genre" 
                  value="Fiction" 
                  checked={genre === 'Fiction'}
                  onChange={(e) => setGenre(e.target.value)} 
                /> Fiction
              </label>
              <label>
                <input 
                  type="radio" 
                  name="book-genre" 
                  value="Programming" 
                  checked={genre === 'Programming'}
                  onChange={(e) => setGenre(e.target.value)} 
                /> Programming
              </label>
              <label>
                <input 
                  type="radio" 
                  name="book-genre" 
                  value="Cooking" 
                  checked={genre === 'Cooking'}
                  onChange={(e) => setGenre(e.target.value)} 
                /> Cooking
              </label>
            </div>
          </div>

          <div className="form-group">
            <label><i className="fa-solid fa-barcode"></i> ISBN Code Identifier</label>
            <input 
              type="text" 
              className="form-control"
              required
              minLength={10}
              maxLength={17}
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="e.g. 9781234567890"
            />
          </div>

          <div className="form-group">
            <label><i className="fa-solid fa-layer-group"></i> Initial Stock Copies</label>
            <input 
              type="number" 
              className="form-control"
              min="0"
              step="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity amount count"
            />
          </div>
        </div>

        <button type="submit" className="btn-add">
          {editingBookId ? (
            <>
              <i className="fa-solid fa-square-check"></i> Save Book Changes Details
            </>
          ) : (
            <>
              <i>+</i> Add New Book Entry
            </>
          )}
        </button>
        {editingBookId && (
          <button 
            type="button" 
            className="btn-borrow" 
            style={{ marginLeft: '15px', height: '60px' }}
            onClick={() => {
              setEditingBookId(null);
              setTitle('');
              setAuthor('');
              setGenre('Fiction');
              setIsbn('');
              setQuantity('');
            }}
          >
            Cancel Modification
          </button>
        )}
      </form>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>ISBN Code</th>
              <th>In-Stock Qty</th>
              <th>Actions Available</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>{searchTerm ? 'No books match your search.' : 'No books have been added yet.'}</td>
              </tr>
            ) : (
              filteredBooks.map((book, index) => (
                <tr key={book.id}>
                  <td>{index + 1}</td>
                  <td style={{ fontWeight: '600' }}>{book.title}</td>
                  <td>{book.author}</td>
                  <td>
                    <span className="book-genre">{book.genre}</span>
                  </td>
                  <td><code>{book.isbn}</code></td>
                  <td>{book.quantity}</td>
                  <td>
                    <div className="action-btns">
                      <button type="button" className="btn-icon btn-edit" onClick={() => startEditBook(book)}>
                        <i className="fa-solid fa-pen-to-square"></i> Update
                      </button>
                      <button type="button" className="btn-icon btn-delete" onClick={() => handleDeleteBook(book.id, book.title)}>
                        <i className="fa-solid fa-trash-can"></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
