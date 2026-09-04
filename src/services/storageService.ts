import { 
  Student, 
  SchemeOfWork, 
  LessonPlan, 
  RecordOfWork, 
  Assignment, 
  Quiz, 
  ResourceItem, 
  TimetableSlot, 
  CalendarEvent, 
  Notice, 
  GradeLevel, 
  SubjectName,
  STANDARD_SUBJECTS,
  SystemConfig,
  SchoolMetadata,
  KNECProjectModule,
  ExamSeriesPaper,
  CATSRootEngine,
  CATAttemptStatus,
  BlankLessonPlanSheet,
  StaffMember,
  TeacherProfile,
  BellPeriodSlot
} from '../types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_SCHEMES, 
  INITIAL_LESSON_PLANS, 
  INITIAL_RECORDS_OF_WORK, 
  INITIAL_ASSIGNMENTS, 
  INITIAL_QUIZZES, 
  INITIAL_RESOURCES, 
  INITIAL_TIMETABLE, 
  INITIAL_CALENDAR_EVENTS, 
  INITIAL_NOTICES,
  INITIAL_STAFF
} from '../data/initialData';
import {
  TEACHER_PROFILES,
  BELL_SCHEDULE_SLOTS,
  MASTER_TEACHER_SCHEDULE,
  MASTER_TEACHER_PASSWORD,
  MASTER_ADMIN_PASSWORD,
  ADMIN_AUTH_CONFIG,
  TEACHER_AUTH_CONFIG,
  OFFICIAL_ADMIN_PASSWORD,
  OFFICIAL_TEACHER_PASSWORDS,
  ROLES_AND_PERMISSIONS,
  RESOURCE_INPUT_TYPES
} from '../data/teacherTimetableData';
import {
  INITIAL_SYSTEM_CONFIG,
  INITIAL_KNEC_PROJECTS,
  INITIAL_EXAM_SERIES
} from '../data/academicCalendarsData';
import { INITIAL_CATS_ROOT_ENGINE } from '../data/catsRootEngineData';
import { 
  RATIONALIZED_INITIAL_SCHEMES, 
  INITIAL_BLANK_LESSON_PLAN_SHEETS,
  createBlankLessonPlanTemplate
} from '../data/cbeRationalizedCurriculumData';

const ALL_INITIAL_SCHEMES = [...RATIONALIZED_INITIAL_SCHEMES, ...INITIAL_SCHEMES];

const STORAGE_KEYS = {
  STUDENTS: 'lra_students_v1',
  SCHEMES: 'lra_schemes_v1',
  LESSONS: 'lra_lessons_v1',
  LESSON_PLAN_SHEETS: 'lra_blank_lesson_plan_sheets_v1',
  RECORDS: 'lra_records_v1',
  ASSIGNMENTS: 'lra_assignments_v1',
  QUIZZES: 'lra_quizzes_v1',
  RESOURCES: 'lra_resources_v1',
  TIMETABLE: 'lra_timetable_v1',
  CALENDAR: 'lra_calendar_v1',
  NOTICES: 'lra_notices_v1',
  THEME: 'lra_theme_mode',
  LAST_SYNC: 'lra_last_sync_timestamp',
  ACTIVE_STUDENT_ID: 'lra_active_student_id',
  SYSTEM_CONFIG: 'lra_system_config_v1',
  KNEC_PROJECTS: 'lra_knec_projects_v1',
  EXAM_SERIES: 'lra_exam_series_v1',
  CATS_ROOT_ENGINE: 'lra_cats_root_engine_v1',
  STAFF: 'lra_staff_members_v1',
  ACTIVE_TEACHER_ID: 'lra_active_teacher_id_v2',
  TEACHER_PROFILES: 'lra_teacher_profiles_v1',
  MASTER_TEACHER_TIMETABLE: 'lra_master_teacher_timetable_v1'
};

