import 'package:app/blocs/blocs.dart';
import 'package:app/models/models.dart';
import 'package:app/themes/theme.dart';
import 'package:app/utils/utils.dart';
import 'package:auto_size_text/auto_size_text.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_cache_manager/flutter_cache_manager.dart';
import 'package:flutter_svg/svg.dart';

import '../../services/native_api.dart';
import 'kya_title_page.dart';

class CircularKyaButton extends StatelessWidget {
  const CircularKyaButton({
    super.key,
    required this.icon,
    required this.isActive,
  });
  final String icon;
  final bool isActive;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 48,
      width: 48,
      padding: const EdgeInsets.all(15.0),
      decoration: BoxDecoration(
        color: isActive
            ? CustomColors.appColorBlue
            : CustomColors.appColorBlue.withOpacity(0.5),
        shape: BoxShape.circle,
      ),
      child: SvgPicture.asset(
        icon,
        color: Colors.white,
      ),
    );
  }
}

class KyaMessageChip extends StatelessWidget {
  const KyaMessageChip(this.kya, {super.key});
  final Kya kya;

  @override
  Widget build(BuildContext context) {
    Widget widget = AutoSizeText(
      kya.getKyaMessage(),
      maxLines: 1,
      overflow: TextOverflow.ellipsis,
      textAlign: TextAlign.center,
      style: CustomTextStyle.caption3(context)?.copyWith(
        color: CustomColors.appColorBlue,
      ),
    );
    if (kya.isPartiallyComplete()) {
      widget = RichText(
        textAlign: TextAlign.start,
        overflow: TextOverflow.ellipsis,
        text: TextSpan(
          children: [
            TextSpan(
              text: 'Complete! Move to ',
              style: CustomTextStyle.caption3(context)?.copyWith(
                color: CustomColors.appColorBlack,
              ),
            ),
            TextSpan(
              text: 'For You',
              style: CustomTextStyle.caption3(context)?.copyWith(
                color: CustomColors.appColorBlue,
              ),
            ),
          ],
        ),
      );
    }

    return Chip(
      shadowColor: Colors.white,
      backgroundColor: Colors.white,
      surfaceTintColor: Colors.white,
      label: widget,
      elevation: 0,
      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
      padding: EdgeInsets.zero,
      labelPadding: EdgeInsets.zero,
      deleteIconColor: CustomColors.appColorBlue,
      labelStyle: null,
      deleteIcon: Icon(
        Icons.chevron_right_rounded,
        size: 17,
        color: CustomColors.appColorBlue,
      ),
    );
  }
}

class KyaCardWidget extends StatelessWidget {
  const KyaCardWidget(this.kya, {super.key});
  final Kya kya;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 8),
      child: GestureDetector(
        onTap: () async {
          if (kya.isPartiallyComplete()) {
            context.read<KyaBloc>().add(
                  UpdateKyaProgress(
                    visibleCardIndex: kya.lessons.length - 1,
                    kya: kya,
                  ),
                );
          } else {
            await Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) {
                  return KyaTitlePage(kya);
                },
              ),
            );
          }
        },
        child: Container(
          padding: const EdgeInsets.fromLTRB(16.0, 8.0, 8.0, 8.0),
          constraints: const BoxConstraints(
            maxHeight: 112,
          ),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.all(
              Radius.circular(16.0),
            ),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(bottom: 2),
                      child: AutoSizeText(
                        kya.title,
                        maxLines: 4,
                        overflow: TextOverflow.ellipsis,
                        style: CustomTextStyle.headline10(context),
                      ),
                    ),
                    const Spacer(),
                    KyaMessageChip(kya),
                    Visibility(
                      visible: kya.isInProgress(),
                      child: KyaProgressBar(
                        kya.progress,
                        height: 6,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(
                width: 16,
              ),
              Container(
                width: 104,
                height: 104,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(8.0),
                  image: DecorationImage(
                    fit: BoxFit.cover,
                    image: CachedNetworkImageProvider(
                      kya.imageUrl,
                      cacheKey: kya.imageUrlCacheKey(),
                      cacheManager: CacheManager(
                        CacheService.cacheConfig(
                          kya.imageUrlCacheKey(),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class KyaProgressBar extends StatelessWidget {
  const KyaProgressBar(
    this.progress, {
    super.key,
    this.height = 10,
  });
  final double height;
  final double progress;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: height,
      child: ClipRRect(
        borderRadius: const BorderRadius.all(Radius.circular(10)),
        child: LinearProgressIndicator(
          color: CustomColors.appColorBlue,
          value: progress,
          backgroundColor: CustomColors.appColorBlue.withOpacity(0.24),
        ),
      ),
    );
  }
}
