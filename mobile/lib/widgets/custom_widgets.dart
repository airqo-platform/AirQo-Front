import 'package:app/constants/config.dart';
import 'package:app/models/insights.dart';
import 'package:app/models/measurement.dart';
import 'package:app/models/suggestion.dart';
import 'package:app/utils/pm.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:google_fonts/google_fonts.dart';

Widget analyticsAvatar(
    Measurement measurement, double size, double fontSize, double iconHeight) {
  return Container(
    height: size,
    width: size,
    decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: pm2_5ToColor(measurement.getPm2_5Value()),
        border: Border.all(color: Colors.transparent)),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const Spacer(),
        SvgPicture.asset(
          'assets/icon/PM2.5.svg',
          semanticsLabel: 'Pm2.5',
          height: iconHeight,
          width: 32.45,
          color: pm2_5TextColor(measurement.getPm2_5Value()),
        ),
        Text(
          measurement.getPm2_5Value().toStringAsFixed(0),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: GoogleFonts.robotoMono(
              color: pm2_5TextColor(measurement.getPm2_5Value()),
              fontStyle: FontStyle.normal,
              fontSize: fontSize),
        ),
        SvgPicture.asset(
          'assets/icon/unit.svg',
          semanticsLabel: 'UNit',
          height: iconHeight,
          width: 32,
          color: pm2_5TextColor(measurement.getPm2_5Value()),
        ),
        const Spacer(),
      ],
    ),
  );
}

PreferredSizeWidget appTopBar(context, String title) {
  return AppBar(
    centerTitle: true,
    elevation: 0,
    backgroundColor: Config.appBodyColor,
    leading: Padding(
      padding: const EdgeInsets.only(top: 6.5, bottom: 6.5, left: 16),
      child: backButton(context),
    ),
    title: Text(
      title,
      style: TextStyle(color: Config.appColorBlack),
    ),
  );
}

Widget backButton(context) {
  return GestureDetector(
    onTap: () {
      Navigator.pop(context);
    },
    child: SvgPicture.asset(
      'assets/icon/back_button.svg',
      semanticsLabel: 'more',
      height: 40,
      width: 40,
    ),
  );
}

Widget iconTextButton(Widget icon, text) {
  return Row(
    children: [
      icon,
      const SizedBox(
        width: 10,
      ),
      Text(
        text,
        style: const TextStyle(fontSize: 14, color: Colors.black),
      )
    ],
  );
}

Widget insightsTabAvatar(
    context, Insights measurement, double size, String pollutant) {
  if (measurement.empty) {
    return Container(
      height: size,
      width: size,
      decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: Config.greyColor,
          border: Border.all(color: Colors.transparent)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const Spacer(),
          SvgPicture.asset(
            pollutant.trim().toLowerCase() == 'pm2.5'
                ? 'assets/icon/PM2.5.svg'
                : 'assets/icon/PM10.svg',
            semanticsLabel: 'Pm2.5',
            height: 6,
            width: 32.45,
            color: Config.darkGreyColor,
          ),
          Text(
            '--',
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: GoogleFonts.robotoMono(
              fontStyle: FontStyle.normal,
              fontSize: 32,
              color: Config.darkGreyColor,
            ),
          ),
          SvgPicture.asset(
            'assets/icon/unit.svg',
            semanticsLabel: 'UNit',
            height: 6,
            width: 32,
            color: Config.darkGreyColor,
          ),
          const Spacer(),
        ],
      ),
    );
  }
  return Container(
    height: size,
    width: size,
    decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: measurement.forecast
            ? Config.appColorPaleBlue
            : pollutant == 'pm2.5'
                ? pm2_5ToColor(measurement.getChartValue(pollutant))
                : pm10ToColor(measurement.getChartValue(pollutant)),
        border: Border.all(color: Colors.transparent)),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const Spacer(),
        SvgPicture.asset(
          pollutant.trim().toLowerCase() == 'pm2.5'
              ? 'assets/icon/PM2.5.svg'
              : 'assets/icon/PM10.svg',
          semanticsLabel: 'Pm2.5',
          height: 6,
          width: 32.45,
          color: measurement.forecast
              ? Config.appColorBlue
              : pollutant == 'pm2.5'
                  ? pm2_5TextColor(measurement.getChartValue(pollutant))
                  : pm10TextColor(measurement.getChartValue(pollutant)),
        ),
        Text(
          measurement.getChartValue(pollutant).toStringAsFixed(0),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: GoogleFonts.robotoMono(
            fontStyle: FontStyle.normal,
            fontSize: 32,
            color: measurement.forecast
                ? Config.appColorBlue
                : pollutant == 'pm2.5'
                    ? pm2_5TextColor(measurement.getChartValue(pollutant))
                    : pm10TextColor(measurement.getChartValue(pollutant)),
          ),
        ),
        SvgPicture.asset(
          'assets/icon/unit.svg',
          semanticsLabel: 'UNit',
          height: 6,
          width: 32,
          color: measurement.forecast
              ? Config.appColorBlue
              : pollutant == 'pm2.5'
                  ? pm2_5TextColor(measurement.getChartValue(pollutant))
                  : pm10TextColor(measurement.getChartValue(pollutant)),
        ),
        const Spacer(),
      ],
    ),
  );
}

