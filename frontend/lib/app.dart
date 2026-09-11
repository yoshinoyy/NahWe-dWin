import 'package:flutter/material.dart';

import 'features/dashboard/dashboard_screen.dart';

class SteadyApp extends StatelessWidget {
  const SteadyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final ColorScheme colors = ColorScheme.fromSeed(
      seedColor: const Color(0xFF277B78),
      brightness: Brightness.light,
      surface: const Color(0xFFF7FAF8),
    );

    return MaterialApp(
      title: 'Steady',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: colors,
        scaffoldBackgroundColor: const Color(0xFFF7FAF8),
        appBarTheme: const AppBarTheme(backgroundColor: Color(0xFFF7FAF8)),
        cardTheme: CardThemeData(
          elevation: 0,
          color: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        ),
      ),
      home: const DashboardScreen(),
    );
  }
}
