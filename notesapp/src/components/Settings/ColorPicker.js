import React from 'react';

const ColorPicker = ({ onColorChange }) => {
  return (
    <div>
      <label htmlFor="background-color">Selecciona el color de fondo: </label>
      <input
        type="color"
        id="background-color"
        onChange={(e) => onColorChange(e.target.value)}
      />
    </div>
  );
};

export default ColorPicker;
