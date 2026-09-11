class WorkloadPlan {
  const WorkloadPlan({
    required this.recommendedTaskId,
    required this.recommendedTaskTitle,
    required this.starterAction,
    required this.encouragement,
    required this.resetPrompt,
    required this.usedAi,
  });

  final String? recommendedTaskId;
  final String recommendedTaskTitle;
  final String starterAction;
  final String encouragement;
  final String resetPrompt;
  final bool usedAi;

  factory WorkloadPlan.fromJson(Map<String, dynamic> json) {
    return WorkloadPlan(
      recommendedTaskId: json['recommendedTaskId'] as String?,
      recommendedTaskTitle: json['recommendedTaskTitle'] as String,
      starterAction: json['starterAction'] as String,
      encouragement: json['encouragement'] as String,
      resetPrompt: json['resetPrompt'] as String,
      usedAi: json['usedAi'] as bool,
    );
  }
}
