import { useState, useEffect } from 'react';

export default function useLocalStorage(key, initialValue) {

  const [state, setState] = useState(() => {
    try {
      const savedItem = localStorage.getItem(key);
      return savedItem ? JSON.parse(savedItem) : initialValue;
    } catch (error) {
      console.error("Local Storage parsing error: ", error);
      return initialValue;
    }
  });


  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error("Local Storage sync error: ", error);
    }
  }, [key, state]);

  return [state, setState];
}
