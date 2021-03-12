import React, {useState, useMemo, useEffect} from 'react'
import ReactDOM from 'react-dom'
import { io } from "socket.io-client"

import L from 'leaflet'
import { ImageOverlay, MapContainer, Marker, Popup, Rectangle, useMap } from 'react-leaflet'
// import "leaflet/dist/leaflet.css";
// import 'leaflet/dist/leaflet.css';
import icon from './dot.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const innerBounds = [
  [49.505, -2.09],
  [53.505, 2.09],
]
const outerBounds = [
  [50.505, -29.09],
  [52.505, 29.09],
]

const bounds = [[0, 0],[500, 500]];

function Kartta () {
  const [socket, setSocket] = useState({})
  const [markers, setMarkers] = useState([])

  useEffect(() => {
    const sock = io('http://localhost:3000');
    setSocket(sock)

    sock.on('newCoordinates', data => {
      const { x, z, name, color, id } = data
      const markersClone = [...markers]
      const filter = markersClone.filter(mark => mark.id == id)
      markersClone.push(data)
      console.log(markersClone, filter)
      setMarkers(markersClone)
    })
  }, [])

  let DefaultIcon = L.icon({
    iconUrl: icon,
    iconSize: [15, 15]
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  return (
    <div>
       {/* <img
          src={require("./MSC-MAP.png")}
        /> */}
     <MapContainer
        bounds={bounds}
        // scrollWheelZoom={false}
        onzoomstart={(e) => console.log(e)}
        attributionControl={false}
      >
      {markers.map(mark => {
        console.log(mark)
        let position = {lng: (mark.x / 22.5) + 81, lat: (mark.z / 75) + 64}
        console.log(position)
        return (
          <Marker key={mark.id} position={position}>
            <Popup>{mark.name}<br />{mark.id}</Popup>
          </Marker>
        )
      })}
       <Marker position={[0, 0]}>
            <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
          </Marker>
      <Marker position={[-9000,2000]}>
            <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
          </Marker>
        <ImageOverlay
          url={require("./MSC-MAP.png")}
          bounds={[[0, 0], [150, 225]]}
        />
      </MapContainer>
    </div>
  )
}



ReactDOM.render(<Kartta />, document.getElementById('root'));
