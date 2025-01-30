import 'package:airqo/src/app/auth/bloc/ForgotPasswordBloc/forgot_password_bloc.dart';
import 'package:airqo/src/app/auth/bloc/ForgotPasswordBloc/forgot_password_event.dart';
import 'package:airqo/src/app/auth/pages/password_reset/password_reset.dart';

import 'package:airqo/src/meta/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:pin_code_fields/pin_code_fields.dart';

class ResetLinkSentPage extends StatefulWidget {
  const ResetLinkSentPage({super.key});

  @override
  _ResetLinkSentPageState createState() => _ResetLinkSentPageState();
}

class _ResetLinkSentPageState extends State<ResetLinkSentPage> {
  final TextEditingController _pinController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        title: Text(
          "Forgot Password",
          style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: AppColors.boldHeadlineColor2),
        ),
        centerTitle: true,
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.only(left: 32, right: 32, top: 8),
            child: Column(
              children: [
                Text(
                  "We just sent you a Password Reset Code to your email",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                      color: AppColors.highlightColor2
                  ),
                ),
                SizedBox(height: 20),
                Text(
                  "Enter the verification code sent to ha ******@gmail.com",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                      color: AppColors.highlightColor2
                  ),
                ),

                // PIN Code Input
                SizedBox(height: 20),
                PinCodeTextField(
                  appContext: context,
                  length: 5, // Adjust length if needed
                  controller: _pinController,
                  keyboardType: TextInputType.number,
                  animationType: AnimationType.fade,
                  hintCharacter: "0",
                  //backgroundColor: AppColors.boldHeadlineColor4,


                  textStyle: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.w600,
                    color: AppColors.boldHeadlineColor3

                  ),
                  pinTheme: PinTheme(

                    shape: PinCodeFieldShape.box,
                    borderRadius: BorderRadius.circular(4),

                    fieldHeight: 64,
                    fieldWidth: 60,
                    activeFillColor: AppColors.boldHeadlineColor4,
                    inactiveFillColor:AppColors.boldHeadlineColor4 ,
                    selectedFillColor: AppColors.darkThemeBackground,
                    activeColor: AppColors.boldHeadlineColor4,
                    inactiveColor: AppColors.boldHeadlineColor4,
                    selectedColor: AppColors.primaryColor,
                    fieldOuterPadding: EdgeInsets.symmetric(horizontal: 4),


                  ),
                  enableActiveFill: true,
                  onChanged: (value) {},
                ),

                SizedBox(height: 18),
                InkWell(
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => PasswordResetPage(token: _pinController.text.trim()),
                      ),
                    );
                  },
                  child: Container(
                    height: 56,
                    decoration: BoxDecoration(
                        color: AppColors.primaryColor,
                        borderRadius: BorderRadius.circular(4)),
                    child: Center(
                      child: Text(
                        "Continue",
                        style: TextStyle(
                          fontWeight: FontWeight.w500,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ),

                SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Not seeing the email?',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    InkWell(
                      onTap: () {
                        final email = context.read<PasswordResetBloc>().state.email;
                        if (email != null && email.isNotEmpty) {
                          context.read<PasswordResetBloc>().add(
                            RequestPasswordReset(email),
                          );
                          print("Resend requested for email: $email");
                        } else {
                          print("Email is null or empty. Cannot resend.");
                        }
                      },
                      child: Center(
                        child: Text(
                          " Resend",
                          style: TextStyle(
                              fontWeight: FontWeight.w500,
                              color: AppColors.primaryColor),
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 20),
              ],
            ),
          ),
          SizedBox(height: 24),
        ],
      ),
    );
  }
}
