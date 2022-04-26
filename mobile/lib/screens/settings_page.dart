import 'package:app/auth/phone_reauthenticate_screen.dart';
import 'package:app/constants/config.dart';
import 'package:app/screens/web_view_page.dart';
import 'package:app/services/app_service.dart';
import 'package:app/utils/dialogs.dart';
import 'package:app/widgets/custom_shimmer.dart';
import 'package:app/widgets/custom_widgets.dart';
import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../auth/email_reauthenticate_screen.dart';
import '../auth/phone_auth_widget.dart';
import 'about_page.dart';
import 'feedback_page.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({Key? key}) : super(key: key);

  @override
  _SettingsPageState createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  bool _allowNotification = false;
  bool _allowLocation = false;

  final AppService _appService = AppService();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: appTopBar(context: context, title: 'Settings'),
        body: Container(
            color: Config.appBodyColor,
            padding:
                const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                const SizedBox(
                  height: 31,
                ),
                _settingsSection(),
                const Spacer(),
                Visibility(
                  visible: _appService.isLoggedIn(),
                  child: _deleteAccountSection(),
                ),
                const SizedBox(
                  height: 32,
                ),
              ],
            )));
  }

  @override
  void initState() {
    super.initState();
    _initialize();
  }

  void showConfirmationDialog(BuildContext context) {
    Widget okButton = TextButton(
      child: const Text('Yes'),
      onPressed: _deleteAccount,
    );

    Widget cancelButton = TextButton(
      child: const Text('No'),
      onPressed: () {
        Navigator.of(context).pop();
      },
    );

    var alert = AlertDialog(
      title: const Text('Delete Account'),
      content: const Text('Are you sure toy want to delete your account ? '),
      actions: [okButton, cancelButton],
    );

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return alert;
      },
    );
  }

  Widget _cardSection(String text) {
    return Container(
        height: 56,
        decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.all(Radius.circular(0.0))),
        child: ListTile(
          title: Text(text,
              overflow: TextOverflow.ellipsis,
              style: Theme.of(context).textTheme.bodyText1),
        ));
  }

  Future<void> _deleteAccount() async {
    var user = _appService.customAuth.getUser();
    var dialogContext = context;

    if (user == null) {
      await showSnackBar(context, Config.appErrorMessage);
      return;
    }

    bool authResponse;
    var userDetails = await _appService.getUserDetails();
    if (user.email != null) {
      userDetails.emailAddress = user.email!;
      authResponse =
          await Navigator.push(context, MaterialPageRoute(builder: (context) {
        return EmailReAuthenticateScreen(userDetails);
      }));
    } else if (user.phoneNumber != null) {
      userDetails.phoneNumber = user.phoneNumber!;
      authResponse =
          await Navigator.push(context, MaterialPageRoute(builder: (context) {
        return PhoneReAuthenticateScreen(userDetails);
      }));
    } else {
      authResponse = false;
    }

    if (authResponse) {
      loadingScreen(dialogContext);

      var success = await _appService.deleteAccount(context);
      if (success) {
        Navigator.pop(dialogContext);
        await Navigator.pushAndRemoveUntil(context,
            MaterialPageRoute(builder: (context) {
          return const PhoneSignUpWidget();
        }), (r) => false);
      } else {
        await showSnackBar(
            context,
            'Failed to delete account. '
            'Try again later');
      }
    } else {
      await showSnackBar(
          context,
          'Authentication failed '
          'Try again later');
    }
  }

  Widget _deleteAccountSection() {
    return GestureDetector(
      onTap: _deleteAccount,
      child: Container(
          height: 56,
          decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.all(Radius.circular(8.0))),
          child: ListTile(
            title: AutoSizeText(
              'Delete your account',
              overflow: TextOverflow.ellipsis,
              style: Theme.of(context)
                  .textTheme
                  .bodyText2
                  ?.copyWith(color: Config.appColorBlack.withOpacity(0.6)),
            ),
          )),
    );
  }

  Future<void> _initialize() async {
    await _appService.notificationService.checkPermission().then((value) => {
          setState(() {
            _allowNotification = value;
          }),
        });

    await _appService.locationService.checkPermission().then((value) => {
          setState(() {
            _allowLocation = value;
          }),
        });
  }

  Widget _settingsSection() {
    return Container(
      padding: const EdgeInsets.only(top: 10, bottom: 10),
      decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.all(Radius.circular(8.0))),
      child: Column(
        children: [
          ListTile(
            title: Text('Location',
                overflow: TextOverflow.ellipsis,
                style: Theme.of(context).textTheme.bodyText1),
            trailing: CupertinoSwitch(
              activeColor: Config.appColorBlue,
              onChanged: (bool value) {
                if (value) {
                  _appService.locationService
                      .allowLocationAccess()
                      .then((response) => {
                            setState(() {
                              _allowLocation = response;
                            })
                          });
                } else {
                  _appService.locationService
                      .revokePermission()
                      .then((response) => {
                            setState(() {
                              _allowLocation = response;
                            })
                          });
                }
              },
              value: _allowLocation,
            ),
          ),
          Divider(
            color: Config.appBodyColor,
          ),
          ListTile(
            title: Text('Notification',
                overflow: TextOverflow.ellipsis,
                style: Theme.of(context).textTheme.bodyText1),
            trailing: CupertinoSwitch(
              activeColor: Config.appColorBlue,
              onChanged: (bool value) {
                if (value) {
                  _appService.notificationService
                      .allowNotifications()
                      .then((response) => {
                            setState(() {
                              _allowNotification = response;
                            })
                          });
                } else {
                  _appService.notificationService
                      .revokePermission()
                      .then((response) => {
                            setState(() {
                              _allowNotification = response;
                            })
                          });
                }
              },
              value: _allowNotification,
            ),
          ),
          Divider(
            color: Config.appBodyColor,
          ),
          GestureDetector(
            onTap: () async {
              await Navigator.push(context,
                  MaterialPageRoute(builder: (context) {
                return WebViewScreen(
                  url: Config.faqsUrl,
                  title: 'AirQo FAQs',
                );
              }));
            },
            child: _cardSection('FAQs'),
          ),
          Divider(
            color: Config.appBodyColor,
          ),
          GestureDetector(
            onTap: () async {
              await Navigator.push(context,
                  MaterialPageRoute(builder: (context) {
                return const FeedbackPage();
              }));
            },
            child: _cardSection('Send feedback'),
          ),
          Divider(
            color: Config.appBodyColor,
          ),
          GestureDetector(
            onTap: () async {
              await _appService.rateService.rateApp();
            },
            child: _cardSection('Rate the AirQo App'),
          ),
          Divider(
            color: Config.appBodyColor,
          ),
          GestureDetector(
            onTap: () async {
              await Navigator.push(context,
                  MaterialPageRoute(builder: (context) {
                return const AboutAirQo();
              }));
            },
            child: _cardSection('About'),
          ),
        ],
      ),
    );
  }
}
