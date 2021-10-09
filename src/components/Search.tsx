import React, { useEffect, useRef, useState } from 'react';
import { useMainContext } from '../context/context';

type Option = {
  value: string;
};

function Search() {
  const { eventData, setSelectedEvent, setReRenderMarkers } = useMainContext();
  const searchBox = useRef<HTMLInputElement>(null);
  const optionBox = useRef<HTMLSelectElement>(null);
  const [matchEvent, setMatchEvent] = useState(eventData);
  const [storeSelection, setStoreSelection] = useState<string>('All');

  const filterEventData = (eventData: any[]) => {
    // 스프레드 연산자로 참조 데이터를 덮어 쓰지 않습니다.
    let filteredEventData = [...eventData];
    if (storeSelection !== 'All') {
      filteredEventData = filteredEventData.filter(
        (event) => event.categories[0].title === storeSelection,
      );
    }
    return filteredEventData;
  };

  const userSearch = (searchQuery: string, eventData: any[]) => {
    let eventMatch:
      | string[]
      | { title: string; categories: { id: number; title: string }[] }[] = [];
    const filteredEventData = filterEventData(eventData);
    if (searchQuery.length > 0 && eventData) {
      Object.keys(eventData).forEach((event) => {
        const eventTitle = filteredEventData[event].title.toLowerCase();
        if (eventTitle.indexOf(searchQuery) !== -1) {
          eventMatch.push(filteredEventData[event]);
        }
      });

      if (eventMatch.length === 0) {
        eventMatch = [
          { title: 'No Result!', categories: [{ id: 1, title: '' }] },
        ];
      }
      setMatchEvent(eventMatch);
    } else {
      setMatchEvent(filteredEventData);
    }
  };

  useEffect(() => {
    // 필터 옵션을 변경했습니다. 마커도 변경되기를 원합니다.
    const filteredEventData = filterEventData(eventData);
    // console.log('filteredEventData>>>>>>',filteredEventData)
    setReRenderMarkers(filteredEventData);
    const searchCurrent = searchBox.current as Option;
    userSearch(searchCurrent.value.toLowerCase(), filteredEventData);
  }, [storeSelection]);

  return (
    <>
      <section className="option-container">
        <p>Type:</p>
        <select
          ref={optionBox}
          onBlur={() => {
            console.log('onChange 이벤트 주기위해 꼭 있어줘야함');
          }}
          onChange={() => {
            const optionValue = optionBox.current as Option;
            setStoreSelection(optionValue.value);
          }}
        >
          <option value="All">All</option>
          <option value="Wildfires">Wildfires</option>
          <option value="Severe Storms">Severe Storms</option>
          <option value="Volcanoes">Volcanoes</option>
          <option value="Sea and Lake Ice">Sea and Lake Ice</option>
        </select>
      </section>
      <section className="search-container">
        <p>Search:</p>
        <input
          type="text"
          ref={searchBox}
          onKeyUp={() => {
            const searchQuery =
              searchBox.current?.value.toLowerCase() as string;
            setTimeout(() => {
              if (searchQuery === searchBox.current?.value.toLowerCase()) {
                userSearch(searchQuery, eventData);
              }
            }, 300);
          }}
        />
      </section>
      <table className="search-table">
        <tbody>
          <tr>
            <th style={{ width: '60%' }}>Title</th>
            <th>Type</th>
            <th>Location</th>
          </tr>
          {matchEvent.map((ev) => {
            return (
              <tr key={ev.id}>
                <td>{ev.title}</td>
                <td>{ev.categories[0].title}</td>
                {ev.categories[0].title ? (
                  <td>
                    클릭
                    <a
                      href="/#"
                      onClick={() => {
                        setSelectedEvent(ev);
                      }}
                    >
                      Click Here
                    </a>
                  </td>
                ) : (
                  <td />
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default Search;
