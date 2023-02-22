import React from 'react';
import logo from './logo.svg';
import './App.css';
import { setupAudio } from './utils/setupAudio';
import { useEffect, useState } from 'react';

function App() {
  useEffect(() => {
    setupAudio(statusCallback);
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <p>MyThing</p>
      </header>
    </div>
  );
}

export default App;

function statusCallback(pitch: number) {
  console.log('callback');
}
