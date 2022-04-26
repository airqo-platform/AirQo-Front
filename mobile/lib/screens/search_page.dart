import 'package:app/constants/config.dart';
import 'package:app/models/measurement.dart';
import 'package:app/models/place_details.dart';
import 'package:app/models/suggestion.dart';
import 'package:app/utils/dialogs.dart';
import 'package:app/widgets/custom_widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

import '../services/app_service.dart';
import '../themes/light_theme.dart';
import 'insights_page.dart';

class SearchPage extends StatefulWidget {
  const SearchPage({Key? key}) : super(key: key);

  @override
  _SearchPageState createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  List<Measurement> _nearbySites = [];
  List<Measurement> _searchSites = [];
  List<Suggestion> _searchSuggestions = [];
  List<Measurement> _allSites = [];
  bool _isSearching = false;
  bool _emptyView = false;
  bool _hasNearbyLocations = true;

  final AppService _appService = AppService();
  final TextEditingController _textEditingController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        padding: const EdgeInsets.only(left: 16.0, right: 16.0, top: 40),
        color: Config.appBodyColor,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(
              height: 24,
            ),
            Row(
              children: <Widget>[
                Padding(
                  padding: const EdgeInsets.only(right: 16.0),
                  child: backButton(context),
                ),
                Expanded(
                  child: searchInputField(),
                )
              ],
            ),
            const SizedBox(
              height: 20,
            ),
            Visibility(
              visible: !_isSearching &&
                  _hasNearbyLocations &&
                  _nearbySites.isNotEmpty,
              child: Text(
                'Locations near you',
                textAlign: TextAlign.start,
                style: TextStyle(color: Config.inactiveColor, fontSize: 12),
              ),
            ),
            loadMainView(),
          ],
        ),
      ),
    );
  }

  Future<void> getSites() async {
    await _appService.dbHelper.getLatestMeasurements().then((value) => {
          if (mounted)
            {
              setState(() {
                _allSites = value;
              })
            }
        });
  }

  Future<void> getUserLocation() async {
    try {
      var location = await _appService.locationService.getLocation();
      if (location == null) {
        await showSnackBar(context, Config.locationErrorMessage);
        return;
      }
      var latitude = location.latitude;
      var longitude = location.longitude;
      if (longitude != null && latitude != null) {
        await _appService.locationService
            .getNearestSites(latitude, longitude)
            .then((value) => {
                  if (mounted)
                    {
                      if (value.isEmpty)
                        {
                          setState(() {
                            _nearbySites = [];
                            _hasNearbyLocations = false;
                          })
                        }
                      else
                        {
                          setState(() {
                            _nearbySites = value;
                            _hasNearbyLocations = true;
                          })
                        }
                    }
                });
      } else {
        throw Exception('Failed to get your location');
      }
    } catch (exception, stackTrace) {
      debugPrint('$exception\n$stackTrace');
      var error = exception.toString().replaceAll('Exception :', '');
      error = error.replaceAll('Exception', '');
      error = error.replaceAll(':', '');
      await showSnackBar(context, error);
    }
  }

  @override
  void initState() {
    super.initState();
    getSites();
    getUserLocation();
  }

  Widget loadMainView() {
    if (_emptyView) {
      return ListView(
        shrinkWrap: true,
        children: [
          const SizedBox(
            height: 80,
          ),
          Visibility(
            visible: false,
            child: Image.asset(
              'assets/icon/coming_soon.png',
              height: 80,
              width: 80,
            ),
          ),
          Center(
            child: Stack(
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
          ),
          const SizedBox(
            height: 16,
          ),
          const Padding(
              padding: EdgeInsets.only(left: 30, right: 30),
              child: Text(
                'Coming soon on the network',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              )),
          const SizedBox(
            height: 8,
          ),
          Padding(
              padding: const EdgeInsets.only(left: 20, right: 20),
              child: Text(
                'We currently do not support air quality '
                'monitoring in this area, but we’re working on it.',
                textAlign: TextAlign.center,
                style: TextStyle(
                    fontSize: 14, color: Colors.black.withOpacity(0.4)),
              )),
        ],
      );
    }

    if (_isSearching) {
      return Expanded(
        child: MediaQuery.removePadding(
            context: context,
            removeTop: true,
            child: ListView(
              shrinkWrap: true,
              children: [
                searchLocations(),
              ],
            )),
      );
    }

    if (_hasNearbyLocations) {
      return Expanded(
        child: MediaQuery.removePadding(
            context: context,
            removeTop: true,
            child: ListView(
              shrinkWrap: true,
              children: [
                if (_nearbySites.isEmpty) requestLocationAccess(),
                if (_nearbySites.isNotEmpty) nearByLocations(),
              ],
            )),
      );
    }

    return Expanded(
      child: ListView(
        shrinkWrap: true,
        children: [
          noNearbyLocations(),
        ],
      ),
    );
  }

  Widget nearByLocations() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(
          height: 8.0,
        ),
        Container(
            padding: const EdgeInsets.only(bottom: 8),
            decoration: BoxDecoration(
                color: Config.appBodyColor,
                shape: BoxShape.rectangle,
                borderRadius: const BorderRadius.all(Radius.circular(10.0))),
            child: MediaQuery.removePadding(
                context: context,
                removeTop: true,
                child: ListView.builder(
                  controller: ScrollController(),
                  shrinkWrap: true,
                  itemBuilder: (context, index) => GestureDetector(
                      onTap: () {
                        Navigator.push(context,
                            MaterialPageRoute(builder: (context) {
                          return InsightsPage(PlaceDetails.siteToPLace(
                              _nearbySites[index].site));
                        }));
                      },
                      child: Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: searchLocationTile(
                            measurement: _nearbySites[index], context: context),
                      )),
                  itemCount: _nearbySites.length,
                  // separatorBuilder: (BuildContext context, int index) {
                  //   return Divider(
                  //     indent: 20,
                  //     endIndent: 20,
                  //     color: Config.appColor,
                  //   );
                  // }
                ))),
      ],
    );
  }

  Widget noNearbyLocations() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.all(40.0),
          decoration: const BoxDecoration(
              color: Colors.white,
              shape: BoxShape.rectangle,
              borderRadius: BorderRadius.all(Radius.circular(10.0))),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(
                height: 84,
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
                'You don\'t have nearby air quality stations',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(
                height: 40,
              ),
            ],
          ),
        )
      ],
    );
  }

  Widget requestLocationAccess() {
    return Container(
      padding: const EdgeInsets.all(40.0),
      decoration: const BoxDecoration(
          color: Colors.white,
          shape: BoxShape.rectangle,
          borderRadius: BorderRadius.all(Radius.circular(16.0))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const SizedBox(
            height: 84,
          ),
          Stack(
            children: [
              Padding(
                padding: const EdgeInsets.only(left: 23),
                child: Image.asset(
                  'assets/images/world-map.png',
                  height: 119,
                  width: 119,
                ),
              ),
              Positioned(
                  left: 0,
                  top: 22,
                  child: Container(
                    height: 56,
                    width: 56,
                    decoration: BoxDecoration(
                      color: Config.appColorBlue,
                      shape: BoxShape.circle,
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(12.0),
                      child: SvgPicture.asset(
                        'assets/icon/location.svg',
                        color: Colors.white,
                        semanticsLabel: 'AirQo Map',
                        height: 29,
                        width: 25,
                      ),
                    ),
                  )),
            ],
          ),
          const SizedBox(
            height: 24,
          ),
          Text(
            'Enable locations',
            textAlign: TextAlign.start,
            style: CustomTextStyle.headline7(context),
          ),
          const SizedBox(
            height: 8,
          ),
          Text(
            'Allow AirQo to show you location air '
            'quality update near you.',
            textAlign: TextAlign.center,
            style: Theme.of(context)
                .textTheme
                .subtitle2
                ?.copyWith(color: Config.appColorBlack.withOpacity(0.4)),
          ),
          const SizedBox(
            height: 24,
          ),
          GestureDetector(
            onTap: () {
              _appService.locationService
                  .requestLocationAccess()
                  .then((value) => {getUserLocation()});
            },
            child: Container(
                decoration: BoxDecoration(
                    color: Config.appColorBlue,
                    borderRadius: const BorderRadius.all(Radius.circular(8.0))),
                child: const Padding(
                  padding: EdgeInsets.only(top: 12, bottom: 14),
                  child: Center(
                    child: Text(
                      'Allow location',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.normal,
                          fontSize: 14,
                          height: 22 / 14,
                          letterSpacing: 16 * -0.022),
                    ),
                  ),
                )),
          ),
          const SizedBox(
            height: 40,
          ),
        ],
      ),
    );
  }

  void searchChanged(String text) {
    if (text.isEmpty) {
      setState(() {
        _isSearching = false;
        _emptyView = false;
      });
    } else {
      setState(() {
        _isSearching = true;
        _emptyView = false;
      });

      _appService.searchApi.fetchSuggestions(text).then((value) => {
            if (mounted)
              {
                setState(() {
                  _searchSuggestions = value;
                })
              }
          });

      if (!mounted) {
        return;
      }

      setState(() {
        _searchSites =
            _appService.locationService.textSearchNearestSites(text, _allSites);
      });
    }
  }

  Widget searchInputField() {
    return Container(
      height: 40,
      constraints: const BoxConstraints(minWidth: double.maxFinite),
      decoration: const BoxDecoration(
          color: Colors.white,
          shape: BoxShape.rectangle,
          borderRadius: BorderRadius.all(Radius.circular(10.0))),
      child: TextFormField(
        controller: _textEditingController,
        onChanged: searchChanged,
        style: Theme.of(context).textTheme.caption?.copyWith(
              fontSize: 16,
            ),
        enableSuggestions: true,
        cursorWidth: 1,
        autofocus: true,
        cursorColor: Config.appColorBlack,
        decoration: InputDecoration(
          fillColor: Colors.white,
          prefixIcon: Padding(
            padding:
                const EdgeInsets.only(right: 7, top: 7, bottom: 7, left: 7),
            child: SvgPicture.asset(
              'assets/icon/search.svg',
              height: 14.38,
              width: 14.38,
              semanticsLabel: 'Search',
            ),
          ),
          contentPadding: const EdgeInsets.fromLTRB(10, 10, 10, 10),
          focusedBorder: OutlineInputBorder(
            borderSide: const BorderSide(color: Colors.transparent, width: 1.0),
            borderRadius: BorderRadius.circular(8.0),
          ),
          enabledBorder: OutlineInputBorder(
            borderSide: const BorderSide(color: Colors.transparent, width: 1.0),
            borderRadius: BorderRadius.circular(8.0),
          ),
          border: OutlineInputBorder(
              borderSide:
                  const BorderSide(color: Colors.transparent, width: 1.0),
              borderRadius: BorderRadius.circular(8.0)),
          hintText: 'Search locations',
          hintStyle: Theme.of(context).textTheme.caption?.copyWith(
                color: Config.appColorBlack.withOpacity(0.32),
                fontSize: 14,
                fontWeight: FontWeight.w400,
              ),
        ),
      ),
    );
  }

  Widget searchLocations() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Visibility(
            visible: _searchSites.isEmpty && _searchSuggestions.isEmpty,
            child: Center(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const SizedBox(
                    height: 84,
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
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
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
                    controller: ScrollController(),
                    shrinkWrap: true,
                    itemBuilder: (context, index) => GestureDetector(
                        onTap: () {
                          Navigator.push(context,
                              MaterialPageRoute(builder: (context) {
                            return InsightsPage(PlaceDetails.siteToPLace(
                                _searchSites[index].site));
                          }));
                        },
                        child: Padding(
                          padding: const EdgeInsets.only(bottom: 10),
                          child: searchLocationTile(
                              measurement: _searchSites[index],
                              context: context),
                        )),
                    itemCount: _searchSites.length,
                  )),
            )),
        Visibility(
            visible: _searchSuggestions.isNotEmpty,
            child: Center(
              child: MediaQuery.removePadding(
                  context: context,
                  removeTop: true,
                  child: ListView.builder(
                    controller: ScrollController(),
                    shrinkWrap: true,
                    itemBuilder: (context, index) => GestureDetector(
                        onTap: () {
                          showPlaceDetails(_searchSuggestions[index]);
                        },
                        child: Padding(
                          padding: const EdgeInsets.only(bottom: 10),
                          child: searchPlaceTile(
                              context: context,
                              searchSuggestion: _searchSuggestions[index]),
                        )),
                    itemCount: _searchSuggestions.length,
                  )),
            )),
        const SizedBox(
          height: 8,
        ),
      ],
    );
  }

  Future<void> showPlaceDetails(Suggestion suggestion) async {
    if (!mounted) {
      return;
    }
    setState(() {
      _textEditingController.text = suggestion.suggestionDetails.mainText;
    });
    var place = await _appService.searchApi.getPlaceDetails(suggestion.placeId);
    if (place != null) {
      var nearestSite = await _appService.locationService.getNearestSite(
          place.geometry.location.lat, place.geometry.location.lng);

      if (nearestSite == null) {
        setState(() {
          _emptyView = true;
        });
        return;
      }

      var placeDetails = PlaceDetails(
          name: suggestion.suggestionDetails.getMainText(),
          location: suggestion.suggestionDetails.getSecondaryText(),
          siteId: nearestSite.id,
          placeId: suggestion.placeId,
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng);

      await Navigator.push(context, MaterialPageRoute(builder: (context) {
        return InsightsPage(placeDetails);
      }));
    } else {
      await showSnackBar(context, 'Try again later');
    }
  }
}
