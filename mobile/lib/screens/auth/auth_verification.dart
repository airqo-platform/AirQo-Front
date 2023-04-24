import 'dart:async';

import 'package:app/blocs/blocs.dart';
import 'package:app/models/models.dart';
import 'package:app/services/services.dart';
import 'package:app/themes/theme.dart';
import 'package:app/widgets/widgets.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../on_boarding/on_boarding_widgets.dart';
import 'auth_widgets.dart';

Future<bool> verifyAuthCode(BuildContext context) async {
  dynamic success = await Navigator.of(context).push(
    PageRouteBuilder(
      pageBuilder: (context, animation, secondaryAnimation) =>
          const _AuthVerificationWidget(),
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        const begin = Offset(0.0, 1.0);
        const end = Offset.zero;
        const curve = Curves.ease;

        var tween = Tween(
          begin: begin,
          end: end,
        ).chain(CurveTween(curve: curve));

        return SlideTransition(
          position: animation.drive(tween),
          child: child,
        );
      },
    ),
  );

  try {
    if (success as bool) return true;
  } catch (e) {
    debugPrint(e.toString());
  }

  return false;
}

class _AuthVerificationWidget extends StatefulWidget {
  const _AuthVerificationWidget();

  @override
  State<_AuthVerificationWidget> createState() =>
      _AuthVerificationWidgetState();
}

