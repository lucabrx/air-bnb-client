import L from "leaflet"
import { MapContainer, Marker, TileLayer } from "react-leaflet"

import "leaflet/dist/leaflet.css"

import { useEffect, useRef } from "react"
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

interface MapProps {
  center?: number[]
}

// eslint-disable-next-line
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
})

const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

interface MapProps {
  center?: number[]
}

export default function Map({ center }: MapProps) {
  const mapRef = useRef<L.Map>(null)

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center as L.LatLngExpression, 4)
    }
  }, [center])

  return (
    <MapContainer
      ref={mapRef}
      center={center as L.LatLngExpression}
      zoom={center ? 4 : 2}
      scrollWheelZoom={false}
      className="z-0 h-[35vh] rounded-lg"
    >
      <TileLayer url={url} attribution={attribution} />
      {center && <Marker position={center as L.LatLngExpression} />}
    </MapContainer>
  )
}
