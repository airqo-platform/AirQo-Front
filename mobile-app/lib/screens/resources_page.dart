import 'package:app/constants/app_constants.dart';
import 'package:app/models/measurement.dart';
import 'package:app/models/story.dart';
import 'package:app/screens/place_details.dart';
import 'package:app/screens/story_page.dart';
import 'package:app/services/local_storage.dart';
import 'package:app/services/rest_api.dart';
import 'package:app/utils/pm.dart';
import 'package:app/utils/share.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

class ResourcesPage extends StatefulWidget {
  @override
  _ResourcesPageState createState() => _ResourcesPageState();
}

class _ResourcesPageState extends State<ResourcesPage> {
  var stories = <Story>[];
  var measurements = <Measurement>[];
  var order = -1;
  var pollutant = 'pm2.5';

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      initialIndex: 0,
      length: 2,
      child: Container(
        color: Colors.white,
        child: Column(
          children: [
            TabBar(
              isScrollable: false,
              indicatorColor: ColorConstants.appColor,
              tabs: [
                const Tab(
                    child: Text(
                  'Blog',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17),
                )),
                const Tab(
                    child: Text(
                  'Ranking',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17),
                )),
              ],
            ),
            Expanded(
                child: TabBarView(
              children: [
                storyWidget(),
                rankingWidget(),
              ],
            ))
          ],
        ),
      ),
    );
  }

  void getRankings() {
    DBHelper().getLatestMeasurements().then((value) => {
          if (mounted) {setRankings(value)}
        });

    AirqoApiClient(context).fetchLatestMeasurements().then((value) => {
          if (mounted) {setRankings(value)},
          DBHelper().insertLatestMeasurements(value)
        });
  }

  void getStories() {
    DBHelper().getStories().then((value) => {
          if (mounted)
            {
              setState(() {
                stories = value;
              })
            }
        });

    AirqoApiClient(context).fetchLatestStories().then((value) => {
          if (mounted)
            {
              setState(() {
                stories = value;
              })
            },
          DBHelper().insertLatestStories(value)
        });
  }

  void initialize() {
    getStories();
    getRankings();
  }

  @override
  void initState() {
    initialize();
    super.initState();
  }

  Widget rankingWidget() {
    if (measurements.isEmpty) {
      return Container(
        color: Colors.white,
        child: Center(
          child: CircularProgressIndicator(
            color: ColorConstants.appColor,
          ),
        ),
      );
    } else {
      return Container(
          color: Colors.white,
          child: RefreshIndicator(
              onRefresh: refresh,
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.fromLTRB(20, 10, 20, 0),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        OutlinedButton(
                          onPressed: () {
                            setPollutant('pm2.5');
                          },
                          style: OutlinedButton.styleFrom(
                            backgroundColor: pollutant == 'pm2.5'
                                ? ColorConstants.appColor
                                : Colors.white,
                          ),
                          child: Text(
                            'PM2.5',
                            style: TextStyle(
                                color: pollutant == 'pm2.5'
                                    ? Colors.white
                                    : ColorConstants.appColor),
                          ),
                        ),
                        const SizedBox(
                          width: 10,
                        ),
                        OutlinedButton(
                          onPressed: () {
                            setPollutant('pm10');
                          },
                          style: OutlinedButton.styleFrom(
                            backgroundColor: pollutant == 'pm10'
                                ? ColorConstants.appColor
                                : Colors.white,
                          ),
                          child: Text(
                            'PM10',
                            style: TextStyle(
                                color: pollutant == 'pm10'
                                    ? Colors.white
                                    : ColorConstants.appColor),
                          ),
                        ),
                        const Spacer(),
                        GestureDetector(
                          child: const Icon(Icons.share_outlined),
                          onTap: () {
                            setState(() {
                              order = -order;
                            });
                            shareRanking(measurements);
                          },
                        ),
                        const SizedBox(
                          width: 10,
                        ),
                        GestureDetector(
                          child: const Icon(Icons.sort),
                          onTap: () {
                            setState(() {
                              order = -order;
                            });
                            setRankings(measurements);
                          },
                        ),
                      ],
                    ),
                  ),
                  Divider(
                    indent: 10,
                    endIndent: 10,
                    color: ColorConstants.appColor,
                  ),
                  Expanded(
                    child: ListView.builder(
                      itemBuilder: (context, index) => GestureDetector(
                        onTap: () {
                          Navigator.push(context,
                              MaterialPageRoute(builder: (context) {
                            return PlaceDetailsPage(
                                site: measurements[index].site);
                          }));
                        },
                        child: ListTile(
                          trailing: ClipRRect(
                            borderRadius: BorderRadius.circular(10),
                            child: Container(
                                width: 70,
                                height: 40,
                                color: pollutant == 'pm2.5'
                                    ? pmToColor(
                                        measurements[index].getPm2_5Value())
                                    : ColorConstants.inactiveColor
                                        .withOpacity(0.2),
                                padding: const EdgeInsets.all(5),
                                child: Center(
                                  child: pollutant == 'pm2.5'
                                      ? Text(
                                          '${measurements[index].getPm2_5Value()}',
                                          textAlign: TextAlign.center,
                                          style: TextStyle(
                                              color: pmTextColor(
                                                  measurements[index]
                                                      .getPm2_5Value())),
                                        )
                                      : Text(
                                          '${measurements[index].getPm10Value()}',
                                          textAlign: TextAlign.center,
                                          style: TextStyle(
                                              color: ColorConstants.appColor),
                                        ),
                                )),
                          ),
                          title: Text('${measurements[index].site.getName()}',
                              overflow: TextOverflow.ellipsis,
                              maxLines: 3,
                              style: TextStyle(
                                fontSize: 15,
                                color: ColorConstants.appColor,
                                fontWeight: FontWeight.bold,
                              )),
                          subtitle:
                              Text('${measurements[index].site.getLocation()}',
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: ColorConstants.appColor,
                                  )),
                        ),
                      ),
                      itemCount: measurements.length,
                    ),
                  ),
                ],
              )));
    }
  }

  Future<void> refresh() async {
    await AirqoApiClient(context).fetchLatestStories().then((value) => {
          if (mounted)
            {
              setState(() {
                stories = value;
              })
            },
          DBHelper().insertLatestStories(value),
        });

    await AirqoApiClient(context).fetchLatestMeasurements().then((value) => {
          if (mounted) {setRankings(value)},
          DBHelper().insertLatestMeasurements(value)
        });
  }

  void setPollutant(String value) {
    setState(() {
      pollutant = value;
    });
    setRankings(measurements);
  }

  void setRankings(List<Measurement> values) {
    if (order == -1) {
      if (pollutant == 'pm2.5') {
        values.sort((valueA, valueB) =>
            -(valueA.getPm2_5Value().compareTo(valueB.getPm2_5Value())));
      } else {
        values.sort((valueA, valueB) =>
            -(valueA.getPm10Value().compareTo(valueB.getPm10Value())));
      }
    } else {
      if (pollutant == 'pm2.5') {
        values.sort((valueA, valueB) =>
            valueA.getPm2_5Value().compareTo(valueB.getPm2_5Value()));
      } else {
        values.sort((valueA, valueB) =>
            valueA.getPm10Value().compareTo(valueB.getPm10Value()));
      }
    }

    setState(() {
      measurements = values;
    });
  }

  Widget storyBuild(BuildContext context) {
    if (stories.isEmpty) {
      return Container(
        color: Colors.white,
        child: Center(
          child: CircularProgressIndicator(
            color: ColorConstants.appColor,
          ),
        ),
      );
    } else {
      return Container(
          color: Colors.white,
          child: RefreshIndicator(
            onRefresh: refresh,
            child: ListView.builder(
              itemBuilder: (context, index) => GestureDetector(
                onTap: () {
                  viewStory(stories[index]);
                },
                child: ListTile(
                  trailing: ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: CachedNetworkImage(
                      width: 100,
                      height: 100,
                      fit: BoxFit.cover,
                      placeholder: (context, url) => const SizedBox(
                        height: 20.0,
                        width: 20.0,
                        child: Center(
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                          ),
                        ),
                      ),
                      imageUrl: stories[index].thumbnail,
                      errorWidget: (context, url, error) => Icon(
                        Icons.error_outline,
                        color: ColorConstants.red,
                      ),
                    ),
                  ),

                  title: Text('${stories[index].title}',
                      overflow: TextOverflow.ellipsis,
                      maxLines: 3,
                      style: TextStyle(
                        fontSize: 15,
                        color: ColorConstants.appColor,
                        fontWeight: FontWeight.bold,
                      )),
                  subtitle: Text('${stories[index].getPubDate()}',
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: 12,
                        color: ColorConstants.appColor,
                      )),
                  // trailing: const Icon(
                  //   Icons.arrow_forward_ios
                  // ),
                ),
              ),
              itemCount: stories.length,
            ),
          ));
    }
  }

  Widget storyWidget() {
    if (stories.isEmpty) {
      return Container(
        color: Colors.white,
        child: Center(
          child: CircularProgressIndicator(
            color: ColorConstants.appColor,
          ),
        ),
      );
    } else {
      return Container(
          color: Colors.white,
          child: RefreshIndicator(
            onRefresh: refresh,
            child: ListView.builder(
              itemBuilder: (context, index) => GestureDetector(
                onTap: () {
                  viewStory(stories[index]);
                },
                child: ListTile(
                  trailing: ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: CachedNetworkImage(
                      width: 100,
                      height: 100,
                      fit: BoxFit.cover,
                      placeholder: (context, url) => const SizedBox(
                        height: 20.0,
                        width: 20.0,
                        child: Center(
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                          ),
                        ),
                      ),
                      imageUrl: stories[index].thumbnail,
                      errorWidget: (context, url, error) => Icon(
                        Icons.error_outline,
                        color: ColorConstants.red,
                      ),
                    ),
                  ),

                  title: Text('${stories[index].title}',
                      overflow: TextOverflow.ellipsis,
                      maxLines: 3,
                      style: TextStyle(
                        fontSize: 15,
                        color: ColorConstants.appColor,
                        fontWeight: FontWeight.bold,
                      )),
                  subtitle: Text('${stories[index].getPubDate()}',
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: 12,
                        color: ColorConstants.appColor,
                      )),
                  // trailing: const Icon(
                  //   Icons.arrow_forward_ios
                  // ),
                ),
              ),
              itemCount: stories.length,
            ),
          ));
    }
  }

  Future<void> viewStory(Story story) async {
    await Navigator.push(context, MaterialPageRoute(builder: (context) {
      return StoryPage(
        story: story,
      );
    }));
  }
}