PreferredSizeWidget knowYourAirAppBar(context, title) {
  return AppBar(
      centerTitle: true,
      elevation: 0,
      backgroundColor: Colors.transparent,
      foregroundColor: Colors.transparent,
      leading: Padding(
        padding: const EdgeInsets.only(top: 12, bottom: 6.5, left: 16),
        child: backButton(context),
      ),
      title: Padding(
        padding: const EdgeInsets.only(top: 10),
        child: Text(
          title,
          style: const TextStyle(color: Colors.white),
        ),
      ));
}

Widget searchLocationTile(Measurement measurement) {
  return Container(
    padding: const EdgeInsets.only(left: 16.0, right: 30.0),
    decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.all(Radius.circular(8.0)),
        border: Border.all(color: Colors.transparent)),
    child: ListTile(
      contentPadding: const EdgeInsets.only(left: 0.0),
      title: Text(
        measurement.site.getName(),
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
      ),
      subtitle: Text(
        measurement.site.getLocation(),
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: TextStyle(color: Colors.black.withOpacity(0.3), fontSize: 14),
      ),
      trailing: SvgPicture.asset(
        'assets/icon/more_arrow.svg',
        semanticsLabel: 'more',
        height: 6.99,
        width: 4,
      ),
      leading: analyticsAvatar(measurement, 40, 15, 5),
    ),
  );
}

Widget searchPlaceTile(Suggestion searchSuggestion) {
  return Container(
    padding: const EdgeInsets.only(left: 16.0, right: 30.0),
    decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.all(Radius.circular(8.0)),
        border: Border.all(color: Colors.transparent)),
    child: ListTile(
        contentPadding: const EdgeInsets.only(left: 0.0),
        title: Text(
          searchSuggestion.suggestionDetails.getMainText(),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        subtitle: Text(
          searchSuggestion.suggestionDetails.getSecondaryText(),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: TextStyle(color: Colors.black.withOpacity(0.3), fontSize: 14),
        ),
        trailing: SvgPicture.asset(
          'assets/icon/more_arrow.svg',
          semanticsLabel: 'more',
          height: 6.99,
          width: 4,
        ),
        leading: Container(
            height: 40,
            width: 40,
            decoration: BoxDecoration(
                color: Config.appColorBlue.withOpacity(0.15),
                shape: BoxShape.circle),
            child: Center(
              child: SvgPicture.asset('assets/icon/location.svg',
                  color: Config.appColorBlue),
            ))),
  );
}
