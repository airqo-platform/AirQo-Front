import 'dart:async';

import 'package:app/models/models.dart';
import 'package:app/services/services.dart';
import 'package:app/utils/utils.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hive_flutter/hive_flutter.dart';
part 'dashboard_event.dart';
part 'dashboard_state.dart';

class DashboardBloc extends Bloc<DashboardEvent, DashboardState> {
  DashboardBloc() : super(const DashboardState.initial()) {
    on<RefreshDashboard>(_onRefreshDashboard);
  }

  Future<void> _updateGreetings(Emitter<DashboardState> emit) async {
    Profile profile = await HiveService.getProfile();
    final greetings = await DateTime.now().getGreetings(profile);
    emit(state.copyWith(greetings: greetings));
  }

  void _loadAirQualityReadings(Emitter<DashboardState> emit) {
    List<AirQualityReading> airQualityCards = <AirQualityReading>[];

    List<AirQualityReading> nearbyAirQualityReadings =
        Hive.box<AirQualityReading>(HiveBox.nearByAirQualityReadings)
            .values
            .toList()
            .sortByDistanceToReferenceSite();

    if (nearbyAirQualityReadings.length > 1) {
      nearbyAirQualityReadings.removeAt(0);
      airQualityCards.add(nearbyAirQualityReadings.first);
    }

    List<AirQualityReading> airQualityReadings =
        Hive.box<AirQualityReading>(HiveBox.airQualityReadings).values.toList();

    airQualityReadings.removeWhere((element) => airQualityCards
        .map((e) => e.placeId)
        .toList()
        .contains(element.placeId));

    final List<String> countries =
        airQualityReadings.map((e) => e.country).toSet().toList();

    for (final country in countries) {
      List<AirQualityReading> countryReadings = airQualityReadings
          .where((element) => element.country.equalsIgnoreCase(country))
          .toList();
      countryReadings.shuffle();
      airQualityCards.addAll(countryReadings.take(2));
    }

    airQualityCards = airQualityCards.shuffleByCountry();

    return emit(
      state.copyWith(
        airQualityReadings: airQualityCards,
        status: airQualityCards.isEmpty
            ? DashboardStatus.error
            : DashboardStatus.loaded,
        error: airQualityCards.isEmpty
            ? DashboardError.noAirQuality
            : DashboardError.none,
      ),
    );
  }

  Future<void> _onRefreshDashboard(
    RefreshDashboard event,
    Emitter<DashboardState> emit,
  ) async {
    if (event.reload ?? false) {
      emit(const DashboardState.initial());
      _loadAirQualityReadings(emit);
    }

    await _updateGreetings(emit);
    final hasConnection = await hasNetworkConnection();
    if (!hasConnection && state.airQualityReadings.isEmpty) {
      return emit(
        state.copyWith(
          status: DashboardStatus.error,
          error: DashboardError.noInternetConnection,
        ),
      );
    }

    emit(
      state.copyWith(
        status: state.airQualityReadings.isEmpty
            ? DashboardStatus.loading
            : DashboardStatus.refreshing,
      ),
    );

    await Future.wait([
      AppService().refreshAirQualityReadings(),
      AppService().updateFavouritePlacesReferenceSites(),
    ]).whenComplete(() => _loadAirQualityReadings(emit));
  }
}
