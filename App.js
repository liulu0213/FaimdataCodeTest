import React from 'react';
import logo from './logo.svg';
import './App.css';
import MainPage from "./components/mainpage"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <MainPage source="https://randomuser.me/api/"></MainPage>
      <footer className="App-footer">Mar 2020 Faimdata Code Test</footer>
    </div>
  );
}

export default App;
