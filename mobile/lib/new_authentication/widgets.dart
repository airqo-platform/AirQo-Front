import 'package:app/constants/config.dart';
import 'package:app/screens/home_page.dart';
import 'package:app/services/app_service.dart';
import 'package:app/services/firebase_service.dart';
import 'package:app/themes/colors.dart';
import 'package:app/utils/network.dart';
import 'package:app/widgets/custom_shimmer.dart';
import 'package:app/widgets/dialogs.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_svg/svg.dart';
import 'package:intl_phone_field/intl_phone_field.dart';

class StackedWidgets extends StatelessWidget {
  final List<Widget> items;
  final TextDirection direction;
  final double size;
  final double xShift;

  const StackedWidgets({
    super.key,
    required this.items,
    this.direction = TextDirection.ltr,
    this.size = 100,
    this.xShift = 20,
  });

  @override
  Widget build(BuildContext context) {
    final allItems = items
        .asMap()
        .map((index, item) {
          final left = size - xShift;

          final value = Container(
            width: size,
            height: size,
            margin: EdgeInsets.only(left: left * index),
            child: item,
          );

          return MapEntry(index, value);
        })
        .values
        .toList();

    return Stack(
      children: direction == TextDirection.ltr
          ? allItems.reversed.toList()
          : allItems,
    );
  }
}

class NextButton extends StatelessWidget {
  const NextButton({
    super.key,
    this.buttonColor,
    this.textColor,
    required this.callBack,
    this.text,
    this.showIcon = false,
  });
  final String? text;
  final bool showIcon;
  final Color? buttonColor;
  final Function callBack;
  final Color? textColor;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: OutlinedButton(
        onPressed: () {
          callBack();
        },
        style: OutlinedButton.styleFrom(
          elevation: 0,
          side: const BorderSide(
            color: Colors.transparent,
          ),
          shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.all(
              Radius.circular(8),
            ),
          ),
          backgroundColor: buttonColor ?? const Color(0xff145FFF),
          foregroundColor: buttonColor ?? const Color(0xff145FFF),
          padding: const EdgeInsets.symmetric(
            vertical: 15,
            horizontal: 10,
          ),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              text ?? AppLocalizations.of(context)!.next,
              textAlign: TextAlign.center,
              style: TextStyle(
                color: textColor ?? Colors.white,
              ),
            ),
            Visibility(
              visible: showIcon,
              child: Padding(
                padding: const EdgeInsets.only(left: 11),
                child: SvgPicture.asset(
                  'assets/icon/next_arrow.svg',
                  semanticsLabel: 'Share',
                  height: 17.42,
                  width: 10.9,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class NameEditField extends StatelessWidget {
  const NameEditField({
    super.key,
    required this.label,
    required this.valueChange,
    required this.hintText,
    required this.focusedBorderColor,
    required this.fillColor,
    this.errorText,
    required this.controller,
  });

  final String label;
  final Function(String) valueChange;
  final String hintText;
  final Color? focusedBorderColor;
  final Color? fillColor;
  final String? errorText;
  final TextEditingController controller;

  @override
  Widget build(BuildContext context) {
    final nameRegex = RegExp(r'^[a-zA-Z ]+$');
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
          child: Text(
            label,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Color(0xff4B4E56),
            ),
          ),
        ),
        TextFormField(
          controller: controller,
          enableSuggestions: false,
          cursorWidth: 1,
          cursorColor: Theme.of(context).dividerColor,
          keyboardType: TextInputType.name,
          decoration: InputDecoration(
            filled: true,
            fillColor: fillColor,
            hintText: hintText,
            focusedBorder: OutlineInputBorder(
              borderSide: BorderSide(
                color: errorText != null
                    ? Theme.of(context).colorScheme.error
                    : focusedBorderColor ?? Colors.transparent,
                width: 2.5,
              ),
              borderRadius: BorderRadius.circular(8.0),
            ),
            enabledBorder: OutlineInputBorder(
              borderSide: BorderSide(
                color: errorText != null
                    ? Theme.of(context).colorScheme.error.withOpacity(0.5)
                    : Colors.transparent,
                width: 1.0,
              ),
              borderRadius: BorderRadius.circular(8.0),
            ),
            errorText: errorText,
          ),
          validator: (value) {
            if (value!.isEmpty) {
              return 'Please enter a name';
            }
            if (!nameRegex.hasMatch(value)) {
              return errorText ?? 'Please enter a valid name without symbols';
            }
            return null;
          },
          onFieldSubmitted: valueChange,
          onChanged: valueChange,
        ),
      ],
    );
  }
}

