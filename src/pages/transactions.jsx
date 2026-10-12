import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

export default function Transactions() {

  const [books, setBooks] = useLocalStorage('libraryBooks', []);
  const [transactions, setTransactions] = useLocalStorage('libraryTransactions', []);


  const [selectedBookId, setSelectedBookId] = useState('');
  const [transactionQty, setTransactionQty] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  const processStockChange = (actionType) => {
    setErrorMessage('');
    setSuccessMessage('');

    const targetBookId = parseInt(selectedBookId, 10);
    const parsedAmount = parseInt(transactionQty, 10);


    if (!selectedBookId) {
      setErrorMessage('Please select a book from the directory dropdown before submitting.');
      return;
    }


    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Please enter a valid transactional adjustment volume count (Minimum is 1).');
      return;
    }


    const targetBook = books.find(b => b.id === targetBookId);
    if (!targetBook) {
      setErrorMessage('The selected book could not be found in the current system context.');
      return;
    }


    if (actionType === 'Deducted' && parsedAmount > targetBook.quantity) {
      setErrorMessage(`Insufficient book quantities available! You are trying to borrow ${parsedAmount} copies, but only ${targetBook.quantity} are currently in stock.`);
      return;
    }


    const finalCalculatedQuantity = actionType === 'Added' 
      ? targetBook.quantity + parsedAmount 
      : targetBook.quantity - parsedAmount;


    setBooks(books.map(b => b.id === targetBookId ? { ...b, quantity: finalCalculatedQuantity } : b));


    const newHistoryTrailEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      title: targetBook.title,
      type: actionType,
      amount: parsedAmount
    };

    setTransactions([newHistoryTrailEntry, ...transactions]);
    setSuccessMessage(`Successfully recorded transaction: "${targetBook.title}" stock updated (${actionType} ${parsedAmount} copies).`);


    setSelectedBookId('');
    setTransactionQty('');
  };

  return (
    <section className="section-card">
      <div className="section-header">
        <h2><i className="fa-solid fa-right-left"></i> Availability Management Console</h2>
      </div>

      
      {errorMessage && (
        <div style={{ backgroundColor: '#ffe5e5', color: '#c62828', padding: '14px', borderRadius: '15px', marginBottom: '20px', fontWeight: '600' }}>
          <i className="fa-solid fa-triangle-exclamation"></i> {errorMessage}
        </div>
      )}

      {successMessage && (
        <div style={{ backgroundColor: '#e5f7e8', color: '#237a35', padding: '14px', borderRadius: '15px', marginBottom: '20px', fontWeight: '600' }}>
          <i className="fa-solid fa-circle-check"></i> {successMessage}
        </div>
      )}

      
      <div className="transaction-form">
        <div className="form-group">
          <label htmlFor="transaction-book">
            <i className="fa-solid fa-book-bookmark"></i> Select Targeted Inventory Book
          </label>
          <select 
            id="transaction-book" 
            className="form-control"
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
          >
            <option value="">-- Choose an item from the library --</option>
            {books.map(book => (
              <option key={book.id} value={book.id}>
                {book.title} ({book.quantity} copies left in database)
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginTop: '20px' }}>
          <label htmlFor="transaction-quantity">
            <i className="fa-solid fa-calculator"></i> Transactional Volume Amount
          </label>
          <input 
            type="number" 
            id="transaction-quantity" 
            className="form-control"
            placeholder="e.g. 5"
            value={transactionQty}
            onChange={(e) => setTransactionQty(e.target.value)}
          />
        </div>

        
        <div className="transaction-buttons">
          <button 
            type="button" 
            className="btn-stock" 
            onClick={() => processStockChange('Added')}
          >
            <i className="fa-solid fa-circle-plus"></i> Add Inbound Stock Arrival
          </button>
          <button 
            type="button" 
            className="btn-borrow" 
            onClick={() => processStockChange('Deducted')}
          >
            <i className="fa-solid fa-hand-holding-hand"></i> Deduct Outbound Borrowed Book
          </button>
        </div>
      </div>

      
      <h3 className="history-title">
        <i className="fa-solid fa-clock-rotate-left"></i> System Transaction History Log
      </h3>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date & Time Stamp</th>
              <th>Book Title Source</th>
              <th>Transaction Action Type</th>
              <th>Copies Adjusted</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>No log entries registered inside the local running transactional database memory trails yet.</td>
              </tr>
            ) : (
              transactions.map((t, idx) => (
                <tr key={t.id}>
                  <td>{idx + 1}</td>
                  <td>{t.timestamp}</td>
                  <td style={{ fontWeight: '600' }}>{t.title}</td>
                  <td>
                    <span 
                      className="book-genre" 
                      style={{ 
                        backgroundColor: t.type === 'Added' ? '#e5f7e8' : '#ffe5e5', 
                        color: t.type === 'Added' ? '#237a35' : '#c62828' 
                      }}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td><strong>{t.amount}</strong></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
