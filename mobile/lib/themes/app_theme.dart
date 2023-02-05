import 'package:app/models/enum_constants.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'colors.dart';

const googleMapsTheme = [
  {
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#edf3ff',
      },
    ],
  },
  {
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#edf3ff',
      },
    ],
  },
  {
    'elementType': 'labels.icon',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#1d62f7',
      },
    ],
  },
  {
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'color': '#fafafa',
      },
    ],
  },
  {
    'featureType': 'administrative.country',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#578afa',
      },
    ],
  },
  {
    'featureType': 'administrative.country',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#578afa',
      },
    ],
  },
  {
    'featureType': 'administrative.country',
    'elementType': 'labels.text',
    'stylers': [
      {
        'color': '#064ce5',
      },
      {
        'saturation': 5,
      },
    ],
  },
  {
    'featureType': 'administrative.country',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#064ce5',
      },
    ],
  },
  {
    'featureType': 'administrative.country',
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'color': '#064ce5',
      },
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'administrative.land_parcel',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'administrative.land_parcel',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#578afa',
      },
    ],
  },
  {
    'featureType': 'administrative.land_parcel',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#578afa',
      },
    ],
  },
  {
    'featureType': 'administrative.locality',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#578afa',
      },
    ],
  },
  {
    'featureType': 'administrative.locality',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#578afa',
      },
    ],
  },
  {
    'featureType': 'administrative.neighborhood',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'administrative.neighborhood',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#578afa',
      },
    ],
  },
  {
    'featureType': 'administrative.neighborhood',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#578afa',
      },
    ],
  },
  {
    'featureType': 'administrative.province',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#578afa',
      },
    ],
  },
  {
    'featureType': 'administrative.province',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#578afa',
      },
    ],
  },
  {
    'featureType': 'landscape.man_made',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#578afa',
      },
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'landscape.man_made',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#578afa',
      },
    ],
  },
  {
    'featureType': 'landscape.natural.landcover',
    'stylers': [
      {
        'color': '#fafafa',
      },
    ],
  },
  {
    'featureType': 'poi',
    'elementType': 'labels.text',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'poi.business',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'poi.park',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#c3fed3',
      },
      {
        'weight': 0.5,
      },
    ],
  },
  {
    'featureType': 'road',
    'stylers': [
      {
        'color': '#ebf1f8',
      },
    ],
  },
  {
    'featureType': 'road',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'weight': 0.5,
      },
    ],
  },
  {
    'featureType': 'road',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#c5d7fb',
      },
      {
        'weight': 0.5,
      },
    ],
  },
  {
    'featureType': 'road',
    'elementType': 'labels',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'road',
    'elementType': 'labels.icon',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'road.arterial',
    'elementType': 'labels',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'road.highway',
    'elementType': 'labels',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'road.local',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'transit',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'water',
    'stylers': [
      {
        'color': '#a9c2f9',
      },
      {
        'visibility': 'simplified',
      },
    ],
  },
  {
    'featureType': 'water',
    'elementType': 'labels.text',
    'stylers': [
      {
        'color': '#1d62f7',
      },
      {
        'visibility': 'off',
      },
    ],
  },
];

