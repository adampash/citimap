(function() {
  $(function() {
    window.dev = true;
    window.log = function(args) {
      if (dev) {
        return console.log.apply(console, arguments);
      }
    };
    if (dev) {
      return $('body').append($('<script src="//localhost:35729/livereload.js"></script>'));
    }
  });

  window.citi = {
    initialize: function() {
      var version;
      this.stationData = [];
      version = 0;
      return setInterval((function(_this) {
        return function() {
          _this.stationData = [];
          return _this.getData(version, function() {
            _this.setData();
            if (version === 0) {
              return version = 1;
            } else {
              return version = 0;
            }
          });
        };
      })(this), 500);
    },
    getData: function(version, callback) {
      log(version);
      return $.getJSON('/data/' + version + '.json', (function(_this) {
        return function(data) {
          var bikeData;
          bikeData = data;
          return bikeData.stationBeanList.forEach(function(station) {
            var loc, weightedLoc;
            loc = new google.maps.LatLng(station.latitude, station.longitude);
            weightedLoc = {
              location: loc,
              weight: station.availableBikes
            };
            return _this.stationData.push(weightedLoc);
          });
        };
      })(this)).done((function(_this) {
        return function() {
          return callback();
        };
      })(this));
    },
    setData: function() {
      var mapOptions, pointArray;
      mapOptions = {
        zoom: 13,
        center: new google.maps.LatLng(40.75849116, -73.95920622),
        mapTypeId: google.maps.MapTypeId.MAP
      };
      if (this.map == null) {
        this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      } else {
        this.heatmap.setMap(null);
      }
      pointArray = new google.maps.MVCArray(this.stationData);
      this.heatmap = new google.maps.visualization.HeatmapLayer({
        data: pointArray,
        radius: 20
      });
      return this.heatmap.setMap(this.map);
    },
    toggleHeatmap: function() {
      var _ref;
      return this.heatmap.setMap((_ref = this.heatmap.getMap()) != null ? _ref : {
        "null": map
      });
    },
    changeGradient: function() {
      debugger;
      var gradient, _ref;
      gradient = ['rgba(0, 255, 255, 0)', 'rgba(0, 255, 255, 1)', 'rgba(0, 191, 255, 1)', 'rgba(0, 127, 255, 1)', 'rgba(0, 63, 255, 1)', 'rgba(0, 0, 255, 1)', 'rgba(0, 0, 223, 1)', 'rgba(0, 0, 191, 1)', 'rgba(0, 0, 159, 1)', 'rgba(0, 0, 127, 1)', 'rgba(63, 0, 91, 1)', 'rgba(127, 0, 63, 1)', 'rgba(191, 0, 31, 1)', 'rgba(255, 0, 0, 1)'];
      return this.heatmap.setOptions({
        gradient: (_ref = this.heatmap.get('gradient')) != null ? _ref : {
          "null": gradient
        }
      });
    },
    changeRadius: function() {
      var _ref;
      return this.heatmap.setOptions({
        radius: (_ref = this.heatmap.get('radius')) != null ? _ref : {
          "null": 20
        }
      });
    },
    changeOpacity: function() {
      var _ref;
      return this.heatmap.setOptions({
        opacity: (_ref = this.heatmap.get('opacity')) != null ? _ref : {
          "null": 0.2
        }
      });
    }
  };

  google.maps.event.addDomListener(window, 'load', function() {
    return citi.initialize();
  });

}).call(this);

//# sourceMappingURL=app.js.map
