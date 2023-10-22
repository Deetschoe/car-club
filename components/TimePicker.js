// components/TimeInput.js
import React, { useEffect, useRef } from 'react';

const TimePicker = () => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <input 
    type="time" ref={inputRef} style={{
      WebkitAppearance: 'none',
      border: '1px solid #ccc',
      backgroundColor: '#FFD500',
      color: "#000",
      fontWeight: 600,
      width: "100%",
      height: "200px",
      fontSize: 80,
      borderRadius: 16,
      boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.25) inset",
      filter: "drop-shadow(0px 4px 16px rgba(0, 0, 0, 0.25))"
    }}/>
  );
};

export default TimePicker;
