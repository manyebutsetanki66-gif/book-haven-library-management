import React from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import StatCard from '../components/statCard.jsx';

export default function Dashboard() {

  const [books] = useLocalStorage('libraryBooks', []);
  const [users] = useLocalStorage('libraryUsers', []);


  const totalUniqueTitles = books.length;
  const totalRegisteredMembers = users.length;


  const absoluteStockVolume = books.reduce((acc, book) => acc + (Number(book.quantity) || 0), 0);


  const lowStockBooksCollection = books.filter(book => Number(book.quantity) < 2);
  const lowStockCount = lowStockBooksCollection.length;

  return (
    <section>
      
      <div className="welcome-card">
        <h1>
          <i className="fa-solid fa-square-poll-vertical"></i> Library Management Dashboard
        </h1>
        <div className="badge-count">
          <i className="fa-solid fa-circle-nodes"></i> Operational System Running
        </div>
      </div>

      
      <div className="dashboard-cards" style={{ marginBottom: '40px' }}>
        <StatCard 
          iconClass="fa-solid fa-book-atlas" 
          title="Total Unique Titles" 
          value={totalUniqueTitles} 
        />
        <StatCard 
          iconClass="fa-solid fa-boxes-stacked" 
          title="Total Stock Volume Copies" 
          value={absoluteStockVolume} 
        />
        <StatCard 
          iconClass="fa-solid fa-triangle-exclamation" 
          title="Low Stock Book Alerts" 
          value={lowStockCount}
          specialStyle={{
            borderLeft: lowStockCount > 0 ? '5px solid #e3344b' : '1px solid #dfe7f1',
            color: lowStockCount > 0 ? '#e3344b' : 'inherit'
          }}
        />
      </div>

      
      {lowStockCount > 0 && (
        <div style={{ 
          backgroundColor: '#ffe5e5', 
          border: '1px solid #e3344b', 
          color: '#c62828', 
          padding: '20px', 
          borderRadius: '25px', 
          marginBottom: '35px' 
        }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-triangle-exclamation"></i> CRITICAL WARNING: LOW INVENTORY COPIES DETECTED
          </h4>
          <p style={{ margin: '0 0 15px 0', fontWeight: '500' }}>
            The following library books have fallen below the mandatory safe threshold of **2 copies** in stock. Arrange inbound arrivals immediately:
          </p>
          <ul style={{ paddingLeft: '20px', margin: '0' }}>
            {lowStockBooksCollection.map(book => (
              <li key={book.id} style={{ marginBottom: '6px', fontWeight: '600' }}>
                📖 "{book.title}" by {book.author} — <span style={{ textDecoration: 'underline' }}>Only {book.quantity} copy left!</span> (ISBN: {book.isbn})
              </li>
            ))}
          </ul>
        </div>
      )}

      
      <div className="section-card">
        <div className="section-header">
          <h2><i className="fa-solid fa-table-list"></i> Current Book Availability Matrix</h2>
        </div>
        
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Book Title</th>
                <th>Author</th>
                <th>Genre Category</th>
                <th>ISBN Identifier</th>
                <th>Available Quantity Balance</th>
                <th>Status Indicator</th>
              </tr>
            </thead>
            <tbody>
              {books.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>No library books currently configured inside persistent local storage databases.</td>
                </tr>
              ) : (
                books.map((book, idx) => {
                  const isLow = Number(book.quantity) < 2;
                  return (
                    <tr key={book.id} style={{ 
                      backgroundColor: isLow ? '#fff5f5' : 'transparent' 
                    }}>
                      <td>{idx + 1}</td>
                      <td style={{ fontWeight: '600' }}>{book.title}</td>
                      <td>{book.author}</td>
                      <td><span className="book-genre">{book.genre}</span></td>
                      <td><code>{book.isbn}</code></td>
                      <td>
                        <strong style={{ color: isLow ? '#e3344b' : 'inherit', fontSize: isLow ? '1.1rem' : '1rem' }}>
                          {book.quantity}
                        </strong>
                      </td>
                      <td>
                        <span className="book-genre" style={{
                          backgroundColor: isLow ? '#e3344b' : '#0b1a2e',
                          color: '#ffffff',
                          fontSize: '0.85rem'
                        }}>
                          {isLow ? '⚠️ REORDER LOW STOCK' : '✅ AVAILABLE'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
