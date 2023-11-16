import 'package:app/constants/constants.dart';
import 'package:app/main_common.dart';
import 'package:app/models/models.dart';
import 'package:app/services/notification_service.dart';
import 'package:app/services/widget_service.dart';
import 'package:app/themes/theme.dart';
import 'package:app/widgets/widgets.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_dynamic_links/firebase_dynamic_links.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:workmanager/workmanager.dart';
import 'package:flutter/services.dart';


import 'firebase_options.dart';

@pragma("vm:entry-point")
void callbackDispatcher() {
  Workmanager().executeTask((taskName, inputData) {
    return WidgetService.sendAndUpdate().then((_) => true);
  });
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
 SystemChrome.setEnabledSystemUIMode(
    SystemUiMode.manual,
    overlays: [SystemUiOverlay.bottom, SystemUiOverlay.top],
  );
  final prefs = await SharedPreferences.getInstance();
  final savedLanguageCode = prefs.getString('selectedLanguage') ?? 'en';
  final savedLocale = Locale(savedLanguageCode);
  Workmanager().initialize(callbackDispatcher, isInDebugMode: kDebugMode);
  try {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
    await initializeMainMethod();
    final PendingDynamicLinkData? initialLink =
        await FirebaseDynamicLinks.instance.getInitialLink();

    AppConfig configuredApp = AppConfig(
      appTitle: 'AirQo',
      environment: Environment.prod,
      child: AirQoApp(initialLink, locale: savedLocale),
    );

    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      NotificationService.handleNotifications(message);
    });

    FirebaseMessaging.onBackgroundMessage((RemoteMessage message) async {
      NotificationService.handleNotifications(message);
    });

    

    runApp(configuredApp);
  } catch (exception, stackTrace) {
    runApp(
      MaterialApp(
        title: 'AirQo',
        theme: customTheme(),
        localizationsDelegates: const [
          AppLocalizations.delegate,
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
        ],
        supportedLocales: const [
          Locale('en'), // English
          Locale('fr'), //French
          Locale('pt'), //Portuguese
          Locale('sw'), //Swahili
        ],
        home: AppCrushWidget(exception, stackTrace),
      ),
    );
  }
}
