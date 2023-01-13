import 'dart:async';

import 'package:app/blocs/blocs.dart';
import 'package:app/models/models.dart';
import 'package:app/screens/home_page.dart';
import 'package:app/themes/theme.dart';
import 'package:app/utils/utils.dart';
import 'package:app/widgets/widgets.dart';
import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../on_boarding/on_boarding_widgets.dart';
import 'auth_verification.dart';
import 'auth_widgets.dart';

class PhoneAuthWidget extends StatefulWidget {
  const PhoneAuthWidget({
    super.key,
    this.phoneNumber,
    required this.authProcedure,
  });
  final String? phoneNumber;
  final AuthProcedure authProcedure;

  @override
  PhoneAuthWidgetState createState() => PhoneAuthWidgetState();
}

class PhoneAuthWidgetState<T extends PhoneAuthWidget> extends State<T> {
  DateTime? _exitTime;
  bool _keyboardVisible = false;

  @override
  void initState() {
    super.initState();
    context.read<PhoneAuthBloc>().add(
          InitializePhoneAuth(
            phoneNumber: widget.phoneNumber ?? '',
            authProcedure: widget.authProcedure,
          ),
        );
  }

  @override
  Widget build(BuildContext context) {
    _keyboardVisible = MediaQuery.of(context).viewInsets.bottom != 0;

    return Scaffold(
      appBar: const OnBoardingTopBar(backgroundColor: Colors.white),
      body: WillPopScope(
        onWillPop: onWillPop,
        child: AppSafeArea(
          backgroundColor: Colors.white,
          horizontalPadding: 24,
          widget: BlocBuilder<PhoneAuthBloc, PhoneAuthState>(
            builder: (context, state) {
              return Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  MultiBlocListener(
                    listeners: [
                      BlocListener<PhoneAuthBloc, PhoneAuthState>(
                        listener: (context, state) {
                          loadingScreen(context);
                        },
                        listenWhen: (previous, current) {
                          return current.blocStatus == BlocStatus.processing;
                        },
                      ),
                      BlocListener<PhoneAuthBloc, PhoneAuthState>(
                        listener: (context, state) {
                          Navigator.pop(context);
                        },
                        listenWhen: (previous, current) {
                          return previous.blocStatus == BlocStatus.processing;
                        },
                      ),
                      BlocListener<PhoneAuthBloc, PhoneAuthState>(
                        listener: (context, state) {
                          showSnackBar(context, state.error.message);
                        },
                        listenWhen: (previous, current) {
                          return current.blocStatus == BlocStatus.error &&
                              current.error != AuthenticationError.none &&
                              current.error !=
                                  AuthenticationError.invalidPhoneNumber;
                        },
                      ),
                      BlocListener<PhoneAuthBloc, PhoneAuthState>(
                        listener: (context, state) {
                          context
                              .read<AuthCodeBloc>()
                              .add(InitializeAuthCodeState(
                                phoneNumber:
                                    '${state.countryCode} ${state.phoneNumber}',
                                authProcedure: state.authProcedure,
                                authMethod: AuthMethod.phone,
                              ));

                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) {
                              return const AuthVerificationWidget();
                            }),
                          );
                        },
                        listenWhen: (previous, current) {
                          return current.blocStatus == BlocStatus.success;
                        },
                      ),
                    ],
                    child: const SizedBox(
                      height: 10,
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: AutoSizeText(
                      state.blocStatus == BlocStatus.error &&
                              state.error ==
                                  AuthenticationError.invalidPhoneNumber
                          ? AuthMethod.phone.invalidInputMessage
                          : AuthMethod.phone.optionsText(state.authProcedure),
                      textAlign: TextAlign.center,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: CustomTextStyle.headline7(context),
                    ),
                  ),
                  InputValidationCodeMessage(
                    state.blocStatus != BlocStatus.error,
                  ),
                  const SizedBox(
                    height: 32,
                  ),
                  SizedBox(
                    height: 48,
                    child: Row(
                      children: [
                        SizedBox(
                          width: 64,
                          child: CountryCodePickerField(
                            valueChange: (code) {
                              context.read<PhoneAuthBloc>().add(
                                    UpdateCountryCode(
                                      code ?? state.countryCode,
                                    ),
                                  );
                            },
                            placeholder: state.countryCode,
                          ),
                        ),
                        const SizedBox(
                          width: 16,
                        ),
                        const Expanded(
                          child: PhoneInputField(),
                        ),
                      ],
                    ),
                  ),
                  InputValidationErrorMessage(
                    message: state.phoneNumber.inValidPhoneNumberMessage(),
                    visible: state.blocStatus == BlocStatus.error &&
                        state.error == AuthenticationError.invalidPhoneNumber,
                  ),
                  const SizedBox(
                    height: 32,
                  ),
                  SignUpButton(
                    authProcedure: state.authProcedure,
                    authMethod: AuthMethod.phone,
                  ),
                  const Spacer(),
                  NextButton(
                    buttonColor: state.phoneNumber.isValidPhoneNumber()
                        ? CustomColors.appColorBlue
                        : CustomColors.appColorDisabled,
                    callBack: () async {
                      if (!state.phoneNumber.isValidPhoneNumber()) {
                        context
                            .read<PhoneAuthBloc>()
                            .add(const InvalidPhoneNumber());

                        return;
                      }

                      await showDialog<ConfirmationAction>(
                        context: context,
                        barrierDismissible: false,
                        builder: (BuildContext context) {
                          return AuthMethodDialog(
                            credentials:
                                '${state.countryCode} ${state.phoneNumber}',
                            authMethod: AuthMethod.phone,
                          );
                        },
                      ).then(
                        (action) => {
                          if (action != null || action == ConfirmationAction.ok)
                            {
                              context.read<PhoneAuthBloc>().add(
                                    InitiatePhoneNumberVerification(
                                      context: context,
                                    ),
                                  ),
                            },
                        },
                      );
                    },
                  ),
                  Visibility(
                    visible: !_keyboardVisible,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      child: state.authProcedure == AuthProcedure.login
                          ? const LoginOptions(authMethod: AuthMethod.phone)
                          : const SignUpOptions(
                              authMethod: AuthMethod.phone,
                            ),
                    ),
                  ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }

  Future<bool> onWillPop() {
    final now = DateTime.now();

    if (_exitTime == null ||
        now.difference(_exitTime!) > const Duration(seconds: 2)) {
      _exitTime = now;

      showSnackBar(
        context,
        'Tap again to cancel!',
      );

      return Future.value(false);
    }

    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(
        builder: (context) {
          return const HomePage();
        },
      ),
      (r) => false,
    );

    return Future.value(false);
  }
}

class PhoneLoginWidget extends PhoneAuthWidget {
  const PhoneLoginWidget({super.key, String? phoneNumber})
      : super(
          phoneNumber: phoneNumber,
          authProcedure: AuthProcedure.login,
        );

  @override
  PhoneLoginWidgetState createState() => PhoneLoginWidgetState();
}

class PhoneLoginWidgetState extends PhoneAuthWidgetState<PhoneLoginWidget> {}

class PhoneSignUpWidget extends PhoneAuthWidget {
  const PhoneSignUpWidget({super.key})
      : super(authProcedure: AuthProcedure.signup);

  @override
  PhoneSignUpWidgetState createState() => PhoneSignUpWidgetState();
}

class PhoneSignUpWidgetState extends PhoneAuthWidgetState<PhoneSignUpWidget> {}