ThemeData customTheme() {
  final base = ThemeData.light();

  /// height := line height * fontSize
  /// letterSpacing := 16 * letter-spacing(em)
  /// Theme.of(context).textTheme.headline1
  /// CustomTextStyle.headline10(context)

  return base.copyWith(
    primaryColor: Colors.white,
    visualDensity: VisualDensity.adaptivePlatformDensity,
    textTheme: TextTheme(
      displayLarge: TextStyle(
        fontSize: 80.0,
        fontWeight: FontWeight.w700,
        fontStyle: FontStyle.normal,
        color: CustomColors.appColorBlack,
        height: 88.0 / 80.0,
        letterSpacing: 16 * -0.01,
      ),
      displayMedium: TextStyle(
        fontSize: 64.0,
        fontWeight: FontWeight.w700,
        fontStyle: FontStyle.normal,
        color: CustomColors.appColorBlack,
        height: 72.0 / 64.0,
        letterSpacing: 16 * -0.01,
      ),
      displaySmall: TextStyle(
        fontSize: 56.0,
        fontWeight: FontWeight.w700,
        fontStyle: FontStyle.normal,
        color: CustomColors.appColorBlack,
        height: 64.0 / 56.0,
        letterSpacing: 16 * -0.01,
      ),
      headlineMedium: TextStyle(
        fontSize: 48.0,
        fontWeight: FontWeight.w700,
        fontStyle: FontStyle.normal,
        color: CustomColors.appColorBlack,
        height: 56.0 / 48.0,
        letterSpacing: 16 * -0.01,
      ),
      headlineSmall: TextStyle(
        fontSize: 40.0,
        fontWeight: FontWeight.w700,
        fontStyle: FontStyle.normal,
        color: CustomColors.appColorBlack,
        height: 48.0 / 40.0,
        letterSpacing: 16 * -0.01,
      ),
      titleLarge: TextStyle(
        fontSize: 32.0,
        fontWeight: FontWeight.w700,
        fontStyle: FontStyle.normal,
        color: CustomColors.appColorBlack,
        height: 40.0 / 32.0,
        letterSpacing: 16 * -0.01,
      ),
      bodyLarge: TextStyle(
        fontSize: 16.0,
        fontWeight: FontWeight.w400,
        fontStyle: FontStyle.normal,
        color: CustomColors.appColorBlack,
        height: 24.0 / 16.0,
      ),
      bodyMedium: TextStyle(
        fontSize: 14.0,
        fontWeight: FontWeight.w400,
        fontStyle: FontStyle.normal,
        color: CustomColors.appColorBlack,
        height: 18.0 / 14.0,
      ),
      bodySmall: TextStyle(
        fontSize: 12.0,
        fontWeight: FontWeight.w400,
        fontStyle: FontStyle.normal,
        color: CustomColors.appColorBlack,
        height: 16.0 / 12.0,
      ),
      labelSmall: TextStyle(
        fontSize: 8.0,
        fontWeight: FontWeight.w500,
        fontStyle: FontStyle.normal,
        color: CustomColors.appColorBlack,
        height: 12.0 / 8.0,
        letterSpacing: 16 * -0.24,
      ),
      titleMedium: TextStyle(
        fontSize: 16.0,
        fontWeight: FontWeight.normal,
        fontStyle: FontStyle.normal,
        color: CustomColors.appColorBlack,
        height: 24.0 / 16.0,
      ),
      titleSmall: TextStyle(
        fontSize: 14.0,
        fontWeight: FontWeight.w400,
        fontStyle: FontStyle.normal,
        color: CustomColors.appColorBlack,
        height: 18.0 / 14.0,
      ),
    ).apply(
      fontFamily: GoogleFonts.inter().fontFamily,
      bodyColor: CustomColors.appColorBlack,
      displayColor: CustomColors.appColorBlack,
    ),
    primaryTextTheme: ThemeData.light().textTheme.apply(
          fontFamily: GoogleFonts.inter().fontFamily,
          bodyColor: CustomColors.appColorBlack,
          displayColor: CustomColors.appColorBlack,
        ),
    iconTheme: IconThemeData(
      color: CustomColors.appColorBlack,
    ),
    appBarTheme: const AppBarTheme(
      elevation: 0.0,
    ),
    extensions: <ThemeExtension<dynamic>>[
      AppColors(
        appBodyColor: const Color(0xffF2F1F6),
        appColorBlack: const Color(0xff121723),
        appColorBlue: const Color(0xff145DFF),
        appColorDisabled: const Color(0xff145DFF).withOpacity(0.5),
        appLoadingColor: const Color(0xffEBEAEF),
        appPicColor: const Color(0xffFF79C1),
        greyColor: const Color(0xffD1D3D9),
        snackBarBgColor: const Color(0xff121723).withOpacity(0.8),
        toolTipGreyColor: Colors.white.withOpacity(0.32),
        inactiveColor: const Color(0xff121723).withOpacity(0.4),
        pollutantToggleBgColor: const Color(0xffF5F8FF),
        darkGreyColor: const Color(0xffADAFB6),
      ),
      const AqiColors(
        aqiGreen: Color(0xff3AFF38),
        aqiGreenTextColor: Color(0xff03B600),
        aqiYellow: Color(0xffFFFF35),
        aqiYellowTextColor: Color(0xffA8A800),
        aqiOrange: Color(0xffFE9E35),
        aqiOrangeTextColor: Color(0xffB86000),
        aqiRed: Color(0xffFF4034),
        aqiRedTextColor: Color(0xffB80B00),
        aqiPurple: Color(0xFFDD38FF),
        aqiPurpleTextColor: Color(0xff8E00AC),
        aqiMaroon: Color(0xffA51F3F),
        aqiMaroonTextColor: Color(0xffDBA5B2),
      ),
    ],
  );
}

class CustomTextStyle {
  static TextStyle? bodyText4(BuildContext context) {
    return Theme.of(context).textTheme.bodyMedium?.copyWith(
          fontSize: 14.0,
          fontWeight: FontWeight.w500,
          fontStyle: FontStyle.normal,
          height: 18.0 / 14.0,
        );
  }

