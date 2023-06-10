import 'package:app/blocs/blocs.dart';
import 'package:app/models/models.dart';
import 'package:app/services/services.dart';
import 'package:app/themes/theme.dart';
import 'package:app/utils/utils.dart';
import 'package:app/widgets/widgets.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_cache_manager/flutter_cache_manager.dart';
import 'package:app/constants/constants.dart' as config;
import 'kya_tasks_page.dart';
import 'kya_widgets.dart';

class KyaLessonPage extends StatelessWidget {
  const KyaLessonPage(this.kya, {super.key});
  final KyaLesson kya;

  @override
  Widget build(BuildContext context) {
    final mediaQueryData = MediaQuery.of(context);

    final num textScaleFactor = mediaQueryData.textScaleFactor.clamp(
      config.Config.minimumTextScaleFactor,
      config.Config.maximumTextScaleFactor,
    );

    return MediaQuery(
      data: mediaQueryData.copyWith(textScaleFactor: textScaleFactor as double),
      child: BlocBuilder<KyaBloc, List<KyaLesson>>(
        builder: (context, state) {
          KyaLesson kyaLesson = state.firstWhere(
            (element) => element.id == kya.id,
            orElse: () => kya,
          );

          if (kyaLesson.tasks.isNotEmpty) {
            return KyaLessonPageScaffold(kyaLesson);
          }

          return FutureBuilder<List<KyaLesson>?>(
            future: AirqoApiClient().getKyaLessons(""),
            builder: (context, snapshot) {
              if (snapshot.hasError) {
                if (snapshot.error.runtimeType == NetworkConnectionException) {
                  return NoInternetConnectionWidget(
                    callBack: () {

                    },
                  );
                }

                return const KyaNotFoundWidget();
              }

              if (snapshot.hasData) {
                final KyaLesson? lesson = snapshot.data?.firstWhere((element) => element.id == kya.id, orElse: () => kya);
                if (lesson == null || lesson.tasks.isEmpty) {
                  return const KyaNotFoundWidget();
                }

                return KyaLessonPageScaffold(kya);
              }

              return const KyaLoadingWidget();
            },
          );
        },
      ),
    );
  }
}

class KyaLessonPageScaffold extends StatelessWidget {
  const KyaLessonPageScaffold(this.kya, {super.key});
  final KyaLesson kya;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: const KnowYourAirAppBar(),
      body: Stack(
        fit: StackFit.expand,
        children: [
          Container(
            color: CustomColors.appBodyColor,
            height: double.infinity,
            width: double.infinity,
          ),
          FractionallySizedBox(
            alignment: Alignment.topCenter,
            widthFactor: 1.0,
            heightFactor: 0.4,
            child: Container(
              decoration: BoxDecoration(
                image: DecorationImage(
                  fit: BoxFit.cover,
                  image: CachedNetworkImageProvider(
                    kya.imageUrl,
                    cacheKey: kya.imageUrlCacheKey(),
                    cacheManager: CacheManager(
                      CacheService.cacheConfig(
                        kya.imageUrlCacheKey(),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
          Align(
            alignment: AlignmentDirectional.bottomCenter,
            child: Padding(
              padding: const EdgeInsets.only(
                left: 24,
                right: 24,
                bottom: 32,
              ),
              child: NextButton(
                text: kya.getKyaLessonPageTitle(),
                buttonColor: CustomColors.appColorBlue,
                callBack: () {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(
                      builder: (context) {
                        return KyaTasksPage(kya);
                      },
                    ),
                  );
                },
              ),
            ),
          ),
          Positioned.fill(
            child: Align(
              alignment: Alignment.center,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  children: [
                    const Spacer(),
                    Container(
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.all(
                          Radius.circular(16.0),
                        ),
                      ),
                      child: Center(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            const SizedBox(
                              height: 48,
                            ),
                            Container(
                              constraints: const BoxConstraints(
                                maxWidth: 221.46,
                                maxHeight: 133.39,
                                minWidth: 221.46,
                                minHeight: 133.39,
                              ),
                              decoration: const BoxDecoration(
                                // borderRadius: BorderRadius.circular(8.0),
                                image: DecorationImage(
                                  fit: BoxFit.cover,
                                  image: AssetImage(
                                    'assets/images/kya_stars.png',
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(
                              height: 18,
                            ),
                            Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 40,
                              ),
                              child: Text(
                                kya.title,
                                textAlign: TextAlign.center,
                                style: CustomTextStyle.headline11(context)
                                    ?.copyWith(
                                  color: CustomColors.appColorBlack,
                                ),
                              ),
                            ),
                            const SizedBox(
                              height: 64,
                            ),
                          ],
                        ),
                      ),
                    ),
                    const Spacer(),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
