import 'package:app/constants/config.dart';
import 'package:app/models/profile.dart';
import 'package:app/screens/home_page.dart';
import 'package:app/utils/exception.dart';
import 'package:app/utils/extensions.dart';
import 'package:app/widgets/buttons.dart';
import 'package:app/widgets/custom_shimmer.dart';
import 'package:app/widgets/dialogs.dart';
import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/material.dart';

import '../../models/enum_constants.dart';
import '../../services/local_storage.dart';
import '../../themes/app_theme.dart';
import 'notifications_setup_screen.dart';
import 'on_boarding_widgets.dart';

class ProfileSetupScreen extends StatefulWidget {
  const ProfileSetupScreen({Key? key}) : super(key: key);

  @override
  ProfileSetupScreenState createState() => ProfileSetupScreenState();
}

class ProfileSetupScreenState extends State<ProfileSetupScreen> {
  String _fullName = '';
  DateTime? _exitTime;
  Color nextBtnColor = Config.appColorDisabled;
  bool _showDropDown = false;
  late Profile _profile;

  final _formKey = GlobalKey<FormState>();
  bool _showOptions = true;
  final TextEditingController _controller = TextEditingController();
  late BuildContext dialogContext;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Config.appBodyColor,
        body: WillPopScope(
          onWillPop: onWillPop,
          child: Container(
            padding: const EdgeInsets.only(left: 24, right: 24),
            child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  const SizedBox(
                    height: 56,
                  ),
                  Center(
                    child: Text(
                      'Great!\nPlease enter your name?',
                      textAlign: TextAlign.center,
                      style: CustomTextStyle.headline7(context),
                    ),
                  ),
                  const SizedBox(
                    height: 32,
                  ),
                  SizedBox(
                    height: 48,
                    child: Row(
                      children: <Widget>[
                        TitleDropDown(
                          showTileOptionsCallBack: _showTileOptionsCallBack,
                          profile: _profile,
                        ),
                        const SizedBox(
                          width: 16,
                        ),
                        Form(
                          key: _formKey,
                          child: Flexible(
                            child: ProfileSetupNameInputField(
                              showTileOptionsCallBack: _showTileOptionsCallBack,
                              nameChangeCallBack: _nameChangeCallBack,
                              controller: _controller,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(
                    height: 8,
                  ),
                  Visibility(
                    visible: _showDropDown,
                    child: Container(
                        padding: const EdgeInsets.only(left: 10, right: 10),
                        decoration: BoxDecoration(
                            color: const Color(0xffF4F4F4),
                            borderRadius: BorderRadius.circular(8)),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                              vertical: 12, horizontal: 12),
                          child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.start,
                              mainAxisSize: MainAxisSize.max,
                              children: _getTitleOptions()),
                        )),
                  ),
                  const Spacer(),
                  GestureDetector(
                    onTap: () async {
                      await _saveName();
                    },
                    child: NextButton(buttonColor: nextBtnColor),
                  ),
                  SizedBox(
                    height: _showOptions ? 16 : 12,
                  ),
                  Visibility(
                    visible: _showOptions,
                    child: GestureDetector(
                      onTap: () {
                        Navigator.pushAndRemoveUntil(context,
                            MaterialPageRoute(builder: (context) {
                          return const NotificationsSetupScreen();
                        }), (r) => false);
                      },
                      child: Center(
                        child: Text(
                          'No, thanks',
                          textAlign: TextAlign.center,
                          style: Theme.of(context)
                              .textTheme
                              .caption
                              ?.copyWith(color: Config.appColorBlue),
                        ),
                      ),
                    ),
                  ),
                  Visibility(
                    visible: _showOptions,
                    child: const SizedBox(
                      height: 40,
                    ),
                  ),
                ]),
          ),
        ));
  }

  List<GestureDetector> _getTitleOptions() {
    var options = <GestureDetector>[];

    for (var option in TitleOptions.values) {
      options.add(GestureDetector(
        onTap: () {
          _updateTitleCallback(option.getValue());
        },
        child: AutoSizeText(
          option.getDisplayName(),
          style: Theme.of(context).textTheme.bodyText1?.copyWith(
              color: _profile.title == option.getValue()
                  ? Config.appColorBlack
                  : Config.appColorBlack.withOpacity(0.32)),
        ),
      ));
    }
    return options;
  }

  void _initialize() async {
    _profile = await Profile.getProfile();
  }

  @override
  void initState() {
    super.initState();
    dialogContext = context;
    _initialize();
    updateOnBoardingPage();
  }

  void _showTileOptionsCallBack(bool showTitleOptions) {
    setState(() => _showOptions = showTitleOptions);
  }

  void _nameChangeCallBack(String name) {
    if (name.toString().isEmpty || name.toString() == '') {
      if (_fullName == '') {
        FocusScope.of(context).unfocus();
      }
      setState(() {
        _fullName = '';
        _controller.text = '';
        nextBtnColor = Config.appColorDisabled;
        _controller.text = '';
      });
    } else {
      setState(() {
        nextBtnColor = Config.appColorBlue;
        _fullName = name;
      });
    }
  }

  Future<bool> onWillPop() {
    var now = DateTime.now();

    if (_exitTime == null ||
        now.difference(_exitTime!) > const Duration(seconds: 2)) {
      _exitTime = now;

      showSnackBar(context, 'Tap again to exit !');
      return Future.value(false);
    }

    Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (context) {
      return const HomePage();
    }), (r) => false);

    return Future.value(false);
  }

  Future<void> _saveName() async {
    try {
      if (_formKey.currentState!.validate()) {
        loadingScreen(dialogContext);

        FocusScope.of(context).requestFocus(FocusNode());
        Future.delayed(const Duration(milliseconds: 250), () {
          setState(() => _showOptions = true);
        });

        setState(() {
          nextBtnColor = Config.appColorDisabled;
          _profile
            ..firstName = Profile.getNames(_fullName).first
            ..lastName = Profile.getNames(_fullName).last;
        });

        await _profile.update();

        Navigator.pop(dialogContext);
        await Navigator.pushAndRemoveUntil(context,
            MaterialPageRoute(builder: (context) {
          return const NotificationsSetupScreen();
        }), (r) => false);
      }
    } on Exception catch (exception, stackTrace) {
      Navigator.pop(dialogContext);
      setState(() {
        nextBtnColor = Config.appColorBlue;
      });
      await showSnackBar(context, 'Failed to update profile. Try again later');
      await logException(exception, stackTrace);
    }
  }

  void updateOnBoardingPage() async {
    await SharedPreferencesHelper.updateOnBoardingPage(OnBoardingPage.profile);
  }

  void _updateTitleCallback(String text) {
    setState(() {
      _profile.title = text;
      _showDropDown = false;
    });
  }
}
