import 'package:flutter/material.dart';

import '../../core/student_identity.dart';
import '../../data/steady_api.dart';
import '../../models/task_item.dart';
import '../../models/workload_plan.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final SteadyApi _api = SteadyApi();
  final TextEditingController _titleController = TextEditingController();
  String? _studentId;
  List<TaskItem> _tasks = const [];
  WorkloadPlan? _plan;
  bool _loading = true;
  bool _planning = false;
  String? _errorMessage;
  int _stressLevel = 2;
  int _energyLevel = 2;
  int _capacityMinutes = 120;
  DateTime _newTaskDueDate = DateTime.now().add(const Duration(days: 1));
  int _newTaskMinutes = 30;
  TaskPriority _newTaskPriority = TaskPriority.important;

  @override
  void initState() {
    super.initState();
    _initialize();
  }

  @override
  void dispose() {
    _titleController.dispose();
    super.dispose();
  }

  Future<void> _initialize() async {
    final String studentId = await StudentIdentity.load();
    setState(() => _studentId = studentId);
    await _loadTasks();
  }

  Future<void> _loadTasks() async {
    if (_studentId == null) {
      return;
    }
    try {
      final List<TaskItem> tasks = await _api.getTasks(_studentId!);
      if (mounted) {
        setState(() {
          _tasks = tasks;
          _loading = false;
          _errorMessage = null;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _tasks = _demoTasks(_studentId!);
          _loading = false;
          _errorMessage = 'Connect the Java API to save changes and generate an AI plan.';
        });
      }
    }
  }

  Future<void> _addTask() async {
    final String title = _titleController.text.trim();
    if (title.isEmpty || _studentId == null) {
      return;
    }
    try {
      final TaskItem created = await _api.createTask(
        studentId: _studentId!,
        title: title,
        dueDate: _newTaskDueDate,
        estimateMinutes: _newTaskMinutes,
        priority: _newTaskPriority,
      );
      setState(() {
        _tasks = [..._tasks, created];
        _titleController.clear();
      });
    } on SteadyApiException catch (exception) {
      _showMessage(exception.message);
    }
  }

  Future<void> _toggleTask(TaskItem task, bool completed) async {
    if (_studentId == null) {
      return;
    }
    setState(() => _tasks = _tasks.map((TaskItem item) => item.id == task.id ? item.copyWith(completed: completed) : item).toList());
    try {
      await _api.updateCompletion(taskId: task.id, studentId: _studentId!, completed: completed);
    } on SteadyApiException catch (exception) {
      if (mounted) {
        setState(() => _tasks = _tasks.map((TaskItem item) => item.id == task.id ? task : item).toList());
      }
      _showMessage(exception.message);
    }
  }

  Future<void> _generatePlan() async {
    if (_studentId == null) {
      return;
    }
    setState(() => _planning = true);
    try {
      final WorkloadPlan plan = await _api.generatePlan(
        studentId: _studentId!,
        stressLevel: _stressLevel,
        energyLevel: _energyLevel,
        capacityMinutes: _capacityMinutes,
      );
      if (mounted) {
        setState(() {
          _plan = plan;
          _planning = false;
          _errorMessage = null;
        });
      }
    } on SteadyApiException catch (exception) {
      if (mounted) {
        setState(() => _planning = false);
      }
      _showMessage(exception.message);
    }
  }

  void _showMessage(String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  int get _openTaskCount => _tasks.where((TaskItem task) => !task.completed).length;

  int get _openMinutes => _tasks.where((TaskItem task) => !task.completed).fold(0, (int total, TaskItem task) => total + task.estimateMinutes);

  String get _workloadLabel {
    if (_openTaskCount == 0) return 'Clear runway';
    if (_openMinutes > _capacityMinutes * 1.25) return 'Overloaded';
    if (_openMinutes > _capacityMinutes) return 'Tight';
    return 'Manageable';
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    return Scaffold(
      appBar: AppBar(
        title: const Row(children: [Icon(Icons.auto_awesome_rounded), SizedBox(width: 8), Text('steady', style: TextStyle(fontWeight: FontWeight.w800))]),
      ),
      body: RefreshIndicator(
        onRefresh: _loadTasks,
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            const Text('GOOD MORNING, YOU’VE GOT THIS', style: TextStyle(letterSpacing: 1.4, color: Color(0xFF277B78), fontSize: 11, fontWeight: FontWeight.w700)),
            const SizedBox(height: 10),
            Text('Make space for\nwhat matters.', style: Theme.of(context).textTheme.displaySmall?.copyWith(fontWeight: FontWeight.w800, color: const Color(0xFF183333))),
            const SizedBox(height: 10),
            const Text('A small plan for your real energy, real time, and real life. No guilt. No grind.', style: TextStyle(color: Color(0xFF728180), height: 1.5)),
            const SizedBox(height: 24),
            _buildCheckinCard(),
            const SizedBox(height: 24),
            if (_errorMessage != null) _buildOfflineNotice(),
            const SizedBox(height: 12),
            const Text('YOUR DAY AT A GLANCE', style: TextStyle(letterSpacing: 1.4, color: Color(0xFF277B78), fontSize: 11, fontWeight: FontWeight.w700)),
            const SizedBox(height: 8),
            Text('A little clarity goes a long way.', style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800)),
            const SizedBox(height: 14),
            _buildMetrics(),
            const SizedBox(height: 24),
            _buildTaskInbox(),
            const SizedBox(height: 18),
            _buildPlanCard(),
            const SizedBox(height: 24),
            _buildResetCard(),
          ],
        ),
      ),
    );
  }

  Widget _buildCheckinCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Text('10-SECOND CHECK-IN', style: TextStyle(letterSpacing: 1.2, color: Color(0xFF277B78), fontSize: 11, fontWeight: FontWeight.w700)),
          const SizedBox(height: 8),
          Text('How are you arriving today?', style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800)),
          const SizedBox(height: 18),
          const Text('Stress level'),
          SegmentedButton<int>(
            segments: const [
              ButtonSegment(value: 1, label: Text('Low'), icon: Text('😌')),
              ButtonSegment(value: 2, label: Text('Okay'), icon: Text('🙂')),
              ButtonSegment(value: 3, label: Text('High'), icon: Text('😕')),
              ButtonSegment(value: 4, label: Text('Very high'), icon: Text('😣')),
            ],
            selected: {_stressLevel},
            onSelectionChanged: (Set<int> selection) => setState(() => _stressLevel = selection.first),
          ),
          const SizedBox(height: 18),
          Row(children: [
            Expanded(child: DropdownButtonFormField<int>(value: _energyLevel, decoration: const InputDecoration(labelText: 'Energy today', border: OutlineInputBorder()), items: const [DropdownMenuItem(value: 1, child: Text('Low')), DropdownMenuItem(value: 2, child: Text('Steady')), DropdownMenuItem(value: 3, child: Text('Good'))], onChanged: (int? value) => setState(() => _energyLevel = value ?? 2))),
            const SizedBox(width: 12),
            Expanded(child: DropdownButtonFormField<int>(value: _capacityMinutes, decoration: const InputDecoration(labelText: 'Time today', border: OutlineInputBorder()), items: const [DropdownMenuItem(value: 30, child: Text('30 min')), DropdownMenuItem(value: 60, child: Text('1 hour')), DropdownMenuItem(value: 120, child: Text('2 hours')), DropdownMenuItem(value: 240, child: Text('4+ hours'))], onChanged: (int? value) => setState(() => _capacityMinutes = value ?? 120))),
          ]),
          const SizedBox(height: 16),
          FilledButton.icon(onPressed: _planning ? null : _generatePlan, icon: _planning ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2)) : const Icon(Icons.auto_awesome), label: Text(_planning ? 'Creating your plan…' : 'Ask Steady AI')),
        ]),
      ),
    );
  }

  Widget _buildOfflineNotice() {
    return DecoratedBox(
      decoration: BoxDecoration(color: const Color(0xFFFFF3D6), borderRadius: BorderRadius.circular(12)),
      child: Padding(padding: const EdgeInsets.all(12), child: Text(_errorMessage!, style: const TextStyle(color: Color(0xFF7A5B18)))),
    );
  }

  Widget _buildMetrics() {
    return Row(children: [
      Expanded(child: _MetricCard(value: '$_openTaskCount', label: 'open tasks', icon: Icons.task_alt_outlined, color: const Color(0xFFF8E3D7))),
      const SizedBox(width: 10),
      Expanded(child: _MetricCard(value: _formatMinutes(_openMinutes), label: 'estimated work', icon: Icons.schedule_outlined, color: const Color(0xFFDCECF4))),
      const SizedBox(width: 10),
      Expanded(child: _MetricCard(value: _workloadLabel, label: 'workload status', icon: Icons.auto_awesome, color: const Color(0xFFDCEEE7))),
    ]);
  }

  Widget _buildTaskInbox() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [Text('Task inbox', style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800)), Chip(label: Text('$_openTaskCount open'))]),
          const Divider(),
          if (_tasks.isEmpty) const Padding(padding: EdgeInsets.symmetric(vertical: 18), child: Text('Nothing here yet. Add the first thing on your mind below.')),
          ..._tasks.map(_buildTaskRow),
          const Divider(height: 28),
          TextField(controller: _titleController, decoration: const InputDecoration(labelText: 'Add a task you’re carrying', border: OutlineInputBorder())),
          const SizedBox(height: 10),
          Wrap(spacing: 8, runSpacing: 8, crossAxisAlignment: WrapCrossAlignment.center, children: [
            OutlinedButton.icon(onPressed: _pickDueDate, icon: const Icon(Icons.calendar_today_outlined), label: Text(_formatDueDate(_newTaskDueDate))),
            DropdownButton<int>(value: _newTaskMinutes, items: const [DropdownMenuItem(value: 15, child: Text('15 min')), DropdownMenuItem(value: 30, child: Text('30 min')), DropdownMenuItem(value: 60, child: Text('1 hour')), DropdownMenuItem(value: 120, child: Text('2 hours'))], onChanged: (int? value) => setState(() => _newTaskMinutes = value ?? 30)),
            DropdownButton<TaskPriority>(value: _newTaskPriority, items: TaskPriority.values.map((TaskPriority value) => DropdownMenuItem(value: value, child: Text(TaskItem(id: '', studentId: '', title: '', dueDate: DateTime.now(), estimateMinutes: 0, priority: value, completed: false).priorityLabel))).toList(), onChanged: (TaskPriority? value) => setState(() => _newTaskPriority = value ?? TaskPriority.important)),
            FilledButton(onPressed: _addTask, child: const Text('Add task')),
          ]),
        ]),
      ),
    );
  }

  Widget _buildTaskRow(TaskItem task) {
    return CheckboxListTile(
      value: task.completed,
      onChanged: (bool? completed) => _toggleTask(task, completed ?? false),
      contentPadding: EdgeInsets.zero,
      title: Text(task.title, style: TextStyle(decoration: task.completed ? TextDecoration.lineThrough : null, fontWeight: FontWeight.w600)),
      subtitle: Text('${_formatDueDate(task.dueDate)} · ${_formatMinutes(task.estimateMinutes)}'),
      secondary: Chip(label: Text(task.priorityLabel)),
    );
  }

  Widget _buildPlanCard() {
    final WorkloadPlan? plan = _plan;
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(color: const Color(0xFF277B78), borderRadius: BorderRadius.circular(20)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Text('TODAY’S FOCUS', style: TextStyle(letterSpacing: 1.2, color: Color(0xFFDCEEE7), fontSize: 11, fontWeight: FontWeight.w700)),
        const SizedBox(height: 14),
        Text(plan?.recommendedTaskTitle ?? 'Ask Steady for your next step.', style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800, color: Colors.white)),
        const SizedBox(height: 10),
        Text(plan?.starterAction ?? 'Complete the check-in, then let the AI turn your workload into a small, realistic plan.', style: const TextStyle(color: Color(0xFFE7F5F1), height: 1.5)),
        const SizedBox(height: 14),
        if (plan != null) Text(plan.encouragement, style: const TextStyle(color: Color(0xFFDCEEE7), fontStyle: FontStyle.italic)),
        const SizedBox(height: 16),
        FilledButton.icon(style: FilledButton.styleFrom(backgroundColor: Colors.white, foregroundColor: const Color(0xFF1D5554)), onPressed: _planning ? null : _generatePlan, icon: const Icon(Icons.refresh), label: Text(plan?.usedAi == true ? 'Refresh AI plan' : 'Create my plan')),
      ]),
    );
  }

  Widget _buildResetCard() {
    return Card(
      child: ListTile(
        leading: const CircleAvatar(backgroundColor: Color(0xFFF8E3D7), child: Icon(Icons.favorite_border, color: Color(0xFFB65F39))),
        title: const Text('A quick reset', style: TextStyle(fontWeight: FontWeight.w800)),
        subtitle: Text(_plan?.resetPrompt ?? 'A 60-second pause can make the next 25 minutes feel lighter.'),
      ),
    );
  }

  Future<void> _pickDueDate() async {
    final DateTime? date = await showDatePicker(context: context, firstDate: DateTime.now().subtract(const Duration(days: 1)), lastDate: DateTime.now().add(const Duration(days: 365)), initialDate: _newTaskDueDate);
    if (date != null) setState(() => _newTaskDueDate = date);
  }

  String _formatMinutes(int minutes) => minutes >= 60 ? '${minutes ~/ 60}h${minutes % 60 == 0 ? '' : ' ${minutes % 60}m'}' : '$minutes min';

  String _formatDueDate(DateTime date) {
    final int days = DateUtils.dateOnly(date).difference(DateUtils.dateOnly(DateTime.now())).inDays;
    if (days < 0) return 'Overdue';
    if (days == 0) return 'Today';
    if (days == 1) return 'Tomorrow';
    return '${date.month}/${date.day}/${date.year}';
  }

  List<TaskItem> _demoTasks(String studentId) {
    final DateTime today = DateTime.now();
    return [
      TaskItem(id: 'demo-1', studentId: studentId, title: 'Finish research presentation', dueDate: today.add(const Duration(days: 1)), estimateMinutes: 90, priority: TaskPriority.mustDo, completed: false),
      TaskItem(id: 'demo-2', studentId: studentId, title: 'Reply to internship email', dueDate: today, estimateMinutes: 15, priority: TaskPriority.important, completed: false),
      TaskItem(id: 'demo-3', studentId: studentId, title: 'Read chapter 6 notes', dueDate: today.add(const Duration(days: 3)), estimateMinutes: 45, priority: TaskPriority.niceToDo, completed: false),
    ];
  }
}

class _MetricCard extends StatelessWidget {
  const _MetricCard({required this.value, required this.label, required this.icon, required this.color});

  final String value;
  final String label;
  final IconData icon;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          CircleAvatar(backgroundColor: color, child: Icon(icon, color: const Color(0xFF277B78))),
          const SizedBox(height: 12),
          Text(value, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
          const SizedBox(height: 2),
          Text(label, style: const TextStyle(fontSize: 11, color: Color(0xFF728180))),
        ]),
      ),
    );
  }
}
