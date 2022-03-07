import 'package:app/constants/config.dart';
import 'package:app/models/notification.dart';
import 'package:app/services/firebase_service.dart';
import 'package:app/services/local_storage.dart';
import 'package:app/utils/extensions.dart';
import 'package:app/widgets/custom_shimmer.dart';
import 'package:app/widgets/custom_widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:provider/provider.dart';

class NotificationPage extends StatefulWidget {
  const NotificationPage({Key? key}) : super(key: key);

  @override
  _NotificationPageState createState() => _NotificationPageState();
}

class _NotificationPageState extends State<NotificationPage> {
  List<UserNotification> _notifications = [];
  bool _isViewNotification = false;
  bool _isLoading = false;
  UserNotification? _selectedNotification;
  final CloudStore _cloudStore = CloudStore();
  final CustomAuth _customAuth = CustomAuth();
  final DBHelper _dbHelper = DBHelper();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        elevation: 0,
        backgroundColor: Config.appBodyColor,
        leading: Padding(
          padding: const EdgeInsets.only(top: 6.5, bottom: 6.5, left: 16),
          child: backButton(context),
        ),
        title: const Text(
          'Notifications',
          style: TextStyle(color: Colors.black),
        ),
      ),
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 500),
        transitionBuilder: (Widget child, Animation<double> animation) {
          return FadeTransition(opacity: animation, child: child);
        },
        child: _renderWidget(),
      ),
    );
  }

  @override
  void initState() {
    super.initState();
    _getNotifications(false);
  }

  Widget mainSection() {
    if (_isLoading) {
      return Container(
          color: Config.appBodyColor,
          child: ListView.builder(
            itemBuilder: (BuildContext context, int index) {
              return placeHolder();
            },
            itemCount: 7,
          ));
    }

    if (_notifications.isEmpty) {
      return Container(
        color: Config.appBodyColor,
        padding: const EdgeInsets.fromLTRB(16.0, 8.0, 16.0, 8.0),
        child: Center(
          child: Text(
            'No notifications',
            style: TextStyle(color: Config.appColor),
          ),
        ),
      );
    }

    return Container(
        color: Config.appBodyColor,
        child: RefreshIndicator(
          color: Config.appColorBlue,
          onRefresh: () async {
            await _getNotifications(true);
          },
          child: ListView.builder(
            itemBuilder: (context, index) => Padding(
              padding: const EdgeInsets.fromLTRB(10, 5, 10, 5),
              child: notificationCard(_notifications[index]),
            ),
            itemCount: _notifications.length,
          ),
        ));
  }

  Widget notificationCard(UserNotification notification) {
    var notificationDate = notification.time;

    if (notificationDate.isNull() ||
        notification.title.isNull() ||
        notification.body.isNull()) {
      return Visibility(
        visible: false,
        child: Container(),
      );
    }

    try {
      notificationDate =
          DateTime.parse(notification.time).notificationDisplayDate();
    } catch (exception, stackTrace) {
      debugPrint('$exception\n$stackTrace');
    }

    return Container(
      padding: const EdgeInsets.fromLTRB(16.0, 24.0, 16.0, 24.0),
      decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.all(Radius.circular(16.0))),
      child: ListTile(
        onTap: () {
          setState(() {
            _selectedNotification = notification;
            _isViewNotification = true;
            updateNotification(notification);
          });
        },
        horizontalTitleGap: 12,
        contentPadding: EdgeInsets.zero,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        tileColor: Colors.white,
        leading: Container(
          padding: const EdgeInsets.all(10.0),
          decoration: BoxDecoration(
            color: Config.appColorPaleBlue,
            shape: BoxShape.circle,
          ),
          child: SvgPicture.asset(
            'assets/icon/airqo_home.svg',
            height: 16,
            width: 24,
            semanticsLabel: 'Search',
          ),
        ),
        trailing: notification.isNew
            ? Container(
                padding: const EdgeInsets.fromLTRB(8.0, 1.0, 8.0, 1.0),
                constraints: const BoxConstraints(
                  maxHeight: 16,
                  maxWidth: 43.35,
                ),
                decoration: BoxDecoration(
                    color: Config.appColorPaleBlue,
                    borderRadius:
                        const BorderRadius.all(Radius.circular(535.87))),
                child: Column(
                  children: [
                    Text(
                      'New',
                      style:
                          TextStyle(fontSize: 10, color: Config.appColorBlue),
                    ),
                  ],
                ))
            : Container(
                constraints: const BoxConstraints(
                  maxHeight: 16,
                  maxWidth: 43.35,
                ),
                child: Column(
                  children: [
                    Text(
                      notificationDate,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style:
                          TextStyle(fontSize: 10, color: Config.appColorBlack),
                    ),
                  ],
                )),
        title: Text(
          notification.title,
          style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: Config.appColorBlack),
        ),
        subtitle: Text(
          notification.body,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
          style: TextStyle(
              fontSize: 12, color: Config.appColorBlack.withOpacity(0.4)),
        ),
      ),
    );
  }

  Widget placeHolder() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16.0, 8.0, 16.0, 8.0),
      child: containerLoadingAnimation(height: 100.0, radius: 16.0),
    );
  }

  Widget singleSection() {
    return AnimatedOpacity(
      opacity: 1.0,
      duration: const Duration(milliseconds: 100),
      child: Container(
        padding: const EdgeInsets.fromLTRB(16.0, 24.0, 16.0, 8.0),
        color: Config.appBodyColor,
        child: Column(
          children: [
            Container(
                padding: const EdgeInsets.all(8.0),
                decoration: const BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.all(Radius.circular(16.0))),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        GestureDetector(
                          onTap: () {
                            setState(() {
                              _isViewNotification = false;
                            });
                          },
                          child: SvgPicture.asset(
                            'assets/icon/close.svg',
                            semanticsLabel: 'Pm2.5',
                            height: 20,
                            width: 20,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(
                      height: 12,
                    ),
                    Container(
                      padding: const EdgeInsets.only(
                          left: 54.0, right: 54.0, bottom: 54.0),
                      child: Column(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(15.0),
                            decoration: BoxDecoration(
                              color: Config.appColorPaleBlue,
                              shape: BoxShape.circle,
                            ),
                            child: SvgPicture.asset(
                              'assets/icon/airqo_home.svg',
                              height: 24,
                              width: 36,
                            ),
                          ),
                          const SizedBox(
                            height: 17,
                          ),
                          Text(
                            _selectedNotification!.title,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Config.appColorBlack),
                          ),
                          const SizedBox(
                            height: 8.0,
                          ),
                          Text(
                            _selectedNotification!.body,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                                fontSize: 14,
                                color: Config.appColorBlack.withOpacity(0.4)),
                          ),
                        ],
                      ),
                    ),
                  ],
                ))
          ],
        ),
      ),
    );
  }

  Future<void> updateNotification(UserNotification notification) async {
    Provider.of<NotificationModel>(context, listen: false).removeAll();
    await _cloudStore.markNotificationAsRead(
        _customAuth.getUserId(), notification.id);
    await _getNotifications(false);
  }

  Future<void> _getNotifications(bool reload) async {
    if (reload) {
      setState(() {
        _isLoading = true;
      });
    }

    var offlineData = await _dbHelper.getUserNotifications();

    if (offlineData.isNotEmpty && mounted) {
      setState(() {
        _notifications = UserNotification.reorderNotifications(offlineData);
      });
    }

    var notifies = await _cloudStore.getNotifications(_customAuth.getUserId());
    if (notifies.isEmpty) {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
      return;
    }

    if (mounted) {
      setState(() {
        _isLoading = false;
        _notifications = UserNotification.reorderNotifications(notifies);
      });
    }

    await _dbHelper.insertUserNotifications(notifies, context);
  }

  Widget _renderWidget() {
    return _isViewNotification ? singleSection() : mainSection();
  }
}
