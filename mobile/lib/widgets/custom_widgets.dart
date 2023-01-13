import 'dart:io';

import 'package:app/blocs/blocs.dart';
import 'package:app/constants/constants.dart';
import 'package:app/models/models.dart';
import 'package:app/services/services.dart';
import 'package:app/themes/theme.dart';
import 'package:app/utils/utils.dart';
import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:lottie/lottie.dart';

import 'buttons.dart';
import 'custom_shimmer.dart';

class AirQualityChip extends StatelessWidget {
  const AirQualityChip(this.airQuality, {super.key});
  final AirQuality airQuality;

  @override
  Widget build(BuildContext context) {
    return Chip(
      backgroundColor: airQuality.color().withOpacity(0.3),
      label: Text(airQuality.string),
      labelStyle: CustomTextStyle.airQualityChip(context),
      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
      padding: const EdgeInsets.all(2),
      labelPadding: const EdgeInsets.symmetric(horizontal: 4, vertical: -8),
      avatar: CircleAvatar(
        backgroundColor: airQuality.color(),
      ),
    );
  }
}

class AppRefreshIndicator extends StatelessWidget {
  const AppRefreshIndicator({
    super.key,
    this.onRefresh,
    required this.sliverChildDelegate,
  });
  final Future<void> Function()? onRefresh;
  final SliverChildDelegate sliverChildDelegate;

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      physics: Platform.isAndroid ? const BouncingScrollPhysics() : null,
      slivers: [
        CupertinoSliverRefreshControl(
          refreshTriggerPullDistance: Config.refreshTriggerPullDistance,
          refreshIndicatorExtent: Config.refreshIndicatorExtent,
          onRefresh: onRefresh,
        ),
        SliverList(
          delegate: sliverChildDelegate,
        ),
      ],
    );
  }
}

class AppTopBar extends StatelessWidget implements PreferredSizeWidget {
  const AppTopBar(
    this.title, {
    super.key,
    this.actions,
    this.centerTitle,
  });
  final String title;
  final List<Widget>? actions;
  final bool? centerTitle;

  @override
  Widget build(BuildContext context) {
    return AppBar(
      toolbarHeight: 72,
      centerTitle: centerTitle ?? true,
      elevation: 0,
      backgroundColor: CustomColors.appBodyColor,
      automaticallyImplyLeading: false,
      leading: const Padding(
        padding: EdgeInsets.only(
          top: 6.5,
          bottom: 6.5,
          left: 16,
        ),
        child: AppBackButton(),
      ),
      title: Text(
        title,
        style: CustomTextStyle.headline8(context),
      ),
      actions: actions,
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(60);
}

class AppIconTopBar extends StatelessWidget implements PreferredSizeWidget {
  const AppIconTopBar({super.key});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      toolbarHeight: 72,
      centerTitle: true,
      elevation: 0,
      backgroundColor: CustomColors.appBodyColor,
      automaticallyImplyLeading: false,
      leading: const Padding(
        padding: EdgeInsets.only(
          top: 6.5,
          bottom: 6.5,
          left: 16,
        ),
        child: AppBackButton(),
      ),
      title: SvgPicture.asset(
        'assets/icon/airqo_logo.svg',
        height: 40,
        width: 58,
        semanticsLabel: 'AirQo',
      ),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(60);
}

class AqiStringContainer extends StatelessWidget {
  const AqiStringContainer(this.airQualityReading, {super.key});
  final AirQualityReading airQualityReading;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(
        10.0,
        2.0,
        10.0,
        2.0,
      ),
      decoration: BoxDecoration(
        borderRadius: const BorderRadius.all(
          Radius.circular(40.0),
        ),
        color: Pollutant.pm2_5
            .color(
              airQualityReading.pm2_5,
            )
            .withOpacity(0.4),
        border: const Border.fromBorderSide(
          BorderSide(color: Colors.transparent),
        ),
      ),
      child: AutoSizeText(
        Pollutant.pm2_5
            .stringValue(
              airQualityReading.pm2_5,
            )
            .trimEllipsis(),
        maxFontSize: 14,
        maxLines: 1,
        textAlign: TextAlign.start,
        overflow: TextOverflow.ellipsis,
        style: CustomTextStyle.button2(context)?.copyWith(
          color: Pollutant.pm2_5.textColor(
            value: airQualityReading.pm2_5,
            graph: true,
          ),
        ),
      ),
    );
  }
}

class KnowYourAirAppBar extends StatelessWidget implements PreferredSizeWidget {
  const KnowYourAirAppBar({super.key});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      centerTitle: true,
      elevation: 0,
      backgroundColor: Colors.transparent,
      foregroundColor: Colors.transparent,
      leading: const Padding(
        padding: EdgeInsets.only(top: 12, bottom: 6.5, left: 16),
        child: AppBackButton(),
      ),
      title: Padding(
        padding: const EdgeInsets.only(top: 10),
        child: Text(
          'Know Your Air',
          style:
              CustomTextStyle.headline8(context)?.copyWith(color: Colors.white),
        ),
      ),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(60);
}

