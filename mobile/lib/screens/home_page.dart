import 'dart:async';

import 'package:animations/animations.dart';
import 'package:app/blocs/blocs.dart';
import 'package:app/models/models.dart';
import 'package:app/screens/profile/profile_view.dart';
import 'package:app/widgets/custom_widgets.dart';
import 'package:app/services/services.dart';
import 'package:app/themes/theme.dart';
import 'package:app/utils/utils.dart';
import 'package:app/widgets/dialogs.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:provider/provider.dart';
import 'package:showcaseview/showcaseview.dart';
import 'for_you_page.dart';

import 'dashboard/dashboard_view.dart';
import 'map/map_view.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  DateTime? _exitTime;
  int _selectedIndex = 0;
  final Connectivity _connectivity = Connectivity();
  late StreamSubscription<ConnectivityResult> _connectivitySubscription;
  late bool refresh;
  late GlobalKey _homeShowcaseKey;
  late GlobalKey _mapShowcaseKey;
  late GlobalKey _profileShowcaseKey;
  late BuildContext _showcaseContext;

  late List<Widget> _widgetOptions;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: CustomColors.appBodyColor,
      body: WillPopScope(
        onWillPop: _onWillPop,
        child: PageTransitionSwitcher(
          transitionBuilder: (
            Widget child,
            Animation<double> primaryAnimation,
            Animation<double> secondaryAnimation,
          ) {
            return FadeThroughTransition(
              animation: primaryAnimation,
              secondaryAnimation: secondaryAnimation,
              child: child,
            );
          },
          child: IndexedStack(
            index: _selectedIndex,
            children: _widgetOptions,
          ),
        ),
      ),
      bottomNavigationBar: Theme(
        data: Theme.of(context).copyWith(
          canvasColor: CustomColors.appBodyColor,
          primaryColor: CustomColors.appColorBlack,
          textTheme: Theme.of(context).textTheme.copyWith(
                caption: TextStyle(
                  color: CustomColors.appColorBlack,
                ),
              ),
        ),
        child: ShowCaseWidget(
          onFinish: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => const ForYouPage(),
              ),
            );
          },
          builder: Builder(
            builder: (context) {
              _showcaseContext = context;

              return BottomNavigationBar(
                selectedIconTheme: Theme.of(context)
                    .iconTheme
                    .copyWith(color: CustomColors.appColorBlue, opacity: 0.3),
                unselectedIconTheme: Theme.of(context)
                    .iconTheme
                    .copyWith(color: CustomColors.appColorBlack, opacity: 0.3),
                items: <BottomNavigationBarItem>[
                  BottomNavigationBarItem(
                    icon: Showcase(
                      showArrow: false,
                      key: _homeShowcaseKey,
                      description: 'Home',
                      child: BottomNavIcon(
                        selectedIndex: _selectedIndex,
                        svg: 'assets/icon/home_icon.svg',
                        label: 'Home',
                        index: 0,
                      ),
                    ),
                    label: '',
                  ),
                  BottomNavigationBarItem(
                    icon: Showcase(
                      key: _mapShowcaseKey,
                      showArrow: false,
                      description: 'This is the AirQo map',
                      child: BottomNavIcon(
                        svg: 'assets/icon/location.svg',
                        selectedIndex: _selectedIndex,
                        label: 'AirQo Map',
                        index: 1,
                      ),
                    ),
                    label: '',
                  ),
                  BottomNavigationBarItem(
                    icon: Stack(
                      children: [
                        Showcase(
                          key: _profileShowcaseKey,
                          showArrow: false,
                          description: 'Access your Profile details here',
                          child: BottomNavIcon(
                            svg: 'assets/icon/profile.svg',
                            selectedIndex: _selectedIndex,
                            label: 'Profile',
                            index: 2,
                          ),
                        ),
                        ValueListenableBuilder<Box>(
                          valueListenable: Hive.box<AppNotification>(
                            HiveBox.appNotifications,
                          ).listenable(),
                          builder: (context, box, widget) {
                            final unreadNotifications = box.values
                                .toList()
                                .cast<AppNotification>()
                                .where((element) => !element.read)
                                .toList();

                            return Positioned(
                              right: 0.0,
                              child: Container(
                                height: 4,
                                width: 4,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: unreadNotifications.isEmpty
                                      ? Colors.transparent
                                      : CustomColors.aqiRed,
                                ),
                              ),
                            );
                          },
                        ),
                      ],
                    ),
                    label: '',
                  ),
                ],
                currentIndex: _selectedIndex,
                selectedItemColor: CustomColors.appColorBlue,
                unselectedItemColor:
                    CustomColors.appColorBlack.withOpacity(0.3),
                elevation: 0.0,
                backgroundColor: CustomColors.appBodyColor,
                onTap: _onItemTapped,
                showSelectedLabels: true,
                showUnselectedLabels: true,
                type: BottomNavigationBarType.fixed,
                selectedFontSize: 10,
                unselectedFontSize: 10,
              );
            },
          ),
        ),
      ),
    );
  }

  Future<void> _initialize() async {
    context.read<DashboardBloc>().add(const RefreshDashboard());
    context.read<MapBloc>().add(const InitializeMapState());
    context.read<SearchBloc>().add(const InitializeSearchPage());
    await checkNetworkConnection(
      context,
      notifyUser: true,
    );
    await SharedPreferencesHelper.updateOnBoardingPage(OnBoardingPage.home);
  }

  @override
  void initState() {
    super.initState();

    _connectivitySubscription =
        _connectivity.onConnectivityChanged.listen((value) {
      switch (value) {
        case ConnectivityResult.wifi:
        case ConnectivityResult.ethernet:
        case ConnectivityResult.mobile:
        case ConnectivityResult.vpn:
          _refresh();
          break;
        case ConnectivityResult.bluetooth:
        case ConnectivityResult.none:
          break;
      }
    });

    _initialize();
    _homeShowcaseKey = GlobalKey();
    _mapShowcaseKey = GlobalKey();
    _profileShowcaseKey = GlobalKey();
    _widgetOptions = <Widget>[
      ShowCaseWidget(
        onFinish: _startShowcase,
        builder: Builder(builder: (context) => const DashboardView()),
      ),
      const MapView(),
      const ProfileView(),
    ];
  }

  @override
  void dispose() {
    _connectivitySubscription.cancel();
    super.dispose();
  }

  void _refresh() {
    context.read<DashboardBloc>().add(const RefreshDashboard());
    context.read<NearbyLocationBloc>().add(const SearchLocationAirQuality());
    context.read<NearbyLocationBloc>().add(const UpdateLocationAirQuality());
    context.read<MapBloc>().add(const InitializeMapState());
    // TODO sync profile
  }

  Future<bool> _onWillPop() {
    final currentPage = _selectedIndex;

    if (currentPage != 0) {
      setState(() => _selectedIndex = 0);

      return Future.value(false);
    }

    final now = DateTime.now();

    if (_exitTime == null ||
        now.difference(_exitTime!) > const Duration(seconds: 2)) {
      _exitTime = now;

      showSnackBar(
        context,
        'Tap again to exit !',
      );

      return Future.value(false);
    }

    return Future.value(true);
  }

  void _onItemTapped(int index) {
    switch (index) {
      case 0:
        context.read<DashboardBloc>().add(const RefreshDashboard());
        break;
      case 1:
        context.read<MapBloc>().add(const InitializeMapState());
        break;
    }

    setState(() => _selectedIndex = index);
  }

  void _startShowcase() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ShowCaseWidget.of(_showcaseContext).startShowCase(
        [
          _homeShowcaseKey,
          _mapShowcaseKey,
          _profileShowcaseKey,
        ],
      );
    });
  }
}
