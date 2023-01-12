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

class EmailAuthWidget extends StatefulWidget {
  const EmailAuthWidget({
    super.key,
    this.emailAddress,
    required this.authProcedure,
  });
  final String? emailAddress;
  final AuthProcedure authProcedure;

  @override
  EmailAuthWidgetState createState() => EmailAuthWidgetState();
}

class EmailAuthWidgetState<T extends EmailAuthWidget> extends State<T> {
  DateTime? _exitTime;
  late BuildContext _loadingContext;
  bool _keyboardVisible = false;

  @override
  void initState() {
    super.initState();
    _loadingContext = context;
    context.read<EmailAuthBloc>().add(
          InitializeEmailAuth(
            emailAddress: widget.emailAddress ?? '',
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
          verticalPadding: 10,
          horizontalPadding: 24,
          widget: BlocBuilder<EmailAuthBloc, EmailAuthState>(
            builder: (context, state) {
              return Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  MultiBlocListener(
                    listeners: [
                      BlocListener<EmailAuthBloc, EmailAuthState>(
                        listener: (context, state) {
                          loadingScreen(_loadingContext);
                        },
                        listenWhen: (previous, current) {
                          return current.blocStatus == BlocStatus.processing;
                        },
                      ),
                      BlocListener<EmailAuthBloc, EmailAuthState>(
                        listener: (context, state) {
                          Navigator.pop(_loadingContext);
                        },
                        listenWhen: (previous, current) {
                          return previous.blocStatus == BlocStatus.processing;
                        },
                      ),
                      BlocListener<EmailAuthBloc, EmailAuthState>(
                        listener: (context, state) {
                          showSnackBar(context, state.error.message);
                        },
                        listenWhen: (previous, current) {
                          return current.blocStatus == BlocStatus.error &&
                              current.error != AuthenticationError.none &&
                              current.error !=
                                  AuthenticationError.invalidEmailAddress;
                        },
                      ),
                      BlocListener<EmailAuthBloc, EmailAuthState>(
                        listener: (context, state) {
                          context
                              .read<AuthCodeBloc>()
                              .add(InitializeAuthCodeState(
                                emailAddress: state.emailAddress,
                                authProcedure: state.authProcedure,
                                authMethod: AuthMethod.email,
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
                    child: Container(),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: AutoSizeText(
                      state.blocStatus == BlocStatus.error &&
                              state.error ==
                                  AuthenticationError.invalidEmailAddress
                          ? AuthMethod.email.invalidInputMessage
                          : AuthMethod.email.optionsText(state.authProcedure),
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
                  const SizedBox(
                    height: 48,
                    child: EmailInputField(),
                  ),
                  InputValidationErrorMessage(
                    message: AuthMethod.email.invalidInputErrorMessage,
                    visible: state.blocStatus == BlocStatus.error &&
                        state.error == AuthenticationError.invalidEmailAddress,
                  ),
                  const SizedBox(
                    height: 32,
                  ),
                  SignUpButton(
                    authProcedure: state.authProcedure,
                    authMethod: AuthMethod.email,
                  ),
                  const Spacer(),
                  NextButton(
                    buttonColor: state.emailAddress.isValidEmail()
                        ? CustomColors.appColorBlue
                        : CustomColors.appColorDisabled,
                    callBack: () {
                      context
                          .read<EmailAuthBloc>()
                          .add(ValidateEmailAddress(context: context));
                    },
                  ),
                  Visibility(
                    visible: !_keyboardVisible,
                    child: Padding(
                      padding: const EdgeInsets.only(top: 16, bottom: 12),
                      child: state.authProcedure == AuthProcedure.login
                          ? const LoginOptions(authMethod: AuthMethod.email)
                          : const SignUpOptions(
                              authMethod: AuthMethod.email,
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
        'Tap again to cancel !',
      );

      return Future.value(false);
    }

    Navigator.pop(_loadingContext);

    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (context) {
        return const HomePage();
      }),
      (r) => false,
    );

    return Future.value(false);
  }
}

class EmailLoginWidget extends EmailAuthWidget {
  const EmailLoginWidget({super.key, String? emailAddress})
      : super(
          emailAddress: emailAddress,
          authProcedure: AuthProcedure.login,
        );

  @override
  EmailLoginWidgetState createState() => EmailLoginWidgetState();
}

class EmailLoginWidgetState extends EmailAuthWidgetState<EmailLoginWidget> {}

class EmailSignUpWidget extends EmailAuthWidget {
  const EmailSignUpWidget({super.key})
      : super(authProcedure: AuthProcedure.signup);

  @override
  EmailSignUpWidgetState createState() => EmailSignUpWidgetState();
}

class EmailSignUpWidgetState extends EmailAuthWidgetState<EmailSignUpWidget> {}
