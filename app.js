var app = angular.module('myApp', ['google-maps',"firebase"]);

app.controller('MainCtrl',['$scope','$firebaseArray', function($scope,$firebaseArray ) {
    $scope.map = {
        control: {},
        center: {
            latitude: -37.812150,
            longitude: 144.971008
        },
        zoom: 14
    };
    $scope.marker = {
        center: {
            latitude: -37.812150,
            longitude: 144.971008
        }
    };
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    var geocoder = new google.maps.Geocoder();

    console.log("$scope.directions",$scope.origin);
    console.log("$scope.destination",$scope.destination);
    $scope.location=[];

$scope.showList=false;
    $scope.getDirections = function () {
        console.log("$scope.directions",$scope.origin);
        console.log("$scope.destination",$scope.destination);
        $scope.showList =true;
        var request = {
            origin: $scope.origin,
            destination: $scope.destination,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        directionsService.route(request, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                directionsDisplay.setMap($scope.map.control.getGMap());
                directionsDisplay.setPanel(document.getElementById('directionsList'));
            } else {
                alert('Google route unsuccesfull!');
            }
        });
    };
    var ref= firebase.database().ref().child('locations');

    $scope.locations = $firebaseArray(ref);
    $scope.addItem=function ()
    {
        var values = {};
        values.origin = $scope.origin;
        values.destination =  $scope.destination;
       $scope.locations.$add(values).then (function (data) {
                console.log("data",data);
    }),function (err) {
           console.log("err",err);
       }
    };

    $scope.$on('gmPlacesAutocomplete::placeChanged', function(){
        var location = $scope.origin.getPlace().geometry.location;
        $scope.lat = location.lat();
        $scope.lng = location.lng();
        $scope.$apply();
    });
}]);