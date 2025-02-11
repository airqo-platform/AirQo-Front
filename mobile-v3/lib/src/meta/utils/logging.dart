import 'package:http/http.dart' as http;
import 'package:loggy/loggy.dart';

class SlackLoggyPrinter extends LoggyPrinter {
  const SlackLoggyPrinter();

  @override
  void onLog(LogRecord record) {
    final time = record.time.toIso8601String();
    final level = record.level.toString();
    final message = record.message;
    
    // Print to console first
    print('$time $level: $message');
    
    // Send errors to Slack
    if (record.level == LogLevel.error) {
      sendErrorToSlack(
        message,
        record.error,
        record.stackTrace ?? StackTrace.current,
      );
    }
  }
}


Future<void> sendErrorToSlack(String message, dynamic error, StackTrace stackTrace) async {
  final url = 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK';
  
  await http.post(Uri.parse(url), body: '{"text": "$message"}', headers: {'Content-Type': 'application/json'});
}


void initializeLogging() {
  Loggy.initLoggy(
    logPrinter: const SlackLoggyPrinter(),
    logOptions: const LogOptions(
      LogLevel.all,
      stackTraceLevel: LogLevel.error,
    ),
  );
}