class _AuthVerificationWidgetState extends State<_AuthVerificationWidget> {
  DateTime? _exitTime;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const OnBoardingTopBar(backgroundColor: Colors.white),
      body: WillPopScope(
        onWillPop: onWillPop,
        child: AppSafeArea(
          horizontalPadding: 24,
          backgroundColor: Colors.white,
          child: BlocBuilder<AuthCodeBloc, AuthCodeState>(
            builder: (context, state) {
              if (state.codeCountDown >= 5) {
                _startCodeSentCountDown();
              }
              String credentials = "";
              switch (state.authMethod) {
                case AuthMethod.phone:
                  break;
                case AuthMethod.email:
                  credentials = state.emailAuthModel?.emailAddress ?? "";
                  break;
              }

              return Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  /// initial Status
                  Visibility(
                    visible: state.status == AuthCodeStatus.initial,
                    child: const AuthTitle("Verify your account"),
                  ),

                  Visibility(
                    visible: state.status == AuthCodeStatus.initial,
                    child: AuthSubTitle(
                      'Enter the 6 digits code sent to $credentials',
                    ),
                  ),

                  /// invalid code Status
                  Visibility(
                    visible: state.status == AuthCodeStatus.invalidCode,
                    child: const AuthTitle(
                      "Oops, Something’s wrong with your code",
                    ),
                  ),

                  Visibility(
                    visible: state.status == AuthCodeStatus.invalidCode,
                    child: const AuthSubTitle(
                      'Sure you read it correctly? Pro Tip: Copy & Paste',
                    ),
                  ),

                  /// success Status
                  Visibility(
                    visible: state.status == AuthCodeStatus.success,
                    child: AuthTitle(
                      "Your ${state.authMethod == AuthMethod.phone ? 'number' : 'email'} has been verified",
                    ),
                  ),

                  Visibility(
                    visible: state.status == AuthCodeStatus.success,
                    child: const AuthSubTitle(
                      'Pheww, almost done, hold in there.',
                    ),
                  ),

                  /// error Status
                  Visibility(
                    visible: state.status == AuthCodeStatus.error,
                    child: const AuthTitle(
                      "Oops, looks like something wrong happened",
                    ),
                  ),

                  Visibility(
                    visible: state.status == AuthCodeStatus.error,
                    child: AuthSubTitle(
                      state.errorMessage,
                    ),
                  ),

                  /// OPT field
                  Padding(
                    padding: const EdgeInsets.only(top: 20.0),
                    child: OptField(
                      callbackFn: (String value) {
                        context.read<AuthCodeBloc>().add(UpdateAuthCode(
                              value: value,
                            ));
                      },
                    ),
                  ),

                  // TOD create separate widgets
                  /// Resend OPT
                  Visibility(
                    visible: state.codeCountDown > 0 &&
                        state.status != AuthCodeStatus.success,
                    child: Padding(
                      padding: const EdgeInsets.only(top: 10.0),
                      child: Text(
                        'The code should arrive with in ${state.codeCountDown} sec',
                        textAlign: TextAlign.center,
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color:
                                  CustomColors.appColorBlack.withOpacity(0.5),
                            ),
                      ),
                    ),
                  ),

                  Visibility(
                    visible: state.codeCountDown <= 0 &&
                        state.status != AuthCodeStatus.success,
                    child: Padding(
                      padding: const EdgeInsets.only(top: 10.0),
                      child: InkWell(
                        onTap: () async {
                          switch (state.authMethod) {
                            case AuthMethod.phone:
                              await _resendPhoneAuthCode();
                              break;
                            case AuthMethod.email:
                              context
                                  .read<AuthCodeBloc>()
                                  .add(ResendEmailAuthCode(context: context));
                              break;
                          }
                        },
                        child: Text(
                          'Resend code',
                          textAlign: TextAlign.center,
                          style:
                              Theme.of(context).textTheme.bodySmall?.copyWith(
                                    color: CustomColors.appColorBlue,
                                  ),
                        ),
                      ),
                    ),
                  ),

                  /// Or Separator
                  Visibility(
                    visible: state.status != AuthCodeStatus.success,
                    child: const AuthOrSeparator(),
                  ),

                  /// auth options
                  Visibility(
                    visible: state.status != AuthCodeStatus.success,
                    child: const ChangeAuthCredentials(),
                  ),

                  const Spacer(),

                  /// Success widget
                  Visibility(
                    visible: state.status == AuthCodeStatus.success,
                    child: const AuthSuccessWidget(),
                  ),

                  const Spacer(),

                  /// Next button
                  Visibility(
                    visible: state.status != AuthCodeStatus.success,
                    child: Padding(
                      padding: const EdgeInsets.only(bottom: 12.0),
                      child: NextButton(
                        buttonColor: state.inputAuthCode.length >= 6
                            ? CustomColors.appColorBlue
                            : CustomColors.appColorDisabled,
                        callBack: () {
                          if (state.status == AuthCodeStatus.success) {
                            Navigator.pop(context, true);

                            return;
                          }

                          if (state.loading) {
                            return;
                          }

                          if (state.inputAuthCode.length >= 6) {
                            context
                                .read<AuthCodeBloc>()
                                .add(const VerifyAuthCode());
                          }
                        },
                      ),
                    ),
                  ),

                  MultiBlocListener(
                    listeners: [
                      BlocListener<AuthCodeBloc, AuthCodeState>(
                        listener: (context, state) {
                          FocusScope.of(context).requestFocus(
                            FocusNode(),
                          );
                          loadingScreen(context);
                        },
                        listenWhen: (_, current) {
                          return current.loading;
                        },
                      ),
                      BlocListener<AuthCodeBloc, AuthCodeState>(
                        listener: (context, state) {
                          Navigator.pop(context);
                        },
                        listenWhen: (previous, current) {
                          return !current.loading && previous.loading;
                        },
                      ),
                      BlocListener<AuthCodeBloc, AuthCodeState>(
                        listener: (context, state) async {
                          FocusScope.of(context).requestFocus(
                            FocusNode(),
                          );
                          if (state.loading) {
                            Navigator.pop(context);
                          }

                          if (!mounted) {
                            return;
                          }
                          switch (state.authProcedure) {
                            case AuthProcedure.login:
                            case AuthProcedure.signup:
                            case AuthProcedure.anonymousLogin:
                              await AppService.postSignInActions(context)
                                  .then((_) async {
                                await Future.delayed(const Duration(seconds: 2))
                                    .then((_) {
                                  Navigator.pop(context, true);
                                });
                              });
                              break;
                            case AuthProcedure.deleteAccount:
                            case AuthProcedure.logout:
                              await AppService.postSignOutActions(context)
                                  .then((_) {
                                Navigator.pop(context);
                                Navigator.pop(context, true);
                              });
                              break;
                          }
                        },
                        listenWhen: (previous, current) {
                          return current.status == AuthCodeStatus.success;
                        },
                      ),
                    ],
                    child: Container(),
                  ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }

  Future<void> _resendPhoneAuthCode() async {
    context.read<AuthCodeBloc>().add(const UpdateAuthCodeStatus(
          loading: true,
        ));

    String phoneNumber =
        "${context.read<PhoneAuthBloc>().state.countryCode} ${context.read<PhoneAuthBloc>().state.phoneNumber}"
            .replaceAll(" ", "");

    await FirebaseAuth.instance.verifyPhoneNumber(
      phoneNumber: phoneNumber,
      forceResendingToken:
          context.read<AuthCodeBloc>().state.phoneAuthModel?.resendToken,
      verificationCompleted: (PhoneAuthCredential credential) {
        context.read<AuthCodeBloc>().add(const UpdateAuthCodeStatus(
              status: AuthCodeStatus.success,
            ));
      },
      verificationFailed: (FirebaseAuthException exception) {
        final firebaseAuthError = CustomAuth.getFirebaseErrorCodeMessage(
          exception.code,
        );

        switch (firebaseAuthError) {
          case FirebaseAuthError.noInternetConnection:
            context.read<AuthCodeBloc>().add(const UpdateAuthCodeStatus(
                  status: AuthCodeStatus.error,
                  errorMessage: "Check your internet connection",
                ));
            break;
          case FirebaseAuthError.invalidPhoneNumber:
            context.read<AuthCodeBloc>().add(const UpdateAuthCodeStatus(
                  status: AuthCodeStatus.error,
                  errorMessage: 'Failed to validate phone number',
                ));
            break;
          case FirebaseAuthError.authFailure:
          case FirebaseAuthError.logInRequired:
          case FirebaseAuthError.phoneNumberTaken:
          case FirebaseAuthError.accountTaken:
          case FirebaseAuthError.accountInvalid:
          case FirebaseAuthError.authSessionTimeout:
          case FirebaseAuthError.invalidEmailAddress:
          case FirebaseAuthError.emailTaken:
          case FirebaseAuthError.invalidAuthCode:
            context.read<AuthCodeBloc>().add(const UpdateAuthCodeStatus(
                  status: AuthCodeStatus.error,
                  errorMessage: 'Failed to send code. Try again later',
                ));
            break;
        }
      },
      codeSent: (String verificationId, int? resendToken) {
        context.read<AuthCodeBloc>().add(const UpdateAuthCodeStatus(
              loading: false,
            ));
        PhoneAuthModel phoneAuthModel = PhoneAuthModel(
          verificationId: verificationId,
          resendToken: resendToken,
        );
        AuthCodeState state = context.read<AuthCodeBloc>().state;
        context.read<AuthCodeBloc>().add(InitializeAuthCodeState(
              authMethod: state.authMethod,
              authProcedure: state.authProcedure,
              phoneAuthModel: phoneAuthModel,
            ));
      },
      codeAutoRetrievalTimeout: (String verificationId) {
        context.read<AuthCodeBloc>().add(const UpdateAuthCodeStatus(
              loading: false,
            ));
      },
      timeout: const Duration(seconds: 1),
    );
  }

  void _startCodeSentCountDown() {
    Timer.periodic(
      const Duration(milliseconds: 1200),
      (Timer timer) {
        if (mounted) {
          final newCount = context.read<AuthCodeBloc>().state.codeCountDown - 1;
          context.read<AuthCodeBloc>().add(UpdateCountDown(newCount));
          if (newCount == 0) {
            setState(() => timer.cancel());
          }
        }
      },
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

    Navigator.pop(context, false);

    return Future.value(false);
  }
}
