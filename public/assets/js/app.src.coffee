$ ->
  window.dev = true
  window.log = (args) ->
    if dev
      console.log.apply console,  arguments

  if dev
    $('body').append $('<script src="//localhost:35729/livereload.js"></script>')

window.citi =
  initialize: ->
    @stationData = []
    version = 0
    setInterval =>
      @stationData = []
      @getData version, =>
        @setData()
        if version is 0 then version = 1 else version = 0
    , 500

  getData: (version, callback) ->
    log version
    $.getJSON('/data/' + version + '.json', (data) =>
      bikeData = data
      bikeData.stationBeanList.forEach((station) =>
        loc = new google.maps.LatLng(station.latitude, station.longitude)
        weightedLoc =
          location: loc
          weight: station.availableBikes
        @stationData.push(weightedLoc)
      )
    ).done =>
      callback()

  setData: ->
    mapOptions =
      zoom: 13
      center: new google.maps.LatLng(40.75849116, -73.95920622)
      mapTypeId: google.maps.MapTypeId.MAP

    unless @map?
      @map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions)
    else
      @heatmap.setMap(null)

    pointArray = new google.maps.MVCArray(@stationData)

    @heatmap = new google.maps.visualization.HeatmapLayer(
      data: pointArray
      radius: 20
    )

    @heatmap.setMap(@map)

  toggleHeatmap: ->
    @heatmap.setMap(@heatmap.getMap() ? null : map)

  changeGradient: ->
    debugger
    gradient = [
      'rgba(0, 255, 255, 0)',
      'rgba(0, 255, 255, 1)',
      'rgba(0, 191, 255, 1)',
      'rgba(0, 127, 255, 1)',
      'rgba(0, 63, 255, 1)',
      'rgba(0, 0, 255, 1)',
      'rgba(0, 0, 223, 1)',
      'rgba(0, 0, 191, 1)',
      'rgba(0, 0, 159, 1)',
      'rgba(0, 0, 127, 1)',
      'rgba(63, 0, 91, 1)',
      'rgba(127, 0, 63, 1)',
      'rgba(191, 0, 31, 1)',
      'rgba(255, 0, 0, 1)'
    ]
    @heatmap.setOptions(
      gradient: @heatmap.get('gradient') ? null : gradient
    )

  changeRadius: ->
    @heatmap.setOptions(
      radius: @heatmap.get('radius') ? null : 20
    )

  changeOpacity: ->
    @heatmap.setOptions(
      opacity: @heatmap.get('opacity') ? null : 0.2
    )

google.maps.event.addDomListener(window, 'load', ->
  citi.initialize())
