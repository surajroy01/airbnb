


maptilersdk.config.apiKey = mapToken;
const map = new maptilersdk.Map({
    container: 'map', // container's id or the HTML element to render the map
    style: maptilersdk.MapStyle.STREETS,
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});


const marker = new maptilersdk.Marker({color:"#e91212"})
    .setPopup(new maptilersdk.Popup({offset:-1}).setHTML(
        `<h3>${listing.location}</h3><p>Exact location will be shared after booking</p>`
    ))
    .setLngLat(listing.geometry.coordinates)
    .addTo(map);

marker.togglePopup();