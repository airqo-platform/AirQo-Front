import 'package:app/constants/config.dart';
import 'package:app/models/measurement.dart';
import 'package:app/models/place_details.dart';
import 'package:app/screens/insights_page.dart';
import 'package:app/services/app_service.dart';
import 'package:app/widgets/custom_shimmer.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:lottie/lottie.dart';
import 'package:provider/provider.dart';

import 'custom_widgets.dart';

class MiniAnalyticsCard extends StatefulWidget {
  final PlaceDetails placeDetails;

  const MiniAnalyticsCard(this.placeDetails, {Key? key}) : super(key: key);

  @override
  _MiniAnalyticsCard createState() => _MiniAnalyticsCard();
}

class _MiniAnalyticsCard extends State<MiniAnalyticsCard> {
  Measurement? measurement;
  bool showHeartAnimation = false;

  late AppService _appService;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(context, MaterialPageRoute(builder: (context) {
          return InsightsPage(widget.placeDetails);
        }));
      },
      child: Padding(
        padding: const EdgeInsets.fromLTRB(0.0, 8.0, 0.0, 8.0),
        child: Container(
            decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: const BorderRadius.all(Radius.circular(16.0)),
                border: Border.all(color: Colors.transparent)),
            child: Column(
              children: [
                const SizedBox(
                  height: 12,
                ),
                Container(
                  padding: const EdgeInsets.only(left: 32, right: 32),
                  child: Row(
                    children: [
                      if (measurement != null)
                        analyticsAvatar(measurement!, 40, 15, 5),
                      if (measurement == null) circularLoadingAnimation(40),
                      const SizedBox(
                        width: 12,
                      ),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.start,
                          children: [
                            Text(
                              widget.placeDetails.getName(),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                  fontWeight: FontWeight.bold, fontSize: 16),
                            ),
                            Text(
                              widget.placeDetails.getLocation(),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.black.withOpacity(0.3)),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(
                        width: 12,
                      ),
                      Consumer<PlaceDetailsModel>(
                        builder: (context, placeDetailsModel, child) {
                          return GestureDetector(
                              onTap: () async {
                                updateFavPlace();
                              },
                              child: getHeartIcon());
                        },
                      )
                    ],
                  ),
                ),
                const SizedBox(
                  height: 12,
                ),
                const Divider(color: Color(0xffC4C4C4)),
                const SizedBox(
                  height: 12,
                ),
                Container(
                  padding: const EdgeInsets.only(left: 32, right: 32),
                  child: Row(
                    children: [
                      Container(
                        height: 16,
                        width: 16,
                        decoration: BoxDecoration(
                            color: Config.appColorBlue,
                            borderRadius:
                                const BorderRadius.all(Radius.circular(3.0)),
                            border: Border.all(color: Colors.transparent)),
                        child: const Icon(
                          Icons.bar_chart,
                          size: 14,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(width: 8.0),
                      Text(
                        'View More Insights',
                        style:
                            TextStyle(fontSize: 12, color: Config.appColorBlue),
                      ),
                      const Spacer(),
                      Container(
                        height: 16,
                        width: 16,
                        decoration: BoxDecoration(
                            color: Config.appColorPaleBlue,
                            borderRadius:
                                const BorderRadius.all(Radius.circular(3.0)),
                            border: Border.all(color: Colors.transparent)),
                        child: Icon(
                          Icons.arrow_forward_ios,
                          size: 12,
                          color: Config.appColorBlue,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(
                  height: 12,
                ),
              ],
            )),
      ),
    );
  }

  Widget getHeartIcon() {
    if (showHeartAnimation) {
      return SizedBox(
        height: 16.67,
        width: 16.67,
        child: Lottie.asset('assets/lottie/animated_heart.json',
            repeat: false, reverse: false, animate: true, fit: BoxFit.cover),
      );
    }

    return Consumer<PlaceDetailsModel>(
      builder: (context, placeDetailsModel, child) {
        if (PlaceDetails.isFavouritePlace(
            placeDetailsModel.favouritePlaces, widget.placeDetails)) {
          return SvgPicture.asset(
            'assets/icon/heart.svg',
            semanticsLabel: 'Favorite',
            height: 16.67,
            width: 16.67,
          );
        }
        return SvgPicture.asset(
          'assets/icon/heart_dislike.svg',
          semanticsLabel: 'Favorite',
          height: 16.67,
          width: 16.67,
        );
      },
    );
  }

  void getMeasurement() {
    _appService.dbHelper
        .getMeasurement(widget.placeDetails.siteId)
        .then((value) => {
              if (value != null && mounted)
                {
                  setState(() {
                    measurement = value;
                  })
                }
            });
  }

  @override
  void initState() {
    super.initState();
    _appService = AppService(context);
    getMeasurement();
  }

  void updateFavPlace() async {
    setState(() {
      showHeartAnimation = true;
    });
    Future.delayed(const Duration(seconds: 2), () {
      setState(() {
        showHeartAnimation = false;
      });
    });

    await _appService.updateFavouritePlace(widget.placeDetails);
  }
}