class StorageService {
  private listeners: Set<() => void> = new Set();

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.updateLastSync();
    this.listeners.forEach(cb => cb());
  }

  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data);
    } catch (e) {
      console.warn(`Error reading key ${key} from storage:`, e);
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.notify();
    } catch (e) {
      console.error(`Error saving key ${key} to storage:`, e);
    }
  }

  // Sync info
  public getLastSyncTime(): string {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || 'Just now';
  }

  public updateLastSync(): void {
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  }

  public triggerManualSync(): void {
    this.updateLastSync();
    this.notify();
  }

  // Active student for Learner portal
  public getActiveStudentId(): string {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT_ID) || 'std-601';
  }

  public setActiveStudentId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT_ID, id);
    this.notify();
  }

  // Students
  public getStudents(): Student[] {
    return this.getItem<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  }

  public getStudentById(id: string): Student | undefined {
    return this.getStudents().find(s => s.id === id);
  }

  public getStudentsByGrade(grade: GradeLevel): Student[] {
    return this.getStudents().filter(s => s.grade === grade);
  }

  public saveStudent(student: Student): void {
    const list = this.getStudents();
    const idx = list.findIndex(s => s.id === student.id);
    if (idx >= 0) {
      list[idx] = student;
    } else {
      list.unshift(student);
    }
    this.setItem(STORAGE_KEYS.STUDENTS, list);
  }

  public updateStudentCAT(
    studentId: string, 
    subject: SubjectName, 
    field: 'cat1' | 'cat2' | 'endTerm', 
    value: number
  ): void {
    const list = this.getStudents();
    const student = list.find(s => s.id === studentId);
    if (student) {
      if (!student.catMarks[subject]) {
        student.catMarks[subject] = { cat1: 0, cat2: 0, endTerm: 0 };
      }
      student.catMarks[subject][field] = Number(value) || 0;
      this.setItem(STORAGE_KEYS.STUDENTS, list);
    }
  }

  public deleteStudent(id: string): void {
    const list = this.getStudents().filter(s => s.id !== id);
    this.setItem(STORAGE_KEYS.STUDENTS, list);
  }

  // Schemes of Work (Termly covering Grade 1 to 6 across all rationalized subjects)
  public getSchemes(): SchemeOfWork[] {
    return this.getItem<SchemeOfWork[]>(STORAGE_KEYS.SCHEMES, ALL_INITIAL_SCHEMES);
  }

  public saveScheme(scheme: SchemeOfWork): void {
    const list = this.getSchemes();
    const idx = list.findIndex(s => s.id === scheme.id);
    if (idx >= 0) {
      list[idx] = scheme;
    } else {
      list.unshift(scheme);
    }
    this.setItem(STORAGE_KEYS.SCHEMES, list);
  }

  public deleteScheme(id: string): void {
    const list = this.getSchemes().filter(s => s.id !== id);
    this.setItem(STORAGE_KEYS.SCHEMES, list);
  }

  // Quick Lesson Plans
  public getLessonPlans(): LessonPlan[] {
    return this.getItem<LessonPlan[]>(STORAGE_KEYS.LESSONS, INITIAL_LESSON_PLANS);
  }

  public saveLessonPlan(plan: LessonPlan): void {
    const list = this.getLessonPlans();
    const idx = list.findIndex(s => s.id === plan.id);
    if (idx >= 0) {
      list[idx] = plan;
    } else {
      list.unshift(plan);
    }
    this.setItem(STORAGE_KEYS.LESSONS, list);
  }

  public deleteLessonPlan(id: string): void {
    const list = this.getLessonPlans().filter(s => s.id !== id);
    this.setItem(STORAGE_KEYS.LESSONS, list);
  }

  // Official CBE Blank Lesson Plan Sheets (4-part structure: Administrative, Curriculum Alignment, 5 Steps, Reflection)
  public getLessonPlanSheets(): BlankLessonPlanSheet[] {
    return this.getItem<BlankLessonPlanSheet[]>(STORAGE_KEYS.LESSON_PLAN_SHEETS, INITIAL_BLANK_LESSON_PLAN_SHEETS);
  }

  public saveLessonPlanSheet(sheet: BlankLessonPlanSheet): void {
    const list = this.getLessonPlanSheets();
    const idx = list.findIndex(s => s.id === sheet.id);
    const toSave: BlankLessonPlanSheet = {
      ...sheet,
      updatedAt: new Date().toISOString()
    };
    if (idx >= 0) {
      list[idx] = toSave;
    } else {
      list.unshift(toSave);
    }
    this.setItem(STORAGE_KEYS.LESSON_PLAN_SHEETS, list);
  }

  public deleteLessonPlanSheet(id: string): void {
    const list = this.getLessonPlanSheets().filter(s => s.id !== id);
    this.setItem(STORAGE_KEYS.LESSON_PLAN_SHEETS, list);
  }

  public createBlankLessonPlanSheet(defaults?: Partial<BlankLessonPlanSheet>): BlankLessonPlanSheet {
    const cfg = this.getSystemConfig();
    return createBlankLessonPlanTemplate(cfg, defaults);
  }

  // Records of Work
  public getRecordsOfWork(): RecordOfWork[] {
    return this.getItem<RecordOfWork[]>(STORAGE_KEYS.RECORDS, INITIAL_RECORDS_OF_WORK);
  }

  public saveRecordOfWork(record: RecordOfWork): void {
    const list = this.getRecordsOfWork();
    const idx = list.findIndex(s => s.id === record.id);
    if (idx >= 0) {
      list[idx] = record;
    } else {
      list.unshift(record);
    }
    this.setItem(STORAGE_KEYS.RECORDS, list);
  }

  public deleteRecordOfWork(id: string): void {
    const list = this.getRecordsOfWork().filter(s => s.id !== id);
    this.setItem(STORAGE_KEYS.RECORDS, list);
  }

  // Assignments
  public getAssignments(): Assignment[] {
    return this.getItem<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
  }

  public saveAssignment(assignment: Assignment): void {
    const list = this.getAssignments();
    const idx = list.findIndex(s => s.id === assignment.id);
    if (idx >= 0) {
      list[idx] = assignment;
    } else {
      list.unshift(assignment);
    }
    this.setItem(STORAGE_KEYS.ASSIGNMENTS, list);
  }

  public deleteAssignment(id: string): void {
    const list = this.getAssignments().filter(s => s.id !== id);
    this.setItem(STORAGE_KEYS.ASSIGNMENTS, list);
  }

  // Quizzes
  public getQuizzes(): Quiz[] {
    return this.getItem<Quiz[]>(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
  }

  public saveQuiz(quiz: Quiz): void {
    const list = this.getQuizzes();
    const idx = list.findIndex(s => s.id === quiz.id);
    if (idx >= 0) {
      list[idx] = quiz;
    } else {
      list.unshift(quiz);
    }
    this.setItem(STORAGE_KEYS.QUIZZES, list);
  }

  public deleteQuiz(id: string): void {
    const list = this.getQuizzes().filter(s => s.id !== id);
    this.setItem(STORAGE_KEYS.QUIZZES, list);
  }

  // Resources
  public getResources(): ResourceItem[] {
    return this.getItem<ResourceItem[]>(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
  }

  public saveResource(res: ResourceItem): void {
    const list = this.getResources();
    const idx = list.findIndex(s => s.id === res.id);
    if (idx >= 0) {
      list[idx] = res;
    } else {
      list.unshift(res);
    }
    this.setItem(STORAGE_KEYS.RESOURCES, list);
  }

  public deleteResource(id: string): void {
    const list = this.getResources().filter(s => s.id !== id);
    this.setItem(STORAGE_KEYS.RESOURCES, list);
  }

  // Timetable
  public getTimetable(): TimetableSlot[] {
    return this.getItem<TimetableSlot[]>(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE);
  }

  public saveTimetableSlot(slot: TimetableSlot): void {
    const list = this.getTimetable();
    const idx = list.findIndex(s => s.id === slot.id);
    if (idx >= 0) {
      list[idx] = slot;
    } else {
      list.push(slot);
    }
    this.setItem(STORAGE_KEYS.TIMETABLE, list);
  }

  public updateTimetableGrid(grade: GradeLevel, slots: TimetableSlot[]): void {
    const otherSlots = this.getTimetable().filter(s => s.grade !== grade);
    this.setItem(STORAGE_KEYS.TIMETABLE, [...otherSlots, ...slots]);
  }

  // Calendar
  public getCalendarEvents(): CalendarEvent[] {
    return this.getItem<CalendarEvent[]>(STORAGE_KEYS.CALENDAR, INITIAL_CALENDAR_EVENTS);
  }

  public saveCalendarEvent(event: CalendarEvent): void {
    const list = this.getCalendarEvents();
    const idx = list.findIndex(s => s.id === event.id);
    if (idx >= 0) {
      list[idx] = event;
    } else {
      list.unshift(event);
    }
    this.setItem(STORAGE_KEYS.CALENDAR, list);
  }

  public deleteCalendarEvent(id: string): void {
    const list = this.getCalendarEvents().filter(s => s.id !== id);
    this.setItem(STORAGE_KEYS.CALENDAR, list);
  }

  // Notices
  public getNotices(): Notice[] {
    return this.getItem<Notice[]>(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
  }

  public saveNotice(notice: Notice): void {
    const list = this.getNotices();
    const idx = list.findIndex(s => s.id === notice.id);
    if (idx >= 0) {
      list[idx] = notice;
    } else {
      list.unshift(notice);
    }
    this.setItem(STORAGE_KEYS.NOTICES, list);
  }

  public deleteNotice(id: string): void {
    const list = this.getNotices().filter(s => s.id !== id);
    this.setItem(STORAGE_KEYS.NOTICES, list);
  }

  // Staff Members Management
  public getStaffMembers(): StaffMember[] {
    return this.getItem<StaffMember[]>(STORAGE_KEYS.STAFF, INITIAL_STAFF);
  }

  public saveStaffMember(member: StaffMember): void {
    const list = this.getStaffMembers();
    const idx = list.findIndex(m => m.id === member.id);
    if (idx >= 0) {
      list[idx] = member;
    } else {
      list.push(member);
    }
    this.setItem(STORAGE_KEYS.STAFF, list);
  }

  public deleteStaffMember(id: string): void {
    const list = this.getStaffMembers().filter(m => m.id !== id);
    this.setItem(STORAGE_KEYS.STAFF, list);
  }

  public resetStaffMembers(): void {
    this.setItem(STORAGE_KEYS.STAFF, INITIAL_STAFF);
  }

  // Teacher Profiles & Authentication Management
  public getTeacherProfiles(): TeacherProfile[] {
    return this.getItem<TeacherProfile[]>(STORAGE_KEYS.TEACHER_PROFILES, TEACHER_PROFILES);
  }

  public saveTeacherProfile(profile: TeacherProfile): void {
    const list = this.getTeacherProfiles();
    const idx = list.findIndex(p => p.id === profile.id);
    if (idx >= 0) {
      list[idx] = profile;
    } else {
      list.push(profile);
    }
    this.setItem(STORAGE_KEYS.TEACHER_PROFILES, list);
  }

  public getAuthenticatedTeacherId(): string | null {
    return this.getItem<string | null>(STORAGE_KEYS.ACTIVE_TEACHER_ID, null);
  }

  public setAuthenticatedTeacherId(teacherId: string | null): void {
    if (teacherId) {
      this.setItem(STORAGE_KEYS.ACTIVE_TEACHER_ID, teacherId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_TEACHER_ID);
    }
    this.notify();
  }

  public getActiveTeacherProfile(): TeacherProfile {
    const activeId = this.getAuthenticatedTeacherId();
    const profiles = this.getTeacherProfiles();
    if (activeId) {
      const found = profiles.find(p => p.id === activeId);
      if (found) return found;
    }
    return profiles[0] || TEACHER_PROFILES[0];
  }

  public verifyTeacherPassword(password?: string, teacherId?: string): boolean {
    if (!password || !password.trim()) return false;
    const clean = password.trim();

    // 1. If teacherId is specified, check against that teacher's exact password
    if (teacherId) {
      const normalizedId = teacherId.toLowerCase().replace('tr-', '');
      const expectedPassword = OFFICIAL_TEACHER_PASSWORDS[normalizedId] || OFFICIAL_TEACHER_PASSWORDS[`tr-${normalizedId}`];
      if (expectedPassword && clean === expectedPassword) {
        return true;
      }
    }

    // 2. Also check if matches any teacher password in OFFICIAL_TEACHER_PASSWORDS
    for (const p of Object.values(OFFICIAL_TEACHER_PASSWORDS)) {
      if (clean === p) return true;
    }

    // 3. Fallback checks for backward compatibility
    const cleanLower = clean.replace(/[\s,]/g, '').toLowerCase();
    const masterClean = MASTER_TEACHER_PASSWORD.replace(/[\s,]/g, '').toLowerCase();
    return cleanLower === masterClean || cleanLower === 'lra@2026' || cleanLower === 'lra2026';
  }

  public verifyAdminPassword(password?: string): boolean {
    if (!password || !password.trim()) return false;
    const clean = password.trim();
    if (clean === OFFICIAL_ADMIN_PASSWORD) return true;
    const cleanLower = clean.replace(/[\s.]/g, '').toLowerCase();
    const masterClean = OFFICIAL_ADMIN_PASSWORD.replace(/[\s.]/g, '').toLowerCase();
    return cleanLower === masterClean || cleanLower === 'lra2025' || cleanLower === 'lra@2025';
  }

  public isTeacherAuthenticated(): boolean {
    try {
      return sessionStorage.getItem('lra_teacher_authenticated') === 'true';
    } catch {
      return false;
    }
  }

  public setTeacherAuthenticated(authenticated: boolean): void {
    try {
      if (authenticated) {
        sessionStorage.setItem('lra_teacher_authenticated', 'true');
      } else {
        sessionStorage.removeItem('lra_teacher_authenticated');
      }
    } catch {
      // ignore
    }
  }

  public isAdminAuthenticated(): boolean {
    try {
      return sessionStorage.getItem('lra_admin_authenticated') === 'true';
    } catch {
      return false;
    }
  }

  public setAdminAuthenticated(authenticated: boolean): void {
    try {
      if (authenticated) {
        sessionStorage.setItem('lra_admin_authenticated', 'true');
      } else {
        sessionStorage.removeItem('lra_admin_authenticated');
      }
    } catch {
      // ignore
    }
  }

  public canEditTimetable(role: 'admin' | 'teacher' | 'learner', isAdminOverride?: boolean): boolean {
    if (role === 'admin' || isAdminOverride || this.isAdminAuthenticated()) return true;
    // Teachers have READ_ONLY for timetableOverrides
    return false;
  }

  public canWriteResources(role: 'admin' | 'teacher' | 'learner', isAdminOverride?: boolean): boolean {
    if (role === 'admin' || isAdminOverride || this.isAdminAuthenticated()) return true;
    // Teachers have READ_ONLY for textbooksAndResources
    return false;
  }

  public getRolePermissions(role: 'admin' | 'teacher' | 'learner') {
    const sys = this.getSystemConfig();
    if (role === 'admin') {
      return sys.rolesAndPermissions?.ADMIN?.permissions || ROLES_AND_PERMISSIONS.ADMIN.permissions;
    }
    if (role === 'teacher') {
      return sys.rolesAndPermissions?.TEACHERS?.permissions || ROLES_AND_PERMISSIONS.TEACHERS.permissions;
    }
    return {
      textbooksAndResources: 'READ_ONLY' as const,
      timetableOverrides: 'READ_ONLY' as const
    };
  }

  public getClockSettings() {
    const sys = this.getSystemConfig();
    return sys.clockSettings || {
      displaySeconds: true,
      format: 'HH:MM:SS',
      syncSource: 'device_local_time'
    };
  }

  public getResourceInputTypes() {
    const sys = this.getSystemConfig();
    return sys.resourceInputTypes || RESOURCE_INPUT_TYPES;
  }

  // Teacher-Specific Timetable Slots
  public getMasterTeacherSchedule(): TimetableSlot[] {
    return this.getItem<TimetableSlot[]>(STORAGE_KEYS.MASTER_TEACHER_TIMETABLE, MASTER_TEACHER_SCHEDULE);
  }

  public saveMasterTeacherSchedule(slots: TimetableSlot[]): void {
    this.setItem(STORAGE_KEYS.MASTER_TEACHER_TIMETABLE, slots);
  }

  public getTeacherTimetable(teacherId: string): TimetableSlot[] {
    const all = this.getMasterTeacherSchedule();
    return all.filter(s => s.teacherId === teacherId);
  }

  // System Config & School Metadata
  public getSystemConfig(): SystemConfig {
    const cfg = this.getItem<SystemConfig>(STORAGE_KEYS.SYSTEM_CONFIG, INITIAL_SYSTEM_CONFIG);
    return {
      ...INITIAL_SYSTEM_CONFIG,
      ...cfg,
      appName: "Little Roses EduHub",
      version: "2.0.0",
      clockSettings: {
        ...INITIAL_SYSTEM_CONFIG.clockSettings,
        ...(cfg.clockSettings || {})
      },
      rolesAndPermissions: {
        ...INITIAL_SYSTEM_CONFIG.rolesAndPermissions,
        ...(cfg.rolesAndPermissions || {})
      },
      resourceInputTypes: INITIAL_SYSTEM_CONFIG.resourceInputTypes,
      school_metadata: {
        ...INITIAL_SYSTEM_CONFIG.school_metadata,
        ...(cfg.school_metadata || {}),
        po_box: cfg.school_metadata?.po_box || 'P.O. Box 3443 NAKURU',
        school_name: (!cfg.school_metadata?.school_name || cfg.school_metadata?.school_name === 'Editable School Name') ? 'Little Roses Academy' : cfg.school_metadata.school_name
      }
    };
  }

  public saveSystemConfig(cfg: Partial<SystemConfig>): void {
    const current = this.getSystemConfig();
    const updated: SystemConfig = {
      ...current,
      ...cfg,
      school_metadata: {
        ...current.school_metadata,
        ...(cfg.school_metadata || {})
      }
    };
    this.setItem(STORAGE_KEYS.SYSTEM_CONFIG, updated);
  }

  public updateSchoolMetadata(meta: Partial<SchoolMetadata>): void {
    const current = this.getSystemConfig();
    this.saveSystemConfig({
      school_metadata: {
        ...current.school_metadata,
        ...meta
      }
    });
  }

  // KNEC CBA Projects
  public getKNECProjects(): KNECProjectModule[] {
    return this.getItem<KNECProjectModule[]>(STORAGE_KEYS.KNEC_PROJECTS, INITIAL_KNEC_PROJECTS);
  }

  public saveKNECProject(project: KNECProjectModule): void {
    const list = this.getKNECProjects();
    const idx = list.findIndex(p => p.id === project.id);
    if (idx >= 0) {
      list[idx] = project;
    } else {
      list.unshift(project);
    }
    this.setItem(STORAGE_KEYS.KNEC_PROJECTS, list);
  }

  // Exam Series
  public getExamSeries(): ExamSeriesPaper[] {
    return this.getItem<ExamSeriesPaper[]>(STORAGE_KEYS.EXAM_SERIES, INITIAL_EXAM_SERIES);
  }

  public saveExamSeriesPaper(paper: ExamSeriesPaper): void {
    const list = this.getExamSeries();
    const idx = list.findIndex(p => p.id === paper.id);
    if (idx >= 0) {
      list[idx] = paper;
    } else {
      list.unshift(paper);
    }
    this.setItem(STORAGE_KEYS.EXAM_SERIES, list);
  }

  public scheduleExamToCalendar(paper: ExamSeriesPaper): void {
    const eventDate = paper.scheduledWeeks.includes('Oct 12') ? '2026-10-12' :
                      paper.scheduledWeeks.includes('Oct 19') ? '2026-10-19' :
                      paper.scheduledWeeks.includes('Aug 24') ? '2026-08-24' : '2026-10-15';
    const newEvent: CalendarEvent = {
      id: `ev-exam-${paper.id}`,
      title: `${paper.publisherShort}: ${paper.title}`,
      date: eventDate,
      category: 'Exams / CAT',
      description: `Official ${paper.publisher} scheduled exam set for ${paper.grade} ${paper.subject}. Paper Code: ${paper.paperCode}. Duration: ${paper.durationMinutes} mins.`,
      term: paper.term
    };
    this.saveCalendarEvent(newEvent);
    paper.status = 'Scheduled';
    this.saveExamSeriesPaper(paper);
  }

  // ==========================================
  // GLOBAL CBE EVALUATION ENGINE (cats_root_engine)
  // ==========================================
  public getCATSRootEngine(): CATSRootEngine {
    return this.getItem<CATSRootEngine>(STORAGE_KEYS.CATS_ROOT_ENGINE, INITIAL_CATS_ROOT_ENGINE);
  }

  public saveCATSRootEngine(engine: CATSRootEngine): void {
    this.setItem(STORAGE_KEYS.CATS_ROOT_ENGINE, engine);
  }

  public updateSubStrandScore(
    classLevel: string,
    subjectName: string,
    strandName: string,
    subStrandName: string,
    score: number,
    status: CATAttemptStatus,
    learnerAnswers?: Record<number, string>
  ): void {
    const engine = this.getCATSRootEngine();
    const targetClass = engine.classes.find(c => c.class_level.toLowerCase() === classLevel.toLowerCase());
    if (!targetClass) return;

    const targetSubject = targetClass.subjects.find(s => 
      s.subject_name.toLowerCase().includes(subjectName.toLowerCase()) || 
      subjectName.toLowerCase().includes(s.subject_name.toLowerCase())
    );
    if (!targetSubject) return;

    const targetStrand = targetSubject.strands.find(st => st.strand_name.toLowerCase() === strandName.toLowerCase()) || targetSubject.strands[0];
    if (!targetStrand) return;

    const targetSubStrand = targetStrand.sub_strands.find(sub => sub.sub_strand_name.toLowerCase() === subStrandName.toLowerCase()) || targetStrand.sub_strands[0];
    if (!targetSubStrand) return;

    targetSubStrand.cat_score = score;
    targetSubStrand.status = status;
    targetSubStrand.completedAt = new Date().toISOString();
    if (learnerAnswers) {
      targetSubStrand.learnerAnswers = learnerAnswers;
    }

    this.saveCATSRootEngine(engine);
  }

  public resetCATSRootEngine(): void {
    this.setItem(STORAGE_KEYS.CATS_ROOT_ENGINE, INITIAL_CATS_ROOT_ENGINE);
  }

  // Reset to original demo dataset
  public resetToFactoryDemo(): void {
    localStorage.clear();
    this.notify();
  }

  // Export JSON backup
  public exportDataJSON(): string {
    const fullState = {
      systemConfig: this.getSystemConfig(),
      catsRootEngine: this.getCATSRootEngine(),
      knecProjects: this.getKNECProjects(),
      examSeries: this.getExamSeries(),
      students: this.getStudents(),
      schemes: this.getSchemes(),
      lessons: this.getLessonPlans(),
      lessonPlanSheets: this.getLessonPlanSheets(),
      records: this.getRecordsOfWork(),
      assignments: this.getAssignments(),
      quizzes: this.getQuizzes(),
      resources: this.getResources(),
      timetable: this.getTimetable(),
      calendar: this.getCalendarEvents(),
      notices: this.getNotices(),
      staff: this.getStaffMembers(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(fullState, null, 2);
  }

  // Import JSON backup
  public importDataJSON(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.systemConfig) this.setItem(STORAGE_KEYS.SYSTEM_CONFIG, data.systemConfig);
      if (data.catsRootEngine) this.setItem(STORAGE_KEYS.CATS_ROOT_ENGINE, data.catsRootEngine);
      if (data.knecProjects) this.setItem(STORAGE_KEYS.KNEC_PROJECTS, data.knecProjects);
      if (data.examSeries) this.setItem(STORAGE_KEYS.EXAM_SERIES, data.examSeries);
      if (data.students) this.setItem(STORAGE_KEYS.STUDENTS, data.students);
      if (data.schemes) this.setItem(STORAGE_KEYS.SCHEMES, data.schemes);
      if (data.lessons) this.setItem(STORAGE_KEYS.LESSONS, data.lessons);
      if (data.lessonPlanSheets) this.setItem(STORAGE_KEYS.LESSON_PLAN_SHEETS, data.lessonPlanSheets);
      if (data.records) this.setItem(STORAGE_KEYS.RECORDS, data.records);
      if (data.assignments) this.setItem(STORAGE_KEYS.ASSIGNMENTS, data.assignments);
      if (data.quizzes) this.setItem(STORAGE_KEYS.QUIZZES, data.quizzes);
      if (data.resources) this.setItem(STORAGE_KEYS.RESOURCES, data.resources);
      if (data.timetable) this.setItem(STORAGE_KEYS.TIMETABLE, data.timetable);
      if (data.calendar) this.setItem(STORAGE_KEYS.CALENDAR, data.calendar);
      if (data.notices) this.setItem(STORAGE_KEYS.NOTICES, data.notices);
      if (data.staff) this.setItem(STORAGE_KEYS.STAFF, data.staff);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }
}

export const storage = new StorageService();
