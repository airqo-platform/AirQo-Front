import 'package:app/app_config.dart';
import 'package:app/main_common.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import 'constants/config.dart';
import 'firebase_options_dev.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    name: 'airqo-dev',
    options: DefaultFirebaseOptions.currentPlatform,
  );

  await initializers();

  var configuredApp = const AppConfig(
    appTitle: 'AirQo Dev',
    environment: Environment.dev,
    child: AirQoApp(),
  );

  if (kReleaseMode) {
    FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterFatalError;
    await SentryFlutter.init(
      (options) {
        options
          ..dsn = Config.sentryDsn
          ..enableOutOfMemoryTracking = true
          ..tracesSampleRate = 1.0;
      },
      appRunner: () => runApp(configuredApp),
    );
  } else {
    runApp(configuredApp);
  }
}
