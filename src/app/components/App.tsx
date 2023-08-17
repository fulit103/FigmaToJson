import React, { useState } from 'react';
import logo from '../assets/logo.svg';
import '../styles/ui.css';
import ReactJson from 'react-json-view';

function App() {
  const [selectedElements, setSelectedElements] = useState< string []>([]);
  const [nodeJson, setNodeJson] = useState<Object>(null);

  const onCreateJson = () => {    
    parent.postMessage({ pluginMessage: { type: 'create-json' } }, '*');
  };

  const onCancel = () => {
    setNodeJson(null);
  };

  React.useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event: MessageEvent) => {
      const { type, message } = event.data.pluginMessage;
      if (type === 'create-rectangles') {
        console.log(`Figma Says: ${message}`);
      }

      if (type === 'code') {
        console.log('code', event.data.pluginMessage);
        setSelectedElements(event.data.pluginMessage.selection);
      }

      if (type == 'empty') {
        console.log('empty');
        setSelectedElements([]);
      }

      if (type == 'node-json'){
        setNodeJson(message);
      }
    };

    return () => {
      window.onmessage = null;
    };
  }, []);

  return (
    <div>
      <img src={logo} />
      <h2>Jebbit Screen Creator</h2>
      <ul>
        {selectedElements.map((element, index) => <li key={index} style={{textAlign: 'left'}}>{element}</li>)}
      </ul>

      {/*<p>
        Count: <input ref={countRef} />
        Selected: {selected ? 'true' : 'false'}
      </p>*/}


      {nodeJson && <p>
        <ReactJson src={nodeJson} style={{textAlign: 'left'}}/>
      </p>}

      <button id="create" onClick={onCreateJson}>
        Create Json
      </button>
      <button onClick={onCancel}>Clear</button>
    </div>
  );
}

export default App;