class DateEditField extends StatelessWidget {
  const DateEditField({
    super.key,
    required this.label,
    required this.valueChange,
    required this.hintText,
    required this.focusedBorderColor,
    required this.fillColor,
    this.errorText,
    required this.controller,
  });

  final String label;
  final Function(String) valueChange;
  final String hintText;
  final Color? focusedBorderColor;
  final Color? fillColor;
  final String? errorText;
  final TextEditingController controller;

  @override
  Widget build(BuildContext context) {
    final dateRegex = RegExp(r'^\d{4}•\d{2}•\d{2}$');
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
          child: Text(
            label,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Color(0xff4B4E56),
            ),
          ),
        ),
        TextFormField(
          controller: controller,
          enableSuggestions: false,
          cursorWidth: 1,
          cursorColor: Theme.of(context).dividerColor,
          keyboardType: TextInputType.datetime,
          decoration: InputDecoration(
            filled: true,
            fillColor: fillColor,
            hintText: hintText,
            focusedBorder: OutlineInputBorder(
              borderSide: BorderSide(
                color: errorText != null
                    ? Theme.of(context).colorScheme.error
                    : focusedBorderColor ?? Colors.transparent,
                width: 2.5,
              ),
              borderRadius: BorderRadius.circular(8.0),
            ),
            enabledBorder: OutlineInputBorder(
              borderSide: BorderSide(
                color: errorText != null
                    ? Theme.of(context).colorScheme.error.withOpacity(0.5)
                    : Colors.transparent,
                width: 1.0,
              ),
              borderRadius: BorderRadius.circular(8.0),
            ),
            errorText: errorText,
          ),
          validator: (value) {
            if (value!.isEmpty) {
              return 'Please enter your birthday';
            }
            if (!dateRegex.hasMatch(value)) {
              return errorText ??
                  'Please enter a valid date in DD  •  MM  •  YEAR format';
            }
            return null;
          },
          onFieldSubmitted: valueChange,
          onChanged: valueChange,
        ),
      ],
    );
  }
}

class EmailEditField extends StatelessWidget {
  const EmailEditField({
    super.key,
    required this.label,
    required this.valueChange,
    required this.hintText,
    required this.focusedBorderColor,
    required this.fillColor,
    this.errorText,
    required this.controller,
  });

  final String label;
  final Function(String) valueChange;
  final String hintText;
  final Color? focusedBorderColor;
  final Color? fillColor;
  final String? errorText;
  final TextEditingController controller;

  @override
  Widget build(BuildContext context) {
    final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
          child: Text(
            label,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Color(0xff4B4E56),
            ),
          ),
        ),
        TextFormField(
          controller: controller,
          enableSuggestions: false,
          cursorWidth: 1,
          cursorColor: Theme.of(context).dividerColor,
          keyboardType: TextInputType.emailAddress,
          decoration: InputDecoration(
            filled: true,
            fillColor: fillColor,
            hintText: hintText,
            focusedBorder: OutlineInputBorder(
              borderSide: BorderSide(
                color: errorText != null
                    ? Theme.of(context).colorScheme.error
                    : focusedBorderColor ?? Colors.transparent,
                width: 2.5,
              ),
              borderRadius: BorderRadius.circular(8.0),
            ),
            enabledBorder: OutlineInputBorder(
              borderSide: BorderSide(
                color: errorText != null
                    ? Theme.of(context).colorScheme.error.withOpacity(0.5)
                    : Colors.transparent,
                width: 1.0,
              ),
              borderRadius: BorderRadius.circular(8.0),
            ),
            errorText: errorText,
          ),
          validator: (value) {
            if (value!.isEmpty) {
              return 'Please enter an email';
            }
            if (!emailRegex.hasMatch(value)) {
              return errorText ?? 'Invalid email address';
            }
            return null;
          },
          onFieldSubmitted: valueChange,
          onChanged: valueChange,
        ),
      ],
    );
  }
}

