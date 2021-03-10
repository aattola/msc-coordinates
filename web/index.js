import React, {useState, useMemo} from 'react'
import ReactDOM from 'react-dom'

import L from 'leaflet'
import { ImageOverlay, MapContainer, Marker, Popup, Rectangle, useMap } from 'react-leaflet'
// import "leaflet/dist/leaflet.css";

const innerBounds = [
  [49.505, -2.09],
  [53.505, 2.09],
]
const outerBounds = [
  [50.505, -29.09],
  [52.505, 29.09],
]

const redColor = { color: 'red' }
const whiteColor = { color: 'white' }

function SetBoundsRectangles() {
  const [bounds, setBounds] = useState(outerBounds)
  const map = useMap()

  const innerHandlers = useMemo(
    () => ({
      click() {
        setBounds(innerBounds)
        map.fitBounds(innerBounds)
      },
    }),
    [map],
  )
  const outerHandlers = useMemo(
    () => ({
      click() {
        setBounds(outerBounds)
        map.fitBounds(outerBounds)
      },
    }),
    [map],
  )

  return (
    <>
      <Rectangle
        bounds={outerBounds}
        eventHandlers={outerHandlers}
        pathOptions={bounds === outerBounds ? redColor : whiteColor}
      />
      <Rectangle
        bounds={innerBounds}
        eventHandlers={innerHandlers}
        pathOptions={bounds === innerBounds ? redColor : whiteColor}
      />
    </>
  )
}

const bounds = [[1000, 0],[0, 1000]];
const position = {lat: 0.2, lng: 0.2}

function Kartta () {
  return (
    <div>
     <MapContainer
        bounds={bounds}
        // scrollWheelZoom={false}
        onzoomstart={(e) => console.log(e)}
        attributionControl={false}
      >
       <Marker position={position}>
        <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
      </Marker>
        <ImageOverlay
          url={require("./MSC-MAP.png")}
          bounds={[[1273, 0],[0, 950]]}
        />
        <SetBoundsRectangles />
      </MapContainer>
    </div>
  )
}



ReactDOM.render(<Kartta />, document.getElementById('root'));
