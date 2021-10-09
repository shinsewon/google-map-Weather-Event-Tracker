import React, { memo, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import GoogleMapReact from 'google-map-react';
import useSuperCluster from 'use-supercluster';
import { PointFeature } from 'supercluster';
import { BBox, GeoJsonProperties } from 'geojson';
import LocationMarker from './LocationMarker';
import LocationInfoBox from './LocationInfoBox';
import { useMainContext } from '../context/context';

type Section = {
  lat?: number;
  lng?: number;
};

type Center = {
  lat: number;
  lng: number;
};

type EventDataType = {
  id: string;
  link: string;
  title: string;
  sources: [{ id: string; url: string }];
  categories: { id: string; title: string }[];
  closed: null;
  description: null;
  geometry: [
    {
      coordinates: [number, number];
      date: string;
      magnitudeUnit: null;
      magnitudeValue: null;
      type: string;
    },
  ];
};

type PanTo = {
  lat: number;
  lng: number;
};

interface Ref {
  setZoom: (arg: number) => number;
  panTo: ({ lat, lng }: PanTo) => void;
}

interface MapProps {
  center: Center;
  eventData: EventDataType[];
}

const defaultProps = {
  center: { lat: 29.305561, lng: -3.981108 },
  eventData: [],
};

function MapComponent({ center, eventData }: MapProps) {
  const { selectedEvent } = useMainContext();
  const mapRef = useRef<HTMLButtonElement | Ref | null>(null);
  const [zoom, setZoom] = useState(1);
  const [bounds, setBounds] = useState([0, 0, 0, 0] as BBox);
  const [locationInfo, setLocationInfo] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const mapRefCurrent = mapRef.current as Ref;

  useEffect(() => {
    if (selectedEvent !== null && selectedEvent.length !== 0) {
      const [longitude, latitude] = selectedEvent?.geometry[0]?.coordinates;
      mapRefCurrent.panTo({ lat: latitude, lng: longitude });
      mapRefCurrent.setZoom(10);
    }
  }, [selectedEvent]);

  // Index for reference
  const eventDataIndex = {
    8: 'Wildfires',
    10: 'Severe Storms',
    12: 'Volcanoes',
    15: 'Sea and Lake Ice',
  };

  // Create an Array of its keys
  // let eventDataIndexNum: string[] | number[] = Object.keys(eventDataIndex);
  // eventDataIndexNum = eventDataIndexNum.map((idx) => Number(idx));
  const eventDataIndexNum: number[] = Object.keys(eventDataIndex).map((idx) =>
    Number(idx),
  );

  const points: Array<PointFeature<any>> = eventData.map((event) => {
    let categoriesId = null;
    if (event.categories[0].id === 'wildfires') {
      categoriesId = 8;
    }
    if (event.categories[0].id === 'severeStorms') {
      categoriesId = 10;
    }
    if (event.categories[0].id === 'volcanoes') {
      categoriesId = 12;
    }
    if (event.categories[0].id === 'seaLakeIce') {
      categoriesId = 15;
    }
    return {
      type: 'Feature',
      properties: {
        cluster: false,
        eventKey: event.id,
        eventTitle: event.title,
        eventType: categoriesId,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          event.geometry[0].coordinates[0],
          event.geometry[0].coordinates[1],
        ],
      },
    };
  });

  // Get Clusters
  const { clusters, supercluster } = useSuperCluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 },
  });

  return (
    <div className="map-container">
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY as string }}
        center={center}
        zoom={zoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => {
          mapRef.current = map;
        }}
        onChange={({ zoom, bounds }) => {
          setZoom(zoom);
          setBounds([
            bounds.nw.lng,
            bounds.se.lat,
            bounds.se.lng,
            bounds.nw.lat,
          ]);
        }}
        // onClick={() => setLocationInfo(null)}
        // onDrag={() => setLocationInfo(null)}
      >
        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const { cluster: isCluster, point_count: pointCount } =
            cluster.properties;
          // Used for icon type
          const clusterId = cluster.properties.eventType; // 제대로뜸
          if (isCluster) {
            const changeSize = Math.round((pointCount / points.length) * 100);
            // Can't exceed 40 px
            const addSize = Math.min(changeSize * 10, 40);

            return (
              <LatLngSection lat={latitude} lng={longitude} key={cluster.id}>
                <button
                  type="button"
                  className="cluster-marker"
                  style={{
                    width: `${addSize + changeSize}px`,
                    height: `${addSize + changeSize}px`,
                  }}
                  onClick={() => {
                    const expansionZoom = Math.min(
                      supercluster?.getClusterExpansionZoom(
                        Number(cluster.id),
                      ) as number,
                      20,
                    );

                    mapRefCurrent.setZoom(expansionZoom);
                    mapRefCurrent.panTo({ lat: latitude, lng: longitude }); // 지도의 중심을 지정된으로 변경합니다 LatLng. 변경 사항이 맵의 너비와 높이보다 작 으면 전환이 부드럽게 애니메이션됩니다.
                  }}
                >
                  {pointCount}
                </button>
              </LatLngSection>
            );
          }
          // Not a cluster,Just a single point
          if (
            eventDataIndexNum.indexOf(clusterId) !== -1 &&
            cluster.geometry.coordinates.length === 2
          ) {
            return (
              <LocationMarker
                lat={latitude}
                lng={longitude}
                id={clusterId}
                key={cluster.properties.eventKey}
                onClick={() => {
                  setLocationInfo({
                    id: cluster.properties.eventKey,
                    title: cluster.properties.eventTitle,
                  });
                }}
              />
            );
          }
          return null;
        })}
      </GoogleMapReact>
      {locationInfo && <LocationInfoBox info={locationInfo} />}
    </div>
  );
}

MapComponent.defaultProps = defaultProps;

export default memo(MapComponent);

const LatLngSection = styled.section<Section>``;