class PasswordEditField extends StatefulWidget {
  const PasswordEditField({
    super.key,
    required this.label,
    required this.valueChange,
    required this.hintText,
    required this.focusedBorderColor,
    required this.fillColor,
    this.errorText,
    required this.controller,
  });

  final String label;
  final Function(String) valueChange;
  final String hintText;
  final Color? focusedBorderColor;
  final Color? fillColor;
  final String? errorText;
  final TextEditingController controller;

  @override
  State<PasswordEditField> createState() => _PasswordEditFieldState();
}

class _PasswordEditFieldState extends State<PasswordEditField> {
  bool passwordVisible = false;
  @override
  void initState() {
    super.initState();
    passwordVisible = true;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
          child: Text(
            widget.label,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Color(0xff4B4E56),
            ),
          ),
        ),
        TextFormField(
          controller: widget.controller,
          enableSuggestions: false,
          cursorWidth: 1,
          cursorColor: Theme.of(context).dividerColor,
          keyboardType: TextInputType.visiblePassword,
          obscureText: passwordVisible,
          decoration: InputDecoration(
            filled: true,
            fillColor: widget.fillColor,
            hintText: widget.hintText,
            suffixIcon: IconButton(
              icon: Icon(
                  passwordVisible ? Icons.visibility : Icons.visibility_off),
              onPressed: () {
                setState(
                  () {
                    passwordVisible = !passwordVisible;
                  },
                );
              },
            ),
            alignLabelWithHint: false,
            focusedBorder: OutlineInputBorder(
              borderSide: BorderSide(
                color: widget.errorText != null
                    ? Theme.of(context).colorScheme.error
                    : widget.focusedBorderColor ?? Colors.transparent,
                width: 2.5,
              ),
              borderRadius: BorderRadius.circular(8.0),
            ),
            enabledBorder: OutlineInputBorder(
              borderSide: BorderSide(
                color: widget.errorText != null
                    ? Theme.of(context).colorScheme.error.withOpacity(0.5)
                    : Colors.transparent,
                width: 1.0,
              ),
              borderRadius: BorderRadius.circular(8.0),
            ),
            errorText: widget.errorText,
          ),
          validator: (value) {
            if (value!.isEmpty) {
              return 'Please enter a password';
            }
            if (value.length < 8) {
              return widget.errorText ??
                  'Password must be at least 8 characters';
            }
            if (value.length > 20) {
              return widget.errorText ??
                  'Password must not exceed 20 characters';
            }
            if (!value.contains(RegExp(r'[a-z]'))) {
              return widget.errorText ??
                  'Password must contain at least one lowercase letter';
            }
            if (!value.contains(RegExp(r'[A-Z]'))) {
              return widget.errorText ??
                  'Password must contain at least one uppercase letter';
            }
            if (!value.contains(RegExp(r'\d'))) {
              return widget.errorText ??
                  'Password must contain at least one number';
            }
            if (!value.contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]'))) {
              return widget.errorText ??
                  'Password must contain at least one special character';
            }
            return null;
          },
          onFieldSubmitted: widget.valueChange,
          onChanged: widget.valueChange,
        ),
      ],
    );
  }
}

class PhoneNumberEditField extends StatelessWidget {
  const PhoneNumberEditField({
    super.key,
    required this.label,
    required this.valueChange,
    required this.hintText,
    required this.focusedBorderColor,
    required this.fillColor,
    this.errorText,
    required this.controller,
  });

