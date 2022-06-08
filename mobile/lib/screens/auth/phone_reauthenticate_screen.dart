import 'package:app/models/profile.dart';
import 'package:app/services/firebase_service.dart';
import 'package:app/widgets/buttons.dart';
import 'package:app/widgets/dialogs.dart';
import 'package:app/widgets/text_fields.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

import '../../themes/colors.dart';
import '../../utils/network.dart';
import 'auth_widgets.dart';

class PhoneReAuthenticateScreen extends StatefulWidget {
  const PhoneReAuthenticateScreen(
    this.userDetails, {
    Key? key,
  }) : super(key: key);
  final Profile userDetails;

  @override
  PhoneReAuthenticateScreenState createState() =>
      PhoneReAuthenticateScreenState();
}

class PhoneReAuthenticateScreenState extends State<PhoneReAuthenticateScreen> {
  String _verificationId = '';
  bool _codeSent = false;
  bool _isResending = false;
  bool _isVerifying = false;

  List<String> _phoneVerificationCode = <String>['', '', '', '', '', ''];
  Color _nextBtnColor = CustomColors.appColorDisabled;

  Future<void> autoVerifyPhoneFn(PhoneAuthCredential credential) async {
    final success =
        await CustomAuth.reAuthenticateWithPhoneNumber(credential, context);
    if (success) {
      Navigator.pop(context, true);
    } else {
      setState(
        () {
          _nextBtnColor = CustomColors.appColorBlue;
          _isVerifying = false;
        },
      );
      await showSnackBar(
        context,
        'Failed to verify phone number.'
        ' Try again later',
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        color: Colors.white,
        padding: const EdgeInsets.only(left: 24, right: 24),
        child: Center(
          child: Column(children: [
            const SizedBox(
              height: 42,
            ),
            const Text(
              'Verify your action!',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 24,
                color: Colors.black,
              ),
            ),
            const SizedBox(
              height: 8,
            ),
            if (widget.userDetails.phoneNumber.length > 8)
              Text(
                'Enter the 6 digits code sent to your\n'
                'number ${widget.userDetails.phoneNumber}',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.black.withOpacity(0.6),
                ),
              ),
            const SizedBox(
              height: 32,
            ),
            Padding(
              padding: const EdgeInsets.only(left: 36, right: 36),
              child: OptField(
                codeSent: _codeSent,
                position: 0,
                callbackFn: setCode,
              ),
            ),
            const SizedBox(
              height: 24,
            ),
            Visibility(
              visible: !_codeSent,
              child: Text(
                'The code should arrive with in 5 sec',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.black.withOpacity(0.5),
                ),
              ),
            ),
            Visibility(
              visible: _codeSent,
              child: GestureDetector(
                onTap: () async {
                  await _resendVerificationCode();
                },
                child: Text(
                  'Resend code',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 12,
                    color: _isResending
                        ? Colors.black.withOpacity(0.5)
                        : CustomColors.appColorBlue,
                  ),
                ),
              ),
            ),
            const Spacer(),
            GestureDetector(
              onTap: () async {
                await _verifySentCode();
              },
              child: NextButton(
                text: 'Verify',
                buttonColor: _nextBtnColor,
              ),
            ),
            const SizedBox(
              height: 20,
            ),
            const CancelOption(),
            const SizedBox(
              height: 36,
            ),
          ]),
        ),
      ),
    );
  }

  @override
  void initState() {
    super.initState();
    _initialize();
    _requestVerification();
  }

  void setCode(String value, int position) {
    setState(
      () {
        _phoneVerificationCode[position] = value;
      },
    );
    final code = _phoneVerificationCode.join('');
    if (code.length == 6) {
      setState(
        () {
          _nextBtnColor = CustomColors.appColorBlue;
        },
      );
    } else {
      setState(
        () {
          _nextBtnColor = CustomColors.appColorDisabled;
        },
      );
    }
  }

  void verifyPhoneFn(verificationId) {
    setState(
      () {
        _verificationId = verificationId;
      },
    );

    // Future.delayed(const Duration(seconds: 5), () {
    //   setState(() {
    //     _resendCode = true;
    //   },);
    // },);
  }

  void _initialize() {
    setState(
      () {
        _verificationId = '';
        // _resendCode = false;
        _codeSent = false;
        _isResending = false;
        _isVerifying = false;
        _phoneVerificationCode = <String>['', '', '', '', '', ''];
        _nextBtnColor = CustomColors.appColorDisabled;
      },
    );
  }

  Future<void> _requestVerification() async {
    final connected = await checkNetworkConnection(
      context,
      notifyUser: true,
    );
    if (!connected) {
      return;
    }
    setState(
      () {
        _nextBtnColor = CustomColors.appColorDisabled;
        _isVerifying = true;
        _codeSent = false;
      },
    );

    await CustomAuth.requestPhoneVerification(
      widget.userDetails.phoneNumber,
      context,
      verifyPhoneFn,
      autoVerifyPhoneFn,
    );

    if (!mounted) {
      return;
    }

    Future.delayed(
      const Duration(seconds: 5),
      () {
        setState(
          () {
            _codeSent = true;
            _isVerifying = false;
          },
        );
      },
    );
  }

  Future<void> _resendVerificationCode() async {
    final connected = await checkNetworkConnection(
      context,
      notifyUser: true,
    );
    if (!connected) {
      return;
    }

    if (_isResending) {
      return;
    }

    setState(() => _isResending = true);

    await CustomAuth.requestPhoneVerification(
      widget.userDetails.phoneNumber,
      context,
      verifyPhoneFn,
      autoVerifyPhoneFn,
    )
        .then(
          (value) => {
            setState(
              () {
                _isResending = false;
              },
            ),
          },
        )
        .whenComplete(
          () => {
            setState(
              () {
                _isResending = false;
              },
            ),
          },
        );
  }

  Future<void> _verifySentCode() async {
    final connected = await checkNetworkConnection(
      context,
      notifyUser: true,
    );
    if (!connected) {
      return;
    }

    final code = _phoneVerificationCode.join('');

    if (code.length != 6) {
      await showSnackBar(
        context,
        'Enter all the 6 digits',
      );

      return;
    }

    if (_isVerifying) {
      return;
    }

    setState(
      () {
        _nextBtnColor = CustomColors.appColorDisabled;
        _isVerifying = true;
      },
    );

    final credential = PhoneAuthProvider.credential(
      verificationId: _verificationId,
      smsCode: _phoneVerificationCode.join(''),
    );
    try {
      final success =
          await CustomAuth.reAuthenticateWithPhoneNumber(credential, context);
      if (success) {
        Navigator.pop(context, true);
      } else {
        setState(
          () {
            _nextBtnColor = CustomColors.appColorBlue;
            _isVerifying = false;
          },
        );
        await showSnackBar(
          context,
          'Failed to verify phone number.'
          ' Try again later',
        );
      }
    } on FirebaseAuthException catch (exception, stackTrace) {
      debugPrint('$exception\n$stackTrace');
      if (exception.code == 'invalid-verification-code') {
        await showSnackBar(
          context,
          'Invalid Code',
        );
        setState(
          () {
            _nextBtnColor = CustomColors.appColorBlue;
            _isVerifying = false;
          },
        );
      }
      if (exception.code == 'session-expired') {
        await CustomAuth.requestPhoneVerification(
          widget.userDetails.phoneNumber,
          context,
          verifyPhoneFn,
          autoVerifyPhoneFn,
        );
        await showSnackBar(
          context,
          'Your verification '
          'has timed out. we have sent your'
          ' another verification code',
        );
        setState(
          () {
            _nextBtnColor = CustomColors.appColorBlue;
            _isVerifying = false;
          },
        );
      }
    } catch (exception, stackTrace) {
      await showSnackBar(
        context,
        'Try again later',
      );
      setState(
        () {
          _nextBtnColor = CustomColors.appColorBlue;
          _isVerifying = false;
        },
      );
      debugPrint('$exception\n$stackTrace');
    }
  }
}
