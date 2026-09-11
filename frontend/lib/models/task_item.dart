enum TaskPriority { niceToDo, important, mustDo }

class TaskItem {
  const TaskItem({
    required this.id,
    required this.studentId,
    required this.title,
    required this.dueDate,
    required this.estimateMinutes,
    required this.priority,
    required this.completed,
  });

  final String id;
  final String studentId;
  final String title;
  final DateTime dueDate;
  final int estimateMinutes;
  final TaskPriority priority;
  final bool completed;

  factory TaskItem.fromJson(Map<String, dynamic> json) {
    return TaskItem(
      id: json['id'] as String,
      studentId: json['studentId'] as String,
      title: json['title'] as String,
      dueDate: DateTime.parse(json['dueDate'] as String),
      estimateMinutes: json['estimateMinutes'] as int,
      priority: _priorityFromApi(json['priority'] as String),
      completed: json['completed'] as bool,
    );
  }

  TaskItem copyWith({bool? completed}) {
    return TaskItem(
      id: id,
      studentId: studentId,
      title: title,
      dueDate: dueDate,
      estimateMinutes: estimateMinutes,
      priority: priority,
      completed: completed ?? this.completed,
    );
  }

  static TaskPriority _priorityFromApi(String value) {
    return switch (value) {
      'MUST_DO' => TaskPriority.mustDo,
      'IMPORTANT' => TaskPriority.important,
      _ => TaskPriority.niceToDo,
    };
  }

  static String priorityToApi(TaskPriority priority) {
    return switch (priority) {
      TaskPriority.mustDo => 'MUST_DO',
      TaskPriority.important => 'IMPORTANT',
      TaskPriority.niceToDo => 'NICE_TO_DO',
    };
  }

  String get priorityLabel => switch (priority) {
        TaskPriority.mustDo => 'Must do',
        TaskPriority.important => 'Important',
        TaskPriority.niceToDo => 'Nice to do',
      };
}
