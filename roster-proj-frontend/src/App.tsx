import React from 'react';
import Table from './components/Table.tsx'
import './App.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import 'react-tooltip/dist/react-tooltip.css';
import Button from 'react-bootstrap/Button';
import EntryPopup from './components/entryPopup.tsx';
import DisplayStats from './components/displayStats.tsx';

function App() {
  return (<>
  <div className="firstRow">
    <h1>Student Directory</h1>
    <div className="leftPannel">
        <EntryPopup/>
        <DisplayStats/>
    </div>
  </div>
  <Table/>
  </>
  );
}

export default App;
