import React, { useEffect, useState } from "react"
import { MapContainer, Marker, TileLayer } from "react-leaflet"

import "leaflet/dist/leaflet.css"

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

interface MapProps {
  center?: number[]
}

const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

const Map: React.FC<MapProps> = ({ center }) => {
  const [hydrated, setHydrated] = useState(false)
  //eslint-disable-next-line
  const L = require("leaflet")
  //eslint-disable-next-line
  delete L.Icon.Default.prototype._getIconUrl
  //eslint-disable-next-line
  L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src,
    iconRetinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
  })

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!hydrated) {
    return null
  }

  return (
    <MapContainer
      center={(center as L.LatLngExpression) || [51, -0.09]}
      zoom={center ? 4 : 2}
      scrollWheelZoom={false}
      className="z-0 h-[35vh] rounded-lg"
    >
      <TileLayer url={url} attribution={attribution} />
      {center && <Marker position={center as L.LatLngExpression} />}
    </MapContainer>
  )
}

export default Map