  static TextStyle? button1(BuildContext context) {
    return Theme.of(context).textTheme.titleLarge?.copyWith(
          fontSize: 14.0,
          fontWeight: FontWeight.w400,
          fontStyle: FontStyle.normal,
          height: 18.0 / 14.0,
        );
  }

  static TextStyle? newNotification(BuildContext context) {
    return Theme.of(context).textTheme.titleLarge?.copyWith(
          fontSize: 10.0,
          fontWeight: FontWeight.w500,
          fontStyle: FontStyle.normal,
          height: 13.0 / 10.0,
          color: CustomColors.appColorBlue,
        );
  }

  static TextStyle? button2(BuildContext context) {
    return Theme.of(context).textTheme.titleLarge?.copyWith(
          fontSize: 14.0,
          fontWeight: FontWeight.w500,
          fontStyle: FontStyle.normal,
          height: 18.0 / 14.0,
        );
  }

  static TextStyle? caption3(BuildContext context) {
    return Theme.of(context).textTheme.bodySmall?.copyWith(
          fontWeight: FontWeight.w500,
          fontSize: 12.0,
          height: 16.0 / 12.0,
        );
  }

  static TextStyle? caption4(BuildContext context) {
    return Theme.of(context).textTheme.bodySmall?.copyWith(
          fontSize: 12.0,
          height: 16.0 / 12.0,
        );
  }

  static TextStyle? headline10(BuildContext context) {
    return Theme.of(context).textTheme.titleLarge?.copyWith(
          fontSize: 16.0,
          fontWeight: FontWeight.w700,
          fontStyle: FontStyle.normal,
          height: 20.0 / 16.0,
        );
  }

  static TextStyle? headline11(BuildContext context) {
    return Theme.of(context).textTheme.titleLarge?.copyWith(
          fontSize: 28.0,
          fontWeight: FontWeight.w700,
          fontStyle: FontStyle.normal,
          letterSpacing: 16 * -0.01,
          height: 32.0 / 28.0,
        );
  }

  static TextStyle? headline7(BuildContext context) {
    return Theme.of(context).textTheme.titleLarge?.copyWith(
          fontSize: 24.0,
          fontWeight: FontWeight.w700,
          fontStyle: FontStyle.normal,
          height: 32.0 / 24.0,
        );
  }

  static TextStyle? errorTitle(BuildContext context) {
    return Theme.of(context).textTheme.titleLarge?.copyWith(
          fontSize: 21.0,
          fontWeight: FontWeight.w700,
          fontStyle: FontStyle.normal,
          height: 26.0 / 21.0,
        );
  }

  static TextStyle? errorSubTitle(BuildContext context) {
    return Theme.of(context).textTheme.titleLarge?.copyWith(
          fontSize: 15.0,
          fontWeight: FontWeight.w400,
          fontStyle: FontStyle.normal,
          height: 18.0 / 15.0,
          color: CustomColors.appColorBlack.withOpacity(0.6),
        );
  }

  static TextStyle? headline8(BuildContext context) {
    return Theme.of(context).textTheme.titleLarge?.copyWith(
          fontSize: 16.0,
          fontWeight: FontWeight.w700,
          fontStyle: FontStyle.normal,
          height: 20.0 / 16.0,
        );
  }

  static TextStyle? headline9(BuildContext context) {
    return Theme.of(context).textTheme.titleLarge?.copyWith(
          fontSize: 20.0,
          fontWeight: FontWeight.w700,
          fontStyle: FontStyle.normal,
          height: 24.0 / 20.0,
        );
  }

  static TextStyle? airQualityChip(BuildContext context) {
    return Theme.of(context).textTheme.titleLarge?.copyWith(
          fontSize: 7.0,
          fontWeight: FontWeight.w400,
          fontStyle: FontStyle.normal,
          height: 9.0 / 7.0,
        );
  }

  static TextStyle? insightsAvatar({
    required Pollutant pollutant,
    required double value,
  }) {
    return GoogleFonts.robotoMono(
      color: pollutant.textColor(
        value: value,
      ),
      fontStyle: FontStyle.normal,
      fontSize: 40,
      fontWeight: FontWeight.w700,
      height: 48 / 40,
      letterSpacing: 16 * -0.022,
    );
  }

  static TextStyle? overline1(BuildContext context) {
    return Theme.of(context).textTheme.titleLarge?.copyWith(
          fontWeight: FontWeight.w400,
          fontStyle: FontStyle.normal,
          fontSize: 10.0,
          height: 14.0 / 10.0,
          color: Colors.white,
        );
  }
}
