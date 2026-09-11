import 'dart:convert';

import 'package:http/http.dart' as http;

import '../core/api_config.dart';
import '../models/task_item.dart';
import '../models/workload_plan.dart';

class SteadyApi {
  SteadyApi({http.Client? client}) : _client = client ?? http.Client();

  final http.Client _client;

  Future<List<TaskItem>> getTasks(String studentId) async {
    final Uri uri = Uri.parse('${ApiConfig.baseUrl}/tasks').replace(queryParameters: {'studentId': studentId});
    final http.Response response = await _client.get(uri);
    _ensureSuccess(response);
    final List<dynamic> payload = jsonDecode(response.body) as List<dynamic>;
    return payload.map((dynamic task) => TaskItem.fromJson(task as Map<String, dynamic>)).toList();
  }

  Future<TaskItem> createTask({
    required String studentId,
    required String title,
    required DateTime dueDate,
    required int estimateMinutes,
    required TaskPriority priority,
  }) async {
    final http.Response response = await _client.post(
      Uri.parse('${ApiConfig.baseUrl}/tasks'),
      headers: const {'Content-Type': 'application/json'},
      body: jsonEncode({
        'studentId': studentId,
        'title': title,
        'dueDate': dueDate.toIso8601String().split('T').first,
        'estimateMinutes': estimateMinutes,
        'priority': TaskItem.priorityToApi(priority),
      }),
    );
    _ensureSuccess(response);
    return TaskItem.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  Future<void> updateCompletion({
    required String taskId,
    required String studentId,
    required bool completed,
  }) async {
    final Uri uri = Uri.parse('${ApiConfig.baseUrl}/tasks/$taskId/completion').replace(queryParameters: {'studentId': studentId});
    final http.Response response = await _client.patch(
      uri,
      headers: const {'Content-Type': 'application/json'},
      body: jsonEncode({'completed': completed}),
    );
    _ensureSuccess(response);
  }

  Future<WorkloadPlan> generatePlan({
    required String studentId,
    required int stressLevel,
    required int energyLevel,
    required int capacityMinutes,
  }) async {
    final http.Response response = await _client.post(
      Uri.parse('${ApiConfig.baseUrl}/plans/generate'),
      headers: const {'Content-Type': 'application/json'},
      body: jsonEncode({
        'studentId': studentId,
        'stressLevel': stressLevel,
        'energyLevel': energyLevel,
        'capacityMinutes': capacityMinutes,
      }),
    );
    _ensureSuccess(response);
    return WorkloadPlan.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  void _ensureSuccess(http.Response response) {
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw SteadyApiException('The Steady API returned ${response.statusCode}.');
    }
  }
}

class SteadyApiException implements Exception {
  const SteadyApiException(this.message);

  final String message;

  @override
  String toString() => message;
}
