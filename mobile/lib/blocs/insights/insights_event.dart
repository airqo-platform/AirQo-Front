part of 'insights_bloc.dart';

abstract class InsightsEvent extends Equatable {
  const InsightsEvent();
}

class LoadInsights extends InsightsEvent {
  const LoadInsights({
    this.siteId,
    this.airQualityReading,
    required this.frequency,
  });
  final String? siteId;
  final AirQualityReading? airQualityReading;
  final Frequency frequency;

  @override
  List<Object?> get props => [siteId, airQualityReading, frequency];
}

class RefreshInsightsCharts extends InsightsEvent {
  const RefreshInsightsCharts();

  @override
  List<Object?> get props => [];
}

class SwitchInsightsPollutant extends InsightsEvent {
  const SwitchInsightsPollutant(this.pollutant);
  final Pollutant pollutant;

  @override
  List<Object?> get props => [pollutant];
}

class UpdateHistoricalChartIndex extends InsightsEvent {
  const UpdateHistoricalChartIndex(this.index);
  final int index;

  @override
  List<Object?> get props => [index];
}

class UpdateForecastChartIndex extends InsightsEvent {
  const UpdateForecastChartIndex(this.index);
  final int index;

  @override
  List<Object?> get props => [index];
}

class SetScrolling extends InsightsEvent {
  const SetScrolling(this.scrolling);
  final bool scrolling;
  @override
  List<Object?> get props => [scrolling];
}

class UpdateSelectedInsight extends InsightsEvent {
  const UpdateSelectedInsight(this.selectedInsight);
  final ChartData selectedInsight;

  @override
  List<Object> get props => [selectedInsight];
}

class ClearInsightsTab extends InsightsEvent {
  const ClearInsightsTab();

  @override
  List<Object> get props => [];
}

class ToggleForecast extends InsightsEvent {
  const ToggleForecast();

  @override
  List<Object> get props => [];
}

class DeleteOldInsights extends InsightsEvent {
  const DeleteOldInsights();

  @override
  List<Object> get props => [];
}
