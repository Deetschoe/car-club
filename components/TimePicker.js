import dayjs from 'dayjs';
import React, { useEffect, useRef } from 'react';
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const TimePicker = ({ onTimeChange }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleTimeChange = (event) => {
    onTimeChange(dayjs(event.target.value, "HH:mm").toDate());
  };

  return (
    <input 
      type="time" 
      ref={inputRef} 
      onChange={handleTimeChange}
      style={{
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
      }}
    />
  );
};

export default TimePicker;
