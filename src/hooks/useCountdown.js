// src/hooks/useCountdown.js
import { useState, useEffect } from 'react';

const useCountdown = (initialTime) => {
  const [date, setDate] = useState(Date.now() + initialTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(Date.now() + initialTime);
    }, initialTime);

    return () => clearInterval(interval);
  }, [initialTime]);

  return date;
};

export default useCountdown;
