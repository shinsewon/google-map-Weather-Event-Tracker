import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapComponent, HeaderComponent } from 'components';
import { useMainContext } from './context/context';
import Loader from './components/Loader';
import Search from './components/Search';

function App() {
  const { setEventData, reRenderMarkers } = useMainContext();
  const [loading, setLoading] = useState(false);
  const [renderEvent, setRenderEvent] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const response = await axios.get(
        'https://eonet.sci.gsfc.nasa.gov/api/v3/events',
      );
      const { events } = response.data;
      setEventData(events);
      setRenderEvent(events);
      setLoading(false);
    };
    fetchEvents();
  }, []);
  useEffect(() => {
    if (reRenderMarkers !== null) {
      setRenderEvent(reRenderMarkers);
    }
  }, [reRenderMarkers]);

  return (
    <>
      <HeaderComponent />
      {!loading ? <MapComponent eventData={renderEvent} /> : <Loader />}
      {!loading && <Search />}
    </>
  );
}

export default App;
