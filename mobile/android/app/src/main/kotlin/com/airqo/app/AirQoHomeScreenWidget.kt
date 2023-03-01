package com.airqo.app

import android.appwidget.AppWidgetManager
import android.content.Context
import android.content.SharedPreferences
import android.widget.RemoteViews
import es.antonborri.home_widget.HomeWidgetLaunchIntent
import es.antonborri.home_widget.HomeWidgetProvider

class AirQoHomeScreenWidget : HomeWidgetProvider() {
    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray,
        widgetData: SharedPreferences
    ) {
        appWidgetIds.forEach { widgetId ->
            val views = RemoteViews(context.packageName, R.layout.air_qo_home_screen_widget).apply {
                val pendingIntent = HomeWidgetLaunchIntent.getActivity(
                    context, MainActivity::class.java
                )
                setOnClickPendingIntent(R.id.widget_bg, pendingIntent)
                val dataKeys = arrayOf(
                    "location",
                    "date",
                    "pmValue",
                    "forecastValue1",
                    "forecastValue2",
                    "forecastValue3",
                    "time1",
                    "time2",
                    "time3"
                )

                val viewIds = arrayOf(
                    R.id.location,
                    R.id.date,
                    R.id.pmValue,
                    R.id.forecastValue1,
                    R.id.forecastValue2,
                    R.id.forecastValue3,
                    R.id.time1,
                    R.id.time2,
                    R.id.time3
                )

                for (i in dataKeys.indices) {
                    val dataValue = widgetData.getString(dataKeys[i], null) ?: "--"
                    setTextViewText(viewIds[i], dataValue)
                }

                val pmValue = widgetData.getString("pmValue", null)


                fun setIndexColor(pmValue: String?) {
                    if (pmValue == null) {
                        setInt(R.id.index_color, "setBackgroundResource", R.drawable.green_circle)
                        setTextColor(R.id.pmScale, 0xff03B600.toInt())
                        setTextColor(R.id.pmValue, 0xff03B600.toInt())
                        setTextColor(R.id.pm_unit, 0xff03B600.toInt())

                    } else {
                        val pmValueDouble = pmValue.toDoubleOrNull()
                        if (pmValueDouble != null) {
                            when (pmValueDouble) {
                                in 0.0..12.0 -> {
                                    setInt(
                                        R.id.index_color,
                                        "setBackgroundResource",
                                        R.drawable.green_circle
                                    )
                                    setTextColor(R.id.pmScale, 0xff03B600.toInt())
                                    setTextColor(R.id.pmValue, 0xff03B600.toInt())
                                    setTextColor(R.id.pm_unit, 0xff03B600.toInt())
                                }

                                in 12.1..35.4 -> {
                                    setInt(
                                        R.id.index_color,
                                        "setBackgroundResource",
                                        R.drawable.yellow_circle
                                    )
                                    setTextColor(R.id.pmScale, 0xffA8A800.toInt())
                                    setTextColor(R.id.pmValue, 0xffA8A800.toInt())
                                    setTextColor(R.id.pm_unit, 0xffA8A800.toInt())
                                }
                                in 35.5..55.4 -> {
                                    setInt(
                                        R.id.index_color,
                                        "setBackgroundResource",
                                        R.drawable.orange_circle
                                    )
                                    setTextColor(R.id.pmScale, 0xffB86000.toInt())
                                    setTextColor(R.id.pmValue, 0xffB86000.toInt())
                                    setTextColor(R.id.pm_unit, 0xffB86000.toInt())
                                }
                                in 55.5..150.4 -> {
                                    setInt(
                                        R.id.index_color,
                                        "setBackgroundResource",
                                        R.drawable.red_circle
                                    )
                                    setTextColor(R.id.pmScale, 0xffB80B00.toInt())
                                    setTextColor(R.id.pmValue, 0xffB80B00.toInt())
                                    setTextColor(R.id.pm_unit, 0xffB80B00.toInt())
                                }
                                in 150.5..250.4 -> {
                                    setInt(
                                        R.id.index_color,
                                        "setBackgroundResource",
                                        R.drawable.purple_circle
                                    )
                                    setTextColor(R.id.pmScale, 0xff8E00AC.toInt())
                                    setTextColor(R.id.pmValue, 0xff8E00AC.toInt())
                                    setTextColor(R.id.pm_unit, 0xff8E00AC.toInt())

                                }
                                else -> {
                                    setInt(
                                        R.id.index_color,
                                        "setBackgroundResource",
                                        R.drawable.maroon_circle
                                    )
                                    setTextColor(R.id.pmScale, 0xffDBA5B2.toInt())
                                    setTextColor(R.id.pmValue, 0xffDBA5B2.toInt())
                                    setTextColor(R.id.pm_unit, 0xffDBA5B2.toInt())

                                }
                            }
                        }
                    }
                }

                setIndexColor(pmValue)
            }

            appWidgetManager.updateAppWidget(widgetId, views)
        }
    }

}


