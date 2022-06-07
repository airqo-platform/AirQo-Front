import 'package:app/constants/config.dart';
import 'package:app/models/enum_constants.dart';
import 'package:app/utils/extensions.dart';
import 'package:shared_preferences/shared_preferences.dart';

Region getRegionConstant(String value) {
  if (value.toLowerCase().contains('central')) {
    return Region.central;
  } else if (value.toLowerCase().contains('northern')) {
    return Region.northern;
  } else if (value.toLowerCase().contains('eastern')) {
    return Region.eastern;
  } else if (value.toLowerCase().contains('western')) {
    return Region.western;
  } else {
    return Region.none;
  }
}

Region getNextDashboardRegion(SharedPreferences sharedPreferences) {
  final currentRegion = getRegionConstant(
    sharedPreferences.getString(Config.prefDashboardRegion) ?? '',
  );

  if (currentRegion == Region.central) {
    sharedPreferences.setString(
      Config.prefDashboardRegion,
      Region.eastern.getName(),
    );

    return Region.eastern;
  } else if (currentRegion == Region.eastern) {
    sharedPreferences.setString(
      Config.prefDashboardRegion,
      Region.western.getName(),
    );

    return Region.western;
  } else if (currentRegion == Region.western || currentRegion == Region.none) {
    sharedPreferences.setString(
      Config.prefDashboardRegion,
      Region.central.getName(),
    );

    return Region.central;
  }

  return Region.central;
}
