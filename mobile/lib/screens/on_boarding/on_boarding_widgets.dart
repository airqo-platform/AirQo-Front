import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

import '../../models/enum_constants.dart';
import '../../models/profile.dart';
import '../../themes/colors.dart';
import '../../widgets/text_fields.dart';

OnBoardingPage getOnBoardingPageConstant(String value) {
  switch (value) {
    case 'signup':
      return OnBoardingPage.signup;
    case 'profile':
      return OnBoardingPage.profile;
    case 'notification':
      return OnBoardingPage.notification;
    case 'location':
      return OnBoardingPage.location;
    case 'complete':
      return OnBoardingPage.complete;
    case 'home':
      return OnBoardingPage.home;
    case 'welcome':
      return OnBoardingPage.welcome;
    default:
      return OnBoardingPage.signup;
  }
}

class OnBoardingAppBar extends StatelessWidget implements PreferredSizeWidget {
  const OnBoardingAppBar({Key? key}) : super(key: key);

  @override
  PreferredSizeWidget build(BuildContext context) {
    return AppBar(
      automaticallyImplyLeading: false,
      elevation: 0,
      toolbarHeight: 0,
      backgroundColor: CustomColors.appBodyColor,
    );
  }

  @override
  Size get preferredSize => Size.zero;
}

class OnBoardingLocationIcon extends StatelessWidget {
  const OnBoardingLocationIcon({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: AlignmentDirectional.center,
      children: [
        Image.asset(
          'assets/icon/floating_bg.png',
          fit: BoxFit.fitWidth,
          width: double.infinity,
        ),
        Image.asset(
          'assets/icon/enable_location_icon.png',
          height: 221,
        ),
      ],
    );
  }
}

class OnBoardingNotificationIcon extends StatelessWidget {
  const OnBoardingNotificationIcon({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: AlignmentDirectional.center,
      children: [
        Image.asset(
          'assets/icon/floating_bg.png',
          fit: BoxFit.fitWidth,
          width: double.infinity,
        ),
        SvgPicture.asset(
          'assets/icon/enable_notifications_icon.svg',
          height: 221,
        ),
      ],
    );
  }
}

class ProfileSetupNameInputField extends StatelessWidget {
  const ProfileSetupNameInputField(
      {Key? key,
      required this.nameChangeCallBack,
      required this.showTileOptionsCallBack,
      this.controller})
      : super(key: key);
  final Function(String) nameChangeCallBack;
  final Function(bool) showTileOptionsCallBack;
  final TextEditingController? controller;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      onTap: () => showTileOptionsCallBack(false),
      onEditingComplete: () async {
        FocusScope.of(context).requestFocus(FocusNode());
        Future.delayed(const Duration(milliseconds: 250), () {
          showTileOptionsCallBack(true);
        });
      },
      enableSuggestions: false,
      cursorWidth: 1,
      cursorColor: CustomColors.appColorBlue,
      keyboardType: TextInputType.name,
      onChanged: nameChangeCallBack,
      validator: (value) {
        if (value == null || value.isEmpty) {
          return 'Please enter your name';
        }
        return null;
      },
      decoration: InputDecoration(
        contentPadding: const EdgeInsets.fromLTRB(16, 12, 0, 12),
        focusedBorder: OutlineInputBorder(
          borderSide: BorderSide(color: CustomColors.appColorBlue, width: 1.0),
          borderRadius: BorderRadius.circular(8.0),
        ),
        enabledBorder: OutlineInputBorder(
          borderSide: BorderSide(color: CustomColors.appColorBlue, width: 1.0),
          borderRadius: BorderRadius.circular(8.0),
        ),
        border: OutlineInputBorder(
            borderSide:
                BorderSide(color: CustomColors.appColorBlue, width: 1.0),
            borderRadius: BorderRadius.circular(8.0)),
        hintText: 'Enter your name',
        errorStyle: const TextStyle(
          fontSize: 0,
        ),
        suffixIcon: GestureDetector(
          onTap: () => nameChangeCallBack(''),
          child: const TextInputCloseButton(),
        ),
      ),
    );
  }
}

class TitleDropDown extends StatelessWidget {
  const TitleDropDown(
      {Key? key, required this.showTileOptionsCallBack, required this.profile})
      : super(key: key);
  final Function(bool) showTileOptionsCallBack;
  final Profile profile;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => showTileOptionsCallBack(true),
      child: Container(
          width: 70,
          padding:
              const EdgeInsets.only(left: 10, right: 10, top: 15, bottom: 15),
          decoration: BoxDecoration(
              color: const Color(0xffF4F4F4),
              borderRadius: BorderRadius.circular(8)),
          child: Center(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('${profile.title.substring(0, 2)}.'),
                const Icon(
                  Icons.keyboard_arrow_down_sharp,
                  color: Colors.black,
                ),
              ],
            ),
          )),
    );
  }
}

class LogoWidget extends StatelessWidget {
  const LogoWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SvgPicture.asset(
        'assets/icon/splash_image.svg',
        semanticsLabel: 'Splash image',
      ),
    );
  }
}

class TaglineWidget extends StatelessWidget {
  const TaglineWidget({Key? key, required this.visible}) : super(key: key);
  final bool visible;

  @override
  Widget build(BuildContext context) {
    return AnimatedOpacity(
      opacity: visible ? 1.0 : 0.0,
      duration: const Duration(milliseconds: 500),
      child: Center(
        child: Stack(alignment: AlignmentDirectional.center, children: [
          Image.asset(
            'assets/images/splash-image.png',
            fit: BoxFit.cover,
            height: double.infinity,
            width: double.infinity,
            alignment: Alignment.center,
          ),
          Text(
            'Breathe\nClean.',
            textAlign: TextAlign.center,
            style: Theme.of(context)
                .textTheme
                .headline4
                ?.copyWith(color: Colors.white),
          ),
        ]),
      ),
    );
  }
}
