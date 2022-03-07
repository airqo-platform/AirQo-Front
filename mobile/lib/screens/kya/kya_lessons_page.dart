import 'package:app/constants/config.dart';
import 'package:app/models/kya.dart';
import 'package:app/services/app_service.dart';
import 'package:auto_size_text/auto_size_text.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:scrollable_positioned_list/scrollable_positioned_list.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../services/native_api.dart';
import '../../widgets/custom_shimmer.dart';
import 'kya_final_page.dart';

class KyaLessonsPage extends StatefulWidget {
  final Kya kya;

  const KyaLessonsPage(this.kya, {Key? key}) : super(key: key);

  @override
  _KyaLessonsPageState createState() => _KyaLessonsPageState();
}

class _KyaLessonsPageState extends State<KyaLessonsPage> {
  final ItemScrollController itemScrollController = ItemScrollController();

  double _tipsProgress = 0.1;
  int currentIndex = 0;
  late Kya kya;
  late AppService _appService;
  final List<GlobalKey> _globalKeys = <GlobalKey>[];
  final ShareService _shareService = ShareService();

  @override
  Widget build(BuildContext context) {
    var screenSize = MediaQuery.of(context).size;
    return WillPopScope(
      onWillPop: _onWillPop,
      child: Scaffold(
          appBar: AppBar(
            automaticallyImplyLeading: false,
            elevation: 0,
            backgroundColor: Config.appBodyColor,
            centerTitle: false,
            titleSpacing: 0,
            title: Padding(
              padding: const EdgeInsets.only(left: 24, right: 24),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () {
                      updateProgress();
                      Navigator.of(context).pop(true);
                    },
                    child: SvgPicture.asset(
                      'assets/icon/close.svg',
                      height: 20,
                      width: 20,
                    ),
                  ),
                  const SizedBox(
                    width: 7,
                  ),
                  Expanded(
                      child: LinearProgressIndicator(
                    color: Config.appColorBlue,
                    value: _tipsProgress,
                    backgroundColor: Config.appColorBlue.withOpacity(0.2),
                  )),
                  const SizedBox(
                    width: 7,
                  ),
                  GestureDetector(
                    onTap: () async {
                      try {
                        await _shareService.shareKya(
                            context, _globalKeys[currentIndex]);
                      } catch (exception, stackTrace) {
                        debugPrint('$exception\n$stackTrace');
                        await Sentry.captureException(
                          exception,
                          stackTrace: stackTrace,
                        );
                      }
                    },
                    child: SvgPicture.asset(
                      'assets/icon/share_icon.svg',
                      color: Config.greyColor,
                      height: 16,
                      width: 16,
                    ),
                  ),
                ],
              ),
            ),
          ),
          body: Container(
              alignment: Alignment.center,
              color: Config.appBodyColor,
              child: Column(
                children: [
                  const Spacer(),
                  SizedBox(
                    height: MediaQuery.of(context).size.height * 0.75,
                    child: ScrollablePositionedList.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: kya.lessons.length,
                      itemBuilder: (context, index) {
                        return Padding(
                          padding: const EdgeInsets.only(
                              top: 52, bottom: 40, left: 19, right: 19),
                          child: RepaintBoundary(
                            key: _globalKeys[index],
                            child: SizedBox(
                                width: screenSize.width * 0.9,
                                child: kyaCard(kya.lessons[index], index)),
                          ),
                        );
                      },
                      itemScrollController: itemScrollController,
                    ),
                  ),
                  const Spacer(),
                  Padding(
                    padding: const EdgeInsets.only(left: 20, right: 20),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Visibility(
                          child: GestureDetector(
                              onTap: () {
                                scrollToCard(direction: -1);
                              },
                              child: circularButton(
                                  'assets/icon/previous_arrow.svg')),
                          visible: currentIndex > 0,
                        ),
                        GestureDetector(
                            onTap: () {
                              scrollToCard(direction: 1);
                            },
                            child:
                                circularButton('assets/icon/next_arrow.svg')),
                      ],
                    ),
                  ),
                  const SizedBox(
                    height: 40,
                  ),
                ],
              ))),
    );
  }

  Widget circularButton(String icon) {
    return Container(
      height: 48,
      width: 48,
      padding: const EdgeInsets.all(15.0),
      decoration: BoxDecoration(
        color: Config.appColorPaleBlue,
        shape: BoxShape.circle,
      ),
      child: SvgPicture.asset(
        icon,
        color: Config.appColorBlue,
      ),
    );
  }

  @override
  void initState() {
    super.initState();
    _appService = AppService(context);
    kya = widget.kya;
    currentIndex = 0;
    for (var _ in widget.kya.lessons) {
      _globalKeys.add(GlobalKey());
    }
  }

  Widget kyaCard(KyaLesson kyaItem, int index) {
    return Card(
      color: Colors.white,
      elevation: 20.0,
      shadowColor: Config.appBodyColor,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Container(
        alignment: Alignment.center,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(
              height: 8.0,
            ),
            Padding(
              padding: const EdgeInsets.only(left: 8.0, right: 8.0),
              child: Container(
                height: 180,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(8),
                ),
                child: index == currentIndex
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: CachedNetworkImage(
                          fit: BoxFit.fill,
                          placeholder: (context, url) => SizedBox(
                            child: containerLoadingAnimation(
                                height: 180, radius: 8),
                          ),
                          imageUrl: kyaItem.imageUrl,
                          errorWidget: (context, url, error) => Icon(
                            Icons.error_outline,
                            color: Config.red,
                          ),
                        ))
                    : ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child:
                            containerLoadingAnimation(height: 180, radius: 8)),
              ),
            ),
            // const SizedBox(
            //   height: 12,
            // ),
            const Spacer(),
            Padding(
              padding: const EdgeInsets.only(left: 36, right: 36),
              child: AutoSizeText(
                kyaItem.title,
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
                textAlign: TextAlign.center,
                style: TextStyle(
                    color: Config.appColorBlack,
                    fontSize: 20,
                    fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(
              height: 8.0,
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.only(left: 16, right: 16),
                child: AutoSizeText(
                  kyaItem.body,
                  maxLines: 5,
                  overflow: TextOverflow.ellipsis,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                      color: Colors.black.withOpacity(0.5), fontSize: 16),
                ),
              ),
            ),
            const Spacer(),
            // const SizedBox(
            //   height: 20.0,
            // ),
            SvgPicture.asset(
              'assets/icon/tips_graphics.svg',
              semanticsLabel: 'tips_graphics',
            ),
            const SizedBox(
              height: 30,
            ),
          ],
        ),
      ),
    );
  }

  void scrollToCard({required int direction}) {
    if (direction == -1) {
      setState(() {
        currentIndex = currentIndex - 1;
      });
      itemScrollController.scrollTo(
          index: currentIndex,
          duration: const Duration(seconds: 1),
          curve: Curves.easeInOutCubic);
    } else {
      setState(() {
        currentIndex = currentIndex + 1;
      });
      if (currentIndex < kya.lessons.length) {
        itemScrollController.scrollTo(
            index: currentIndex,
            duration: const Duration(seconds: 1),
            curve: Curves.easeInOutCubic);
      } else {
        kya.progress = currentIndex;
        Navigator.pushAndRemoveUntil(context,
            MaterialPageRoute(builder: (context) {
          return KyaFinalPage(
            kya: kya,
          );
        }), (r) => false);
      }
    }

    Future.delayed(const Duration(milliseconds: 500), setTipsProgress);
  }

  void setTipsProgress() {
    if (mounted) {
      setState(() {
        _tipsProgress = (currentIndex + 1) / kya.lessons.length;
      });
    }
  }

  void updateProgress() {
    if (widget.kya.progress == -1) {
      return;
    }
    var kya = widget.kya..progress = currentIndex;
    if (kya.progress > kya.lessons.length || kya.progress < 0) {
      kya.progress = kya.lessons.length - 1;
    }
    _appService.updateKya(kya);
  }

  Future<bool> _onWillPop() {
    updateProgress();
    return Future.value(true);
  }
}
