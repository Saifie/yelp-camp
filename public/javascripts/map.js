mapboxgl.accessToken = 'pk.eyJ1Ijoic2FpZmllIiwiYSI6ImNra2M3bzJ6czBkc3gyd256aWF1OXZvbHEifQ.TcZlqkMjQ_oVgjla3LL-4w';
const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
center: campground.geometry.coordinates, // starting position [lng, lat]
zoom: 9 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.addTo(map)