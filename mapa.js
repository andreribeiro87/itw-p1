$("document").ready(function () {
    console.log("window.innerHeight=", window.innerHeight);
    $("#mapid").css("height", window.innerHeight - 84);
    $(window).resize(function () {
    $("#mapid").css("height", window.innerHeight - 84);
    });
    let mapOptions = {
        center:[51.958, 9.141],
        zoom:10
    }
    var mymap = L.map('mapid').setView([36.75, -17], 6);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=(token)', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
    'Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
    }).addTo(mymap);
    //#region 
    L.marker([39.458190000, -31.130100000], { opacity: 0.80 })
    .bindTooltip('Flores (Aer&#xF3;dromo)').openTooltip()
    //#region 
    L.marker([48.8534100, 2.3488000], { opacity: 0.80 })
    .bindTooltip('Paris 2022 (Aer&#xF3;dromo)').openTooltip()
    .addTo(mymap);
    //.... lista de todas as estações
    L.marker([38.723900000, -9.164900000], { opacity: 0.80 })
    .bindTooltip('Lisboa, Amoreiras (LFCL)').openTooltip()
    .addTo(mymap);
    });
    //# endregion
