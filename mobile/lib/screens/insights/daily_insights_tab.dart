import 'package:app/blocs/blocs.dart';
import 'package:app/models/models.dart';
import 'package:app/widgets/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'insights_widgets.dart';

class DailyInsightsTab extends StatelessWidget {
  const DailyInsightsTab({super.key});

  @override
  Widget build(BuildContext context) {
    return AppSafeArea(
      widget: BlocConsumer<DailyInsightsBloc, InsightsState>(
        listenWhen: (previous, current) {
          return (current.insightsStatus == InsightsStatus.error) &&
              current.errorMessage != '';
        },
        listener: (context, state) {
          showSnackBar(context, state.errorMessage);
        },
        builder: (context, state) {
          switch (state.insightsStatus) {
            case InsightsStatus.loading:
              return const InsightsLoadingWidget();
            case InsightsStatus.noInternetConnection:
              return NoInternetConnectionWidget(callBack: () {
                context
                    .read<DailyInsightsBloc>()
                    .add(LoadInsights(frequency: state.frequency));
              });
            case InsightsStatus.noData:
              return NoAirQualityDataWidget(callBack: () {
                context
                    .read<DailyInsightsBloc>()
                    .add(LoadInsights(frequency: state.frequency));
              });
            case InsightsStatus.loaded:
            case InsightsStatus.error:
            case InsightsStatus.refreshing:
              break;
          }

          return AppRefreshIndicator(
            sliverChildDelegate: SliverChildBuilderDelegate(
              (context, index) {
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: ListView(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    children: [
                      InsightsToggleBar(
                        frequency: Frequency.daily,
                        isEmpty: state.historicalCharts.isEmpty,
                        pollutant: state.pollutant,
                      ),
                      const SizedBox(
                        height: 12,
                      ),
                      const DailyInsightsGraph(),
                      const SizedBox(
                        height: 16,
                      ),
                      InsightsActionBar(state.airQualityReading),
                      const SizedBox(
                        height: 32,
                      ),
                    ],
                  ),
                );
              },
              childCount: 1,
            ),
            onRefresh: () {
              context
                  .read<DailyInsightsBloc>()
                  .add(const RefreshInsightsCharts());

              return Future(() => null);
            },
          );
        },
      ),
    );
  }
}
