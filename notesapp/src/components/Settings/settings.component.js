import React from 'react';
import ColorPicker from './ColorPicker';

const Settings = ({ onColorChange }) => {
  return (
    <div>
      <h2>Ajustes</h2>
      <ColorPicker onColorChange={onColorChange} />
    </div>
  );
};

export default Settings;
