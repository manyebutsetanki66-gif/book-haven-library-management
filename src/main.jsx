import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app.jsx';
import './index.css';

function seedLibraryDatabase() {
  const BOOKS_KEY = "libraryBooks";

  if (!localStorage.getItem(BOOKS_KEY)) {
    const defaultBooks = [
      {
        id: 10001,
        title: "Chaka",
        author: "Thomas Mofolo",
        genre: "Fiction",
        isbn: "9780435905545",
        quantity: 5
      },
      {
        id: 10002,
        title: "Moeti oa Bochabela",
        author: "Thomas Mofolo",
        genre: "Fiction",
        isbn: "9780947054137",
        quantity: 1
      },
      {
        id: 10003,
        title: "Clean Code",
        author: "Robert C. Martin",
        genre: "Programming",
        isbn: "9780132350884",
        quantity: 6
      },
      {
        id: 10004,
        title: "Eloquent JavaScript",
        author: "Marijn Haverbeke",
        genre: "Programming",
        isbn: "9781593279509",
        quantity: 1
      },
      {
        id: 10005,
        title: "The Pragmatic Programmer",
        author: "David Thomas",
        genre: "Programming",
        isbn: "9780135957059",
        quantity: 4
      },
      {
        id: 10006,
        title: "Salt, Fat, Acid, Heat",
        author: "Samin Nosrat",
        genre: "Cooking",
        isbn: "9781476753836",
        quantity: 3
      }
    ];

    localStorage.setItem(BOOKS_KEY, JSON.stringify(defaultBooks));
    console.log("Library system successfully seeded with 6 default books!");
  }
}

seedLibraryDatabase();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
