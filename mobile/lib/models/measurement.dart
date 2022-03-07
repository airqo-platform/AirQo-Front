import 'package:app/models/site.dart';
import 'package:json_annotation/json_annotation.dart';

import 'json_parsers.dart';
import 'measurement_value.dart';

part 'measurement.g.dart';

@JsonSerializable()
class Measurement {
  @JsonKey(required: true)
  String time;

  @JsonKey(required: true)
  final MeasurementValue pm2_5;

  @JsonKey(required: true)
  final MeasurementValue pm10;

  @JsonKey(required: false, fromJson: measurementValueFromJson)
  final MeasurementValue altitude;

  @JsonKey(required: false, fromJson: measurementValueFromJson)
  final MeasurementValue speed;

  @JsonKey(
      required: false,
      name: 'externalTemperature',
      fromJson: measurementValueFromJson)
  final MeasurementValue temperature;

  @JsonKey(
      required: false,
      name: 'externalHumidity',
      fromJson: measurementValueFromJson)
  final MeasurementValue humidity;

  @JsonKey(required: true, name: 'siteDetails')
  final Site site;

  @JsonKey(required: true, name: 'device_number')
  final int deviceNumber;

  Measurement(this.time, this.pm2_5, this.pm10, this.altitude, this.speed,
      this.temperature, this.humidity, this.site, this.deviceNumber);

  factory Measurement.fromJson(Map<String, dynamic> json) =>
      _$MeasurementFromJson(json);

  String getHumidityValue() {
    var humidityValue = humidity.value.round();
    if (humidity.value <= 0.99) {
      humidityValue = (humidity.value * 100).round();
    }
    return '$humidityValue%';
  }

  double getPm10Value() {
    if (pm10.calibratedValue == -0.1) {
      return double.parse(pm10.value.toStringAsFixed(2));
    }
    return double.parse(pm10.calibratedValue.toStringAsFixed(2));
  }

  double getPm2_5Value() {
    if (pm2_5.calibratedValue == -0.1) {
      return double.parse(pm2_5.value.toStringAsFixed(2));
    }
    return double.parse(pm2_5.calibratedValue.toStringAsFixed(2));
  }

  Map<String, dynamic> toJson() => _$MeasurementToJson(this);

  @override
  String toString() {
    return 'Measurement{time: $time, pm2_5: $pm2_5, pm10: $pm10,'
        ' site: $site, deviceNumber: $deviceNumber}';
  }

  static String createTableStmt() =>
      'CREATE TABLE IF NOT EXISTS ${latestMeasurementsDb()}('
      '${Site.dbId()} TEXT PRIMARY KEY, ${Site.dbLatitude()} REAL, '
      '${Site.dbSiteName()} TEXT, ${Site.dbLongitude()} REAL, '
      '${dbTime()} TEXT, ${dbPm25()} REAL, ${Site.dbCountry()} TEXT, '
      '${dbPm10()} REAL, ${dbDeviceNumber()} REAL, ${dbAltitude()} REAL, '
      '${dbSpeed()} REAL, ${dbTemperature()} REAL, '
      '${dbHumidity()} REAL, ${Site.dbDistrict()} TEXT, '
      '${Site.dbDescription()} TEXT, ${Site.dbRegion()} TEXT )';

  static String dbAltitude() => 'altitude';

  static String dbDeviceNumber() => 'deviceNumber';

  static String dbHumidity() => 'humidity';

  static String dbPm10() => 'pm10';

  static String dbPm25() => 'pm2_5';

  static String dbSpeed() => 'speed';

  static String dbTemperature() => 'temperature';

  static String dbTime() => 'time';

  static String dropTableStmt() =>
      'DROP TABLE IF EXISTS ${latestMeasurementsDb()}';

  static String latestMeasurementsDb() => 'latest_measurements';

  static Map<String, dynamic> mapFromDb(Map<String, dynamic> json) {
    var siteDetails = Site.fromDbMap(json);

    return {
      'siteDetails': siteDetails,
      'time': json[dbTime()] as String,
      'pm2_5': {'value': json[dbPm25()] as double},
      'pm10': {'value': json[dbPm10()] as double},
      'externalTemperature': {'value': json[dbTemperature()] as double},
      'externalHumidity': {'value': json[dbHumidity()] as double},
      'speed': {'value': json[dbSpeed()] as double},
      'altitude': {'value': json[dbAltitude()] as double},
      'device_number': (json[dbDeviceNumber()] as double).round(),
    };
  }

  static Map<String, dynamic> mapToDb(Measurement measurement) {
    var measurementMap = Site.toDbMap(measurement.site)
      ..addAll({
        dbTime(): measurement.time,
        dbPm25(): measurement.getPm2_5Value(),
        dbPm10(): measurement.getPm10Value(),
        dbAltitude(): measurement.altitude.value,
        dbSpeed(): measurement.speed.value,
        dbTemperature(): measurement.temperature.value,
        dbHumidity(): measurement.humidity.value,
        dbDeviceNumber(): measurement.deviceNumber,
      });

    return measurementMap;
  }
}

extension ParseMeasurement on Measurement {
  String getTempValue() {
    var tempValue = temperature.value.toStringAsFixed(2);

    return '$tempValue\u2103';
  }

  bool hasWeatherData() {
    if (humidity.value != -0.1 &&
        temperature.value != -0.1 &&
        humidity.value != 0.0 &&
        temperature.value != 0.0) {
      return true;
    }
    return false;
  }
}