class MiniAnalyticsAvatar extends StatelessWidget {
  const MiniAnalyticsAvatar({
    super.key,
    required this.airQualityReading,
  });
  final AirQualityReading airQualityReading;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 40,
      width: 40,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: Pollutant.pm2_5.color(
          airQualityReading.pm2_5,
        ),
        border: const Border.fromBorderSide(
          BorderSide(color: Colors.transparent),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const Spacer(),
          SvgPicture.asset(
            Pollutant.pm2_5.svg,
            semanticsLabel: 'Pm2.5',
            height: 5,
            width: 32.45,
            color: Pollutant.pm2_5.textColor(
              value: airQualityReading.pm2_5,
            ),
          ),
          AutoSizeText(
            airQualityReading.pm2_5.toStringAsFixed(0),
            maxLines: 1,
            style: CustomTextStyle.insightsAvatar(
              pollutant: Pollutant.pm2_5,
              value: airQualityReading.pm2_5,
            )?.copyWith(fontSize: 20),
          ),
          SvgPicture.asset(
            'assets/icon/unit.svg',
            semanticsLabel: 'Unit',
            height: 5,
            width: 32,
            color: Pollutant.pm2_5.textColor(
              value: airQualityReading.pm2_5,
            ),
          ),
          const Spacer(),
        ],
      ),
    );
  }
}

class HeartIcon extends StatelessWidget {
  const HeartIcon({
    super.key,
    required this.showAnimation,
    required this.airQualityReading,
  });

  final bool showAnimation;
  final AirQualityReading? airQualityReading;

  @override
  Widget build(BuildContext context) {
    if (showAnimation) {
      return SizedBox(
        height: 16.67,
        width: 16.67,
        child: Lottie.asset(
          'assets/lottie/animated_heart.json',
          repeat: false,
          reverse: false,
          animate: true,
          fit: BoxFit.cover,
        ),
      );
    }

    return ValueListenableBuilder<Box<FavouritePlace>>(
      valueListenable:
          Hive.box<FavouritePlace>(HiveBox.favouritePlaces).listenable(),
      builder: (context, box, widget) {
        final placesIds = box.keys.toList();

        final placeId =
            airQualityReading == null ? '' : airQualityReading?.placeId;

        return SvgPicture.asset(
          placesIds.contains(placeId)
              ? 'assets/icon/heart.svg'
              : 'assets/icon/heart_dislike.svg',
          semanticsLabel: 'Favorite',
          height: 16.67,
          width: 16.67,
        );
      },
    );
  }
}

class AnalyticsCardFooter extends StatefulWidget {
  const AnalyticsCardFooter({
    super.key,
    required this.airQualityReading,
    required this.shareKey,
    this.loadingRadius,
  });

  final AirQualityReading airQualityReading;
  final GlobalKey shareKey;
  final double? loadingRadius;

  @override
  State<AnalyticsCardFooter> createState() => _AnalyticsCardFooterState();
}

class _AnalyticsCardFooterState extends State<AnalyticsCardFooter> {
  bool _showHeartAnimation = false;
  bool _shareLoading = false;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _shareLoading
              ? LoadingIcon(
                  radius: widget.loadingRadius ?? 14,
                )
              : InkWell(
                  onTap: () async => _share(),
                  child: IconTextButton(
                    iconWidget: SvgPicture.asset(
                      'assets/icon/share_icon.svg',
                      color: CustomColors.greyColor,
                      semanticsLabel: 'Share',
                    ),
                    text: 'Share',
                  ),
                ),
        ),
        Expanded(
          child: InkWell(
            onTap: () async => _updateFavPlace(context),
            child: IconTextButton(
              iconWidget: HeartIcon(
                showAnimation: _showHeartAnimation,
                airQualityReading: widget.airQualityReading,
              ),
              text: 'Favorite',
            ),
          ),
        ),
      ],
    );
  }

  Future<void> _share() async {
    setState(() => _shareLoading = true);
    final complete = await ShareService.shareWidget(
      buildContext: context,
      globalKey: widget.shareKey,
    );
    if (complete && mounted) {
      setState(() => _shareLoading = false);
    }
  }

  void _updateFavPlace(BuildContext context) {
    setState(() => _showHeartAnimation = true);
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() => _showHeartAnimation = false);
      }
    });

    context
        .read<FavouritePlaceBloc>()
        .add(UpdateFavouritePlace(widget.airQualityReading));
  }
}

class AppSafeArea extends StatelessWidget {
  const AppSafeArea({
    super.key,
    required this.widget,
    this.verticalPadding,
    this.horizontalPadding,
    this.backgroundColor,
  });
  final Widget widget;
  final double? verticalPadding;
  final double? horizontalPadding;
  final Color? backgroundColor;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(vertical: verticalPadding ?? 0),
      color: backgroundColor ?? CustomColors.appBodyColor,
      child: SafeArea(
        minimum: EdgeInsets.symmetric(
          vertical: verticalPadding ?? 0,
          horizontal: horizontalPadding ?? 0,
        ),
        child: widget,
      ),
    );
  }
}
