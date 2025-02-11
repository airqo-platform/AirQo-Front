import 'package:http/http.dart' as http;
import 'package:loggy/loggy.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class SlackLoggyPrinter extends LoggyPrinter {
  const SlackLoggyPrinter();

  @override
  void onLog(LogRecord record) {
    final time = record.time.toIso8601String();
    final level = record.level.toString();
    final message = record.message;
    
    print('$time $level: $message');
    
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
  final url = dotenv.env['SLACK_WEBHOOK_URL'];
  
  await http.post(Uri.parse(url!), body: '{"text": "$message"}', headers: {'Content-Type': 'application/json'});
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