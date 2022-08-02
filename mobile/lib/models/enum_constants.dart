import 'package:hive/hive.dart';

part 'enum_constants.g.dart';

enum AnalyticsEvent {
  browserAsAppGuest,
  createUserProfile,
  shareAirQualityInformation,
  completeOneKYA,
  allowNotification,
  allowLocation,
  uploadProfilePicture,
  savesFiveFavorites,
  maleUser,
  femaleUser,
  undefinedGender,
  iosUser,
  androidUser,
  rateApp,
  mtnUser,
  airtelUser,
  otherNetwork,
  deletedAccount,
  notificationOpen,
  notificationReceive,
}

enum AppPermission {
  notification,
  location,
}

@HiveType(typeId: 110, adapterName: 'AppNotificationTypeAdapter')
enum AppNotificationType {
  @HiveField(0)
  appUpdate,
  @HiveField(1)
  reminder,
  @HiveField(2)
  welcomeMessage,
}

enum Region { central, eastern, northern, western, none }

enum AirQuality {
  good,
  moderate,
  ufsgs,
  unhealthy,
  veryUnhealthy,
  hazardous,
}

enum FeedbackType {
  inquiry,
  suggestion,
  appBugs,
  reportAirPollution,
  none,
}

enum FeedbackChannel {
  whatsApp,
  email,
  none,
}

enum AuthMethod {
  phone,
  email,
}

enum AuthProcedure {
  login,
  signup,
}

enum Frequency {
  daily,
  hourly,
}

enum Gender {
  male,
  female,
  undefined,
}

enum ConfirmationAction {
  cancel,
  ok,
}

enum OnBoardingPage {
  signup,
  profile,
  notification,
  location,
  complete,
  home,
  welcome,
}

enum Pollutant {
  pm2_5,
  pm10,
}

enum TitleOptions {
  ms,
  mr,
  undefined,
}

enum ToolTipType {
  favouritePlaces,
  info,
  forYou,
  forecast,
}
