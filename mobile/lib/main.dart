import 'package:app/constants/constants.dart';
import 'package:app/main_common.dart';
import 'package:app/models/models.dart';
import 'package:app/themes/theme.dart';
import 'package:app/widgets/widgets.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:firebase_dynamic_links/firebase_dynamic_links.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

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
      child: AirQoApp(initialLink),
    );

    if (kReleaseMode) {
      FlutterError.onError =
          FirebaseCrashlytics.instance.recordFlutterFatalError;
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
  } catch (exception, stackTrace) {
    runApp(
      MaterialApp(
        title: 'AirQo',
        theme: customTheme(),
        home: AppCrushWidget(exception, stackTrace),
      ),
    );
  }
}