  final String label;
  final Function(String) valueChange;
  final String hintText;
  final Color? focusedBorderColor;
  final Color? fillColor;
  final String? errorText;
  final TextEditingController controller;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
          child: Text(
            label,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Color(0xff4B4E56),
            ),
          ),
        ),
        IntlPhoneField(
          controller: controller,
          cursorWidth: 1,
          cursorColor: Theme.of(context).dividerColor,
          keyboardType: TextInputType.phone,
          decoration: InputDecoration(
            filled: true,
            fillColor: fillColor,
            hintText: hintText,
            focusedBorder: OutlineInputBorder(
              borderSide: BorderSide(
                color: errorText != null
                    ? Theme.of(context).colorScheme.error
                    : focusedBorderColor ?? Colors.transparent,
                width: 2.5,
              ),
              borderRadius: BorderRadius.circular(8.0),
            ),
            enabledBorder: OutlineInputBorder(
              borderSide: BorderSide(
                color: errorText != null
                    ? Theme.of(context).colorScheme.error.withOpacity(0.5)
                    : Colors.transparent,
                width: 1.0,
              ),
              borderRadius: BorderRadius.circular(8.0),
            ),
            errorText: errorText,
          ),
        ),
      ],
    );
  }
}

class ProceedAsGuest extends StatelessWidget {
  const ProceedAsGuest({super.key});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () async {
        await _guestSignIn(context);
      },
      child: SizedBox(
        width: double.infinity,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Continue As Guest',
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: CustomColors.appBodyColor.withOpacity(0.6),
                  ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _guestSignIn(BuildContext context) async {
    await hasNetworkConnection().then((hasConnection) async {
      if (!hasConnection) {
        showSnackBar(
            context, AppLocalizations.of(context)!.checkYourInternetConnection);
        return;
      }

      loadingScreen(context);

      await CustomAuth.guestSignIn().then((success) async {
        if (success) {
          await AppService.postSignOutActions(context, log: false)
              .then((_) async {
            await AppService.postSignInActions(context, isGuest: true)
                .then((_) async {
              Navigator.pop(context);
              await Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(builder: (context) {
                  return const HomePage();
                }),
                (r) => true,
              );
            });
          });
        } else {
          Navigator.pop(context);
          showSnackBar(context, Config.guestLogInFailed);
        }
      });
    });
  }
}

class CheckBoxListTile extends StatefulWidget {
  const CheckBoxListTile({super.key});

  @override
  CheckBoxListTileState createState() => CheckBoxListTileState();
}

List<String> options = ['email', 'phone'];

class CheckBoxListTileState extends State<CheckBoxListTile> {
  String currentOption = options[0];
  @override
  Widget build(BuildContext context) {
    return Column(children: <Widget>[
      Container(
        margin: const EdgeInsets.only(top: 10),
        width: MediaQuery.of(context).size.width,
        decoration: const BoxDecoration(
          color: Color(0xff2E2F33),
          borderRadius: BorderRadius.all(
            Radius.circular(25),
          ),
        ),
        child: ListTile(
          contentPadding: const EdgeInsets.fromLTRB(15, 0, 0, 0),
          title: Row(
            children: [
              const Icon(
                Icons.phone_outlined,
                color: Color(0xff9EA3AA),
              ),
              const SizedBox(width: 6),
              Text(
                'Phone Number',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: const Color(0xff9EA3AA),
                    ),
              ),
            ],
          ),
          trailing: Radio(
            activeColor: CustomColors.appColorBlue,
            value: options[0],
            groupValue: currentOption,
            onChanged: (String? value) {
              setState(() {
                currentOption = value!;
              });
            },
          ),
        ),
      ),
      Container(
        margin: const EdgeInsets.only(top: 10),
        width: MediaQuery.of(context).size.width,
        decoration: const BoxDecoration(
          color: Color(0xff2E2F33),
          borderRadius: BorderRadius.all(
            Radius.circular(25),
          ),
        ),
        child: ListTile(
          contentPadding: const EdgeInsets.fromLTRB(15, 0, 0, 0),
          title: Row(
            children: [
              const Icon(
                Icons.email_outlined,
                color: Color(0xff9EA3AA),
              ),
              const SizedBox(width: 6),
              Text(
                'Email',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: const Color(0xff9EA3AA),
                    ),
              ),
            ],
          ),
          trailing: Radio(
            activeColor: CustomColors.appColorBlue,
            value: options[1],
            groupValue: currentOption,
            onChanged: (String? value) {
              setState(() {
                currentOption = value!;
              });
            },
          ),
        ),
      ),
    ]);
  }
}