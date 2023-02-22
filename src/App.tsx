import React from 'react';
import logo from './logo.svg';
import './App.css';
import { setupAudio } from './utils/setupAudio';
import { useEffect, useState } from 'react';

function App() {
  const [running, setRunning] = useState<boolean>(false);
  useEffect(() => {
    if (!running) {
      setRunning(true);
      setupAudio(statusCallback);
    }
    return () => {
      // this now gets called when the component unmounts
    };
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
