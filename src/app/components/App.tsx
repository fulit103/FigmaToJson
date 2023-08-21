import React, { useState } from 'react';
import logo from '../assets/logo.svg';
import '../styles/ui.css';
import ReactJson from 'react-json-view';

function App() {
  const [selectedElements, setSelectedElements] = useState< string []>([]);
  const [nodeJson, setNodeJson] = useState<Object>(null);
  const [stateCampaign, setStateCampaign] = useState<{ loading: boolean, hasError: boolean, error: string | null}>({
    loading: false,
    hasError: false,
    error: null,
  });

  const [campaignId, setCampaignId] = useState('');

  const onCreateJson = () => {    
    parent.postMessage({ pluginMessage: { type: 'create-json' } }, '*');
  };

  const onCancel = () => {
    setNodeJson(null);
  };

  const onCreateCampaign = () => {
    setStateCampaign({
      loading: true,
      hasError: false,
      error: null,
    })
    setCampaignId('');
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "source": "figma_v2",
      "data": {
        contents: [nodeJson]
      },
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch('http://localhost:3000/api/v1/campaign_create', requestOptions).then( async (response) => {
      if(response.status==200){
        const json = await response.json()
        console.log("Response",json);
        parent.postMessage({ pluginMessage: { type: 'experience-created', data: json } }, '*');
        setStateCampaign(prev => { return {...prev, loading: false} })
        setCampaignId(json.campaign)
      } else {
        setStateCampaign(prev => { return {...prev, loading: false, hasError: true, error: response.statusText } })  
      }
    }).catch((error) => {
      console.log("Fetch Error", error)
      setStateCampaign(prev => { return {...prev, loading: false, hasError: true, error: error.message } })
    });
  }

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


      

      <button onClick={onCreateJson} disabled={stateCampaign.loading}>
        Get Json
      </button>
      <button onClick={onCancel} disabled={stateCampaign.loading}>Clear</button>
      <button onClick={onCreateCampaign} disabled={stateCampaign.loading || nodeJson==null}>
        {stateCampaign.loading ? 'loading' : 'Create Experience'}
      </button>

      {campaignId && <p style={{backgroundColor: 'green'}}>{campaignId}</p>}

      {stateCampaign.hasError && <p style={{color: 'red'}}>
          {stateCampaign.error || 'An unespected error'}
        </p>}

      {nodeJson && <p>
        <ReactJson src={nodeJson} style={{textAlign: 'left'}}/>
      </p>}

    </div>
  );
}

export default App;
