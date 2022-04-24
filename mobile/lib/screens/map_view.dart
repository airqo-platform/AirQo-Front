import 'dart:convert';
import 'dart:math';

import 'package:app/constants/config.dart';
import 'package:app/models/measurement.dart';
import 'package:app/models/place_details.dart';
import 'package:app/models/suggestion.dart';
import 'package:app/themes/dark_theme.dart';
import 'package:app/themes/light_theme.dart';
import 'package:app/utils/dialogs.dart';
import 'package:app/utils/extensions.dart';
import 'package:app/utils/pm.dart';
import 'package:app/widgets/analytics_card.dart';
import 'package:app/widgets/custom_widgets.dart';
import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:uuid/uuid.dart';

import '../models/enum_constants.dart';
import '../services/app_service.dart';

class MapView extends StatefulWidget {
  const MapView({Key? key}) : super(key: key);

  @override
  _MapViewState createState() => _MapViewState();
}

class _MapViewState extends State<MapView> {
  bool _showLocationDetails = false;
  double _scrollSheetHeight = 0.30;
  bool _isSearching = false;
  bool _displayRegions = true;
  List<Measurement> _regionSites = [];
  List<Measurement> _searchSites = [];
  List<Measurement> _latestMeasurements = [];
  final String sessionToken = const Uuid().v4();
  List<Suggestion> _searchSuggestions = [];
  Region _selectedRegion = Region.central;
  final TextEditingController _searchController = TextEditingController();
  PlaceDetails? _locationPlaceMeasurement;
  Measurement? _locationMeasurement;
  final _defaultCameraPosition =
      const CameraPosition(target: LatLng(1.6183002, 32.504365), zoom: 6.6);
  late GoogleMapController _mapController;
  Map<String, Marker> _markers = {};
  final AppService _appService = AppService();
  double bottomPadding = 0.15;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: <Widget>[
          Padding(
            padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).size.height * bottomPadding),
            child: mapWidget(),
          ),
          Visibility(
            visible: _showLocationDetails,
            child: DraggableScrollableSheet(
              initialChildSize: 0.5,
              minChildSize: 0.4,
              maxChildSize: 0.6,
              builder:
                  (BuildContext context, ScrollController scrollController) {
                return cardWidget(
                    SingleChildScrollView(
                        physics: const ScrollPhysics(),
                        padding: EdgeInsets.zero,
                        controller: scrollController,
                        child: locationContent()),
                    16.0);
              },
            ),
          ),
          Visibility(
            visible: !_showLocationDetails,
            child: DraggableScrollableSheet(
              initialChildSize: _scrollSheetHeight,
              minChildSize: 0.18,
              maxChildSize: 0.92,
              builder:
                  (BuildContext context, ScrollController scrollController) {
                return cardWidget(
                    SingleChildScrollView(
                      controller: scrollController,
                      physics: const BouncingScrollPhysics(),
                      child: defaultContent(),
                    ),
                    32);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget cardWidget(Widget child, double padding) {
    return Card(
      margin: EdgeInsets.zero,
      elevation: 12.0,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.only(
              topLeft: Radius.circular(16), topRight: Radius.circular(16))),
      child: Container(
        padding: EdgeInsets.fromLTRB(padding, 0, padding, 16.0),
        child: child,
      ),
    );
  }

  Widget closeDetails() {
    return Container(
      height: 30,
      width: 30,
      decoration: BoxDecoration(
          color: Config.appBodyColor, borderRadius: BorderRadius.circular(8)),
      child: const Icon(
        Icons.clear,
        size: 20,
      ),
    );
  }

  Widget defaultContent() {
    return Column(
      children: <Widget>[
        const SizedBox(height: 8),
        draggingHandle(),
        const SizedBox(height: 16),
        searchContainer(),
        Visibility(
          visible: _displayRegions && !_isSearching,
          child: regionsList(),
        ),
        Visibility(
          visible: !_displayRegions && !_isSearching,
          child: sitesList(),
        ),
        Visibility(
          visible: _isSearching,
          child: searchResultsList(),
        ),
      ],
    );
  }

  Widget draggingHandle() {
    return Container(
      height: 4,
      width: 32,
      decoration: BoxDecoration(
          color: Colors.grey[200], borderRadius: BorderRadius.circular(16)),
    );
  }

  Widget emptyView(String title, String bodyInnerText, bool topBars) {
    return Column(
      children: [
        Visibility(
            visible: topBars,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Container(
                    height: 32,
                    width: 32,
                    decoration: BoxDecoration(
                        color: Config.appBodyColor,
                        borderRadius:
                            const BorderRadius.all(Radius.circular(8.0))),
                    child: Center(
                      child: IconButton(
                        iconSize: 10,
                        icon: Icon(
                          Icons.clear,
                          color: Config.appBarTitleColor,
                        ),
                        onPressed: showRegions,
                      ),
                    ))
              ],
            )),
        const SizedBox(
          height: 80,
        ),
        Image.asset(
          'assets/icon/coming_soon.png',
          height: 80,
          width: 80,
        ),
        const SizedBox(
          height: 16,
        ),
        Padding(
            padding: const EdgeInsets.only(left: 30, right: 30),
            child: Text(
              '$title\nComing soon on the network'.trim(),
              textAlign: TextAlign.center,
              style: CustomTextStyle.headline7(context)
                  ?.copyWith(letterSpacing: 16 * -0.01),
            )),
        const SizedBox(
          height: 8,
        ),
        Padding(
            padding: const EdgeInsets.only(left: 20, right: 20),
            child: Text(
              'We currently do not support air quality '
              'monitoring in this $bodyInnerText, but we’re working on it.',
              textAlign: TextAlign.center,
              style: Theme.of(context)
                  .textTheme
                  .bodyText2
                  ?.copyWith(color: Config.appColorBlack.withOpacity(0.4)),
            )),
        const SizedBox(
          height: 158,
        ),
      ],
    );
  }

  LatLngBounds getBounds(List<Marker> markers) {
    var latitudes =
        markers.map<double>((marker) => marker.position.latitude).toList();
    var longitudes =
        markers.map<double>((marker) => marker.position.longitude).toList();

    var topMostMarker = longitudes.reduce(max);
    var rightMostMarker = latitudes.reduce(max);
    var leftMostMarker = latitudes.reduce(min);
    var bottomMostMarker = longitudes.reduce(min);

    var bounds = LatLngBounds(
      northeast: LatLng(rightMostMarker, topMostMarker),
      southwest: LatLng(leftMostMarker, bottomMostMarker),
    );

    return bounds;
  }

  Widget getLocationDisplay() {
    if (_locationMeasurement != null && _locationPlaceMeasurement != null) {
      return MapAnalyticsCard(
          _locationPlaceMeasurement!, _locationMeasurement!, showLocation);
    }

    return emptyView('', 'area', true);
  }

  Widget locationContent() {
    return Column(
      children: [
        const SizedBox(height: 8),
        Padding(
          padding: const EdgeInsets.only(left: 10, right: 10),
          child: draggingHandle(),
        ),
        const SizedBox(height: 16),
        MediaQuery.removePadding(
            context: context,
            removeTop: true,
            removeLeft: true,
            removeRight: true,
            child: ListView(
              shrinkWrap: true,
              physics: const ScrollPhysics(),
              controller: ScrollController(),
              children: <Widget>[
                getLocationDisplay(),
              ],
            )),
      ],
    );
  }

  Widget mapWidget() {
    return GoogleMap(
      compassEnabled: false,
      onMapCreated: _onMapCreated,
      mapType: MapType.normal,
      myLocationButtonEnabled: false,
      myLocationEnabled: false,
      rotateGesturesEnabled: false,
      tiltGesturesEnabled: false,
      mapToolbarEnabled: false,
      zoomControlsEnabled: true,
      initialCameraPosition: _defaultCameraPosition,
      markers: _markers.values.toSet(),
      onTap: (_) {
        // showRegions();
        // setState(() {
        //   _showInfoWindow = false;
        //   _isSearching = false;
        // });
      },
    );
  }

  Widget regionAvatar() {
    return Container(
        height: 40,
        width: 40,
        decoration: BoxDecoration(
            color: Config.appColorBlue.withOpacity(0.15),
            shape: BoxShape.circle),
        child: Center(
          child: SvgPicture.asset('assets/icon/location.svg',
              color: Config.appColorBlue),
        ));
  }

  Widget regionsList() {
    return MediaQuery.removePadding(
        removeTop: true,
        context: context,
        child: ListView(
          shrinkWrap: true,
          physics: const BouncingScrollPhysics(),
          children: <Widget>[
            const SizedBox(
              height: 5,
            ),
            regionTile(Region.central),
            regionTile(Region.western),
            regionTile(Region.eastern),
            regionTile(Region.northern),
          ],
        ));
  }

  ListTile regionTile(Region region) {
    return ListTile(
      contentPadding: const EdgeInsets.only(left: 0.0),
      leading: regionAvatar(),
      onTap: () {
        showRegionSites(region);
      },
      title: AutoSizeText(
        region.getName(),
        maxLines: 2,
        overflow: TextOverflow.ellipsis,
        style: CustomTextStyle.headline8(context),
      ),
      subtitle: AutoSizeText(
        'Uganda',
        style: CustomTextStyle.bodyText4(context)
            ?.copyWith(color: Config.appColorBlack.withOpacity(0.3)),
      ),
      trailing: SvgPicture.asset(
        'assets/icon/more_arrow.svg',
        semanticsLabel: 'more',
        height: 6.99,
        width: 4,
      ),
    );
  }

  void searchChanged(String text) {
    if (text.isEmpty) {
      setState(() {
        _isSearching = false;
      });
    } else {
      setState(() {
        _isSearching = true;
        _searchSites = _appService.locationService
            .textSearchNearestSites(text, _latestMeasurements);
      });

      _appService.searchApi.fetchSuggestions(text).then((value) => {
            setState(() {
              _searchSuggestions = value;
            })
          });

      setState(() {
        _searchSites = _appService.locationService
            .textSearchNearestSites(text, _latestMeasurements);
      });
    }
  }

  Widget searchContainer() {
    return Row(
      children: [
        Expanded(
          child: Container(
            height: 32,
            constraints: const BoxConstraints(minWidth: double.maxFinite),
            decoration: BoxDecoration(
                color: Config.appBodyColor,
                shape: BoxShape.rectangle,
                borderRadius: const BorderRadius.all(Radius.circular(8.0))),
            child: TextFormField(
              controller: _searchController,
              onChanged: searchChanged,
              onTap: () {
                setState(() {
                  _scrollSheetHeight = 0.7;
                });
              },
              style: Theme.of(context).textTheme.caption?.copyWith(
                    fontSize: 16,
                  ),
              enableSuggestions: true,
              cursorWidth: 1,
              autofocus: false,
              cursorColor: Config.appColorBlack,
              decoration: InputDecoration(
                fillColor: Colors.white,
                prefixIcon: Padding(
                  padding: const EdgeInsets.only(
                      right: 0, top: 7, bottom: 7, left: 0),
                  child: SvgPicture.asset(
                    'assets/icon/search.svg',
                    semanticsLabel: 'Search',
                  ),
                ),
                contentPadding: const EdgeInsets.fromLTRB(0, 0, 0, 0),
                focusedBorder: OutlineInputBorder(
                  borderSide:
                      const BorderSide(color: Colors.transparent, width: 1.0),
                  borderRadius: BorderRadius.circular(8.0),
                ),
                enabledBorder: OutlineInputBorder(
                  borderSide:
                      const BorderSide(color: Colors.transparent, width: 1.0),
                  borderRadius: BorderRadius.circular(8.0),
                ),
                border: OutlineInputBorder(
                    borderSide:
                        const BorderSide(color: Colors.transparent, width: 1.0),
                    borderRadius: BorderRadius.circular(8.0)),
                hintStyle: Theme.of(context).textTheme.caption?.copyWith(
                      color: Config.appColorBlack.withOpacity(0.32),
                      fontSize: 14,
                      fontWeight: FontWeight.w400,
                    ),
              ),
            ),
          ),
        ),
        Visibility(
            visible: !_displayRegions,
            child: const SizedBox(
              width: 8.0,
            )),
        Visibility(
            visible: !_displayRegions,
            child: GestureDetector(
              onTap: showRegions,
              child: Container(
                height: 32,
                width: 32,
                decoration: BoxDecoration(
                    color: Config.appBodyColor,
                    borderRadius: const BorderRadius.all(Radius.circular(8.0))),
                child: SvgPicture.asset(
                  'assets/icon/map_clear_text.svg',
                  height: 15,
                  width: 15,
                ),
              ),
            )),
      ],
    );
  }

  Widget searchField() {
    return Expanded(
        child: Center(
      child: TextFormField(
        controller: _searchController,
        onTap: () {
          setState(() {
            _scrollSheetHeight = 0.7;
          });
        },
        onChanged: searchChanged,
        cursorWidth: 1,
        maxLines: 1,
        cursorColor: Config.appColorBlue,
        autofocus: false,
        decoration: const InputDecoration(
          contentPadding: EdgeInsets.only(right: 8, left: 8, bottom: 15),
          hintText: '',
          focusedBorder: InputBorder.none,
          enabledBorder: InputBorder.none,
        ),
      ),
    ));
  }

  Widget searchResultsList() {
    return MediaQuery.removePadding(
        removeTop: true,
        context: context,
        child: ListView(
          shrinkWrap: true,
          physics: const BouncingScrollPhysics(),
          children: [
            Visibility(
                visible: _searchSites.isEmpty && _searchSuggestions.isEmpty,
                child: Center(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const SizedBox(
                        height: 10,
                      ),
                      Stack(
                        children: [
                          Image.asset(
                            'assets/images/world-map.png',
                            height: 130,
                            width: 130,
                          ),
                          Container(
                            decoration: BoxDecoration(
                              color: Config.appColorBlue,
                              shape: BoxShape.circle,
                            ),
                            child: const Padding(
                              padding: EdgeInsets.all(12.0),
                              child: Icon(
                                Icons.map_outlined,
                                size: 30,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(
                        height: 52,
                      ),
                      const Text(
                        'Not found',
                        textAlign: TextAlign.start,
                        style: TextStyle(
                            fontSize: 20, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(
                        height: 52,
                      ),
                    ],
                  ),
                )),
            Visibility(
                visible: _searchSites.isNotEmpty && _searchSuggestions.isEmpty,
                child: Center(
                  child: MediaQuery.removePadding(
                      context: context,
                      removeTop: true,
                      child: ListView.builder(
                        physics: const BouncingScrollPhysics(),
                        shrinkWrap: true,
                        itemBuilder: (context, index) =>
                            siteTile(_searchSites[index]),
                        itemCount: _searchSites.length,
                      )),
                )),
            Visibility(
                visible: _searchSuggestions.isNotEmpty,
                child: Center(
                  child: MediaQuery.removePadding(
                      context: context,
                      removeTop: true,
                      removeLeft: true,
                      child: ListView.builder(
                        physics: const BouncingScrollPhysics(),
                        shrinkWrap: true,
                        itemBuilder: (context, index) =>
                            searchTile(_searchSuggestions[index]),
                        itemCount: _searchSuggestions.length,
                      )),
                )),
            const SizedBox(
              height: 8,
            ),
          ],
        ));
  }

  ListTile searchTile(Suggestion suggestion) {
    return ListTile(
      contentPadding: const EdgeInsets.only(left: 0.0),
      leading: regionAvatar(),
      onTap: () {
        showSuggestionReadings(suggestion);
      },
      title: AutoSizeText(
        suggestion.suggestionDetails.mainText.trimEllipsis(),
        maxLines: 1,
        minFontSize: 16.0,
        overflow: TextOverflow.ellipsis,
        style: CustomTextStyle.headline8(context),
      ),
      subtitle: AutoSizeText(
          suggestion.suggestionDetails.secondaryText.trimEllipsis(),
          maxLines: 1,
          minFontSize: 14.0,
          overflow: TextOverflow.ellipsis,
          style: CustomTextStyle.bodyText4(context)
              ?.copyWith(color: Config.appColorBlack.withOpacity(0.3))),
      trailing: SvgPicture.asset(
        'assets/icon/more_arrow.svg',
        semanticsLabel: 'more',
        height: 6.99,
        width: 4,
      ),
    );
  }

  Future<void> setMarkers(
      List<Measurement> measurements, bool useSingleZoom, double zoom) async {
    if (!mounted) {
      return;
    }

    if (measurements.isEmpty) {
      final controller = _mapController;

      await controller.animateCamera(
          CameraUpdate.newCameraPosition(_defaultCameraPosition));

      setState(() {
        _markers.clear();
        _markers = {};
      });

      return;
    }
    var markers = <String, Marker>{};

    for (var measurement in measurements) {
      BitmapDescriptor bitmapDescriptor;

      if (useSingleZoom) {
        bitmapDescriptor = await pmToMarker(measurement.getPm2_5Value());
      } else {
        bitmapDescriptor = await pmToSmallMarker(measurement.getPm2_5Value());
      }

      var marker = Marker(
        markerId: MarkerId(measurement.site.id),
        icon: bitmapDescriptor,
        position:
            LatLng((measurement.site.latitude), measurement.site.longitude),
        // infoWindow: InfoWindow(
        //   title: measurement.getPm2_5Value().toStringAsFixed(2),
        //   snippet: node.location,
        // ),
        onTap: () {
          if (!mounted) {
            return;
          }
          setState(() {
            _searchController.text = measurement.site.name;
          });
          showLocationContent(measurement, null);
        },
      );
      markers[measurement.site.id] = marker;
    }

    if (mounted) {
      final controller = _mapController;

      if (useSingleZoom) {
        if (markers.length == 1) {}

        var latLng = LatLng(measurements.first.site.latitude,
            measurements.first.site.longitude);

        var _cameraPosition = CameraPosition(target: latLng, zoom: zoom);

        await controller
            .animateCamera(CameraUpdate.newCameraPosition(_cameraPosition));
      } else {
        if (_displayRegions) {
          await controller.animateCamera(
              CameraUpdate.newCameraPosition(_defaultCameraPosition));
        } else {
          await controller.animateCamera(CameraUpdate.newLatLngBounds(
              getBounds(markers.values.toList()), 40.0));
        }
      }

      setState(() {
        _markers = markers;
      });
    }
  }

  void showLocation() {
    if (!mounted) {
      return;
    }
    setState(() {
      _showLocationDetails = !_showLocationDetails;
    });

    if (!_showLocationDetails) {
      showRegions();
    }

    if (_showLocationDetails) {
      setState(() {
        bottomPadding = 0.5;
      });
    }
  }

  void showLocationContent(
      Measurement? measurement, PlaceDetails? placeDetails) {
    if (!mounted) {
      return;
    }

    if (placeDetails != null) {
      var places = _latestMeasurements
          .where((measurement) => measurement.site.id == placeDetails.siteId)
          .toList();
      if (places.isEmpty) {
        return;
      }

      var place = places.first;

      setMarkers([place], true, 14);
      setState(() {
        _locationPlaceMeasurement = placeDetails;
        _locationMeasurement = place;
        _showLocationDetails = true;
      });
    } else if (measurement != null) {
      setMarkers([measurement], true, 14);
      setState(() {
        _locationPlaceMeasurement =
            PlaceDetails.measurementToPLace(measurement);
        _locationMeasurement = measurement;
        _showLocationDetails = true;
      });
    } else {
      setState(() {
        _locationMeasurement = null;
        _locationPlaceMeasurement = null;
        _showLocationDetails = true;
      });
    }
  }

  void showRegions() {
    if (!mounted) {
      return;
    }

    setState(() {
      _searchController.text = '';
      _isSearching = false;
      _searchSites = [];
      _regionSites = [];
      _showLocationDetails = false;
      _displayRegions = true;
    });
    if (_latestMeasurements.isEmpty) {
      _getLatestMeasurements()
          .then((value) => {setMarkers(_latestMeasurements, false, 6.6)});
    } else {
      setMarkers(_latestMeasurements, false, 6.6);
    }
  }

  Future<void> showRegionSites(Region region) async {
    if (!mounted) {
      return;
    }

    setState(() {
      _selectedRegion = region;
    });
    var sites = await _appService.dbHelper.getRegionSites(region);
    setState(() {
      _showLocationDetails = false;
      _displayRegions = false;
      _regionSites = sites;
    });
    await setMarkers(sites, false, 10);
  }

  Future<void> showSuggestionReadings(Suggestion suggestion) async {
    if (!mounted) {
      return;
    }

    setState(() {
      _searchController.text = suggestion.suggestionDetails.mainText;
    });
    var place = await _appService.searchApi.getPlaceDetails(suggestion.placeId);
    if (place != null) {
      var nearestSite = await _appService.locationService.getNearestSite(
          place.geometry.location.lat, place.geometry.location.lng);

      if (nearestSite == null) {
        showLocationContent(null, null);
        return;
      }

      var placeDetails = PlaceDetails(
          name: suggestion.suggestionDetails.getMainText(),
          location: suggestion.suggestionDetails.getSecondaryText(),
          siteId: nearestSite.id,
          placeId: suggestion.placeId,
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng);

      showLocationContent(null, placeDetails);
    } else {
      await showSnackBar(context, 'Try again later');
    }
  }

  Widget sitesList() {
    return MediaQuery.removePadding(
        removeTop: true,
        context: context,
        child: ListView(
          shrinkWrap: true,
          physics: const BouncingScrollPhysics(),
          children: [
            const SizedBox(
              height: 10,
            ),
            Visibility(
              visible: _regionSites.isNotEmpty,
              child: Text(
                _selectedRegion.getName(),
                style: CustomTextStyle.overline1(context)
                    ?.copyWith(color: Config.appColorBlack.withOpacity(0.32)),
              ),
            ),
            Visibility(
                visible: _regionSites.isNotEmpty,
                child: MediaQuery.removePadding(
                    context: context,
                    removeTop: true,
                    child: ListView.builder(
                      shrinkWrap: true,
                      controller: ScrollController(),
                      itemBuilder: (context, index) =>
                          siteTile(_regionSites[index]),
                      itemCount: _regionSites.length,
                    ))),
            Visibility(
                visible: _regionSites.isEmpty,
                child: emptyView(_selectedRegion.getName(), 'region', false)),
          ],
        ));
  }

  Widget siteTile(Measurement measurement) {
    return ListTile(
      contentPadding: const EdgeInsets.only(left: 0.0),
      onTap: () {
        if (!mounted) {
          return;
        }
        setState(() {
          _searchController.text = measurement.site.name;
        });
        showLocationContent(measurement, null);
      },
      title: AutoSizeText(
        measurement.site.name.trimEllipsis(),
        maxLines: 1,
        minFontSize: 16.0,
        overflow: TextOverflow.ellipsis,
        style: CustomTextStyle.headline8(context),
      ),
      subtitle: AutoSizeText(measurement.site.location.trimEllipsis(),
          maxLines: 1,
          minFontSize: 14.0,
          style: CustomTextStyle.bodyText4(context)
              ?.copyWith(color: Config.appColorBlack.withOpacity(0.4))),
      trailing: SvgPicture.asset(
        'assets/icon/more_arrow.svg',
        semanticsLabel: 'more',
        height: 6.99,
        width: 4,
      ),
      leading: miniAnalyticsAvatar(measurement: measurement),
    );
  }

  Future<void> _getLatestMeasurements() async {
    var dbMeasurements = await _appService.dbHelper.getLatestMeasurements();

    if (dbMeasurements.isNotEmpty && mounted) {
      setState(() {
        _latestMeasurements = dbMeasurements;
      });
      await setMarkers(dbMeasurements, false, 6.6);
    }

    var measurements = await _appService.apiClient.fetchLatestMeasurements();

    if (measurements.isNotEmpty && mounted) {
      setState(() {
        _latestMeasurements = measurements;
      });
      await setMarkers(measurements, false, 6.6);
    }

    await _appService.dbHelper.insertLatestMeasurements(measurements);
  }

  Future<void> _loadTheme() async {
    var prefs = await SharedPreferences.getInstance();
    var theme = prefs.getString(Config.prefAppTheme) ?? 'light';

    switch (theme) {
      case 'light':
        await _mapController.setMapStyle(jsonEncode(googleMapsLightTheme));
        break;
      case 'dark':
        await _mapController.setMapStyle(jsonEncode(googleMapsDarkTheme));
        break;
      default:
        await _mapController.setMapStyle(jsonEncode(googleMapsLightTheme));
        break;
    }
  }

  Future<void> _onMapCreated(GoogleMapController controller) async {
    if (!mounted) {
      return;
    }

    setState(() {
      _mapController = controller;
    });

    await _loadTheme();
    await _getLatestMeasurements();
  }
}
