// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'email_auth_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EmailAuthModel _$EmailAuthModelFromJson(Map<String, dynamic> json) =>
    EmailAuthModel(
      json['success'] as bool,
      json['token'] as int,
      json['email'] as String,
      json['message'] as String,
      json['login_link'] as String,
      json['auth_link'] as String? ?? '',
    );
