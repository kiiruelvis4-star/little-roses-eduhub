import React, { useEffect, useState } from 'react';
import {
AppScreen,
UserRole,
Student,
SchemeOfWork,
LessonPlan,
RecordOfWork,
Assignment,
Quiz,
ResourceItem,
TimetableSlot,
CalendarEvent,
} from './types';

import { storage } from './services/storageService';

import { SplashScreen } from './components/SplashScreen';
import { PortalSelectScreen } from './components/PortalSelectScreen';
import { TopAppBar } from './components/TopAppBar';

import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { LearnerDashboard } from './components/learner/LearnerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

import { OfflineIndicator } from './components/common/OfflineIndicator';
import { ExitAppModal } from './components/common/ExitAppModal';

export default function App() {
const [currentScreen, setCurrentScreen] =
useState<AppScreen>('splash');

const [activeRole, setActiveRole] =
useState<UserRole>('teacher');

const [selectedStudentId, setSelectedStudentId] =
useState<string>(() => storage.getActiveStudentId());

const [isTeacherInspectingLearner, setIsTeacherInspectingLearner] =
useState(false);

const [isExitModalOpen, setIsExitModalOpen] =
useState(false);

const [isDarkMode, setIsDarkMode] = useState(() => {
return (
document.documentElement.classList.contains('dark') ||
localStorage.getItem('little_roses_theme') === 'dark'
);
});

/* ---------------- THEME ---------------- */

useEffect(() => {
if (isDarkMode) {
document.documentElement.classList.add('dark');
document.documentElement.setAttribute('data-theme', 'dark');
document.body.classList.add('dark');
localStorage.setItem('little_roses_theme', 'dark');
} else {
document.documentElement.classList.remove('dark');
document.documentElement.removeAttribute('data-theme');
document.body.classList.remove('dark');
localStorage.setItem('little_roses_theme', 'light');
}
}, [isDarkMode]);

const toggleDarkMode = () => {
setIsDarkMode((previous) => !previous);
};

/* ---------------- APPLICATION DATA ---------------- */

const [students, setStudents] = useState<Student[]>(
() => storage.getStudents()
);

const [schemes, setSchemes] = useState<SchemeOfWork[]>(
() => storage.getSchemes()
);

const [lessons, setLessons] = useState<LessonPlan[]>(
() => storage.getLessonPlans()
);

const [records, setRecords] = useState<RecordOfWork[]>(
() => storage.getRecordsOfWork()
);

const [assignments, setAssignments] = useState<Assignment[]>(
() => storage.getAssignments()
);

const [quizzes, setQuizzes] = useState<Quiz[]>(
() => storage.getQuizzes()
);

const [resources, setResources] = useState<ResourceItem[]>(
() => storage.getResources()
);

const [timetable, setTimetable] = useState<TimetableSlot[]>(
() => storage.getTimetable()
);

const [events, setEvents] = useState<CalendarEvent[]>(
() => storage.getCalendarEvents()
);

/* ---------------- STORAGE SYNC ---------------- */

useEffect(() => {
const unsubscribe = storage.subscribe(() => {
setStudents(storage.getStudents());
setSchemes(storage.getSchemes());
setLessons(storage.getLessonPlans());
setRecords(storage.getRecordsOfWork());
setAssignments(storage.getAssignments());
setQuizzes(storage.getQuizzes());
setResources(storage.getResources());
setTimetable(storage.getTimetable());
setEvents(storage.getCalendarEvents());
});

return () => unsubscribe();

}, []);

/* ---------------- BACK BUTTON ---------------- */

useEffect(() => {
window.history.pushState(
{ page: 'little-roses-eduhub' },
'',
window.location.href
);

const handleBackButton = () => {
  if (
    currentScreen === 'splash' ||
    currentScreen === 'portal-select'
  ) {
    setIsExitModalOpen(true);
  } else {
    setCurrentScreen('portal-select');
    setIsTeacherInspectingLearner(false);
  }

  window.history.pushState(
    { page: 'little-roses-eduhub' },
    '',
    window.location.href
  );
};

window.addEventListener('popstate', handleBackButton);

return () => {
  window.removeEventListener('popstate', handleBackButton);
};

}, [currentScreen]);

/* ---------------- SPLASH ---------------- */

const handleSplashFinish = () => {
setCurrentScreen('portal-select');
};

/* ---------------- PORTALS ---------------- */

const handleSelectPortal = (
role: UserRole,
studentId?: string
) => {
setActiveRole(role);
setIsTeacherInspectingLearner(false);

if (studentId) {
  setSelectedStudentId(studentId);
  storage.setActiveStudentId(studentId);
}

if (role === 'teacher') {
  setCurrentScreen('teacher');
} else if (role === 'admin') {
  setCurrentScreen('admin');
} else {
  setCurrentScreen('learner');
}

};

/* ---------------- TEACHER → LEARNER ---------------- */

const handleTeacherInspectStudent = (studentId: string) => {
setSelectedStudentId(studentId);
storage.setActiveStudentId(studentId);

setIsTeacherInspectingLearner(true);
setCurrentScreen('learner');

};

/* ---------------- CURRENT LEARNER ---------------- */

const currentStudent =
students.find(
(student) => student.id === selectedStudentId
) || students[0];

/* ---------------- RENDER ---------------- */

return (
<div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">

  {/* SPLASH SCREEN */}

  {currentScreen === 'splash' && (
    <SplashScreen
      onComplete={handleSplashFinish}
      onFinish={handleSplashFinish}
    />
  )}

  {/* PORTAL SELECTION */}

  {currentScreen === 'portal-select' && (
    <div className="min-h-screen flex flex-col">

      <TopAppBar
        activeRole={null}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onSwitchRole={(role) => {
          if (role) {
            handleSelectPortal(
              role,
              selectedStudentId
            );
          }
        }}
        onSwitchPortal={(role) => {
          handleSelectPortal(
            role,
            selectedStudentId
          );
        }}
        onGoHome={() => {
          setCurrentScreen('portal-select');
        }}
      />

      <div className="flex-1">
        <PortalSelectScreen
          students={students}
          onSelectPortal={handleSelectPortal}
          onSelectRole={handleSelectPortal}
        />
      </div>
    </div>
  )}

  {/* TEACHER DASHBOARD */}

  {currentScreen === 'teacher' && (
    <div className="min-h-screen flex flex-col">

      <TopAppBar
        activeRole="teacher"
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onSwitchRole={(role) => {
          handleSelectPortal(
            role || 'learner',
            selectedStudentId
          );
        }}
        onSwitchPortal={(role) => {
          handleSelectPortal(
            role,
            selectedStudentId
          );
        }}
        onGoHome={() => {
          setCurrentScreen('portal-select');
        }}
      />

      <main className="flex-1">

        <TeacherDashboard
          students={students}
          schemes={schemes}
          lessons={lessons}
          records={records}
          assignments={assignments}
          quizzes={quizzes}
          resources={resources}
          timetable={timetable}
          events={events}
          onOpenLearnerDashboard={
            handleTeacherInspectStudent
          }
          onBackToPortals={() => {
            setCurrentScreen('portal-select');
          }}
        />

      </main>
    </div>
  )}

  {/* LEARNER DASHBOARD */}

  {currentScreen === 'learner' && currentStudent && (
    <div className="min-h-screen flex flex-col">

      <TopAppBar
        activeRole="learner"
        studentName={currentStudent.name}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onSwitchRole={(role) => {
          handleSelectPortal(
            role || 'teacher',
            selectedStudentId
          );
        }}
        onSwitchPortal={(role) => {
          handleSelectPortal(
            role,
            selectedStudentId
          );
        }}
        onGoHome={() => {

          if (isTeacherInspectingLearner) {
            setCurrentScreen('teacher');
            setIsTeacherInspectingLearner(false);
          } else {
            setCurrentScreen('portal-select');
          }

        }}
      />

      <main className="flex-1">

        <LearnerDashboard
          student={currentStudent}
          allStudents={students}
          assignments={assignments}
          quizzes={quizzes}
          resources={resources}
          events={events}
          onSwitchStudent={(id) => {
            setSelectedStudentId(id);
            storage.setActiveStudentId(id);
          }}
          onBackToPortals={() => {

            if (isTeacherInspectingLearner) {
              setCurrentScreen('teacher');
              setIsTeacherInspectingLearner(false);
            } else {
              setCurrentScreen('portal-select');
            }

          }}
          isTeacherViewing={
            isTeacherInspectingLearner
          }
        />

      </main>
    </div>
  )}

  {/* ADMIN DASHBOARD */}

  {currentScreen === 'admin' && (
    <div className="min-h-screen flex flex-col">

      <TopAppBar
        activeRole="admin"
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onSwitchRole={(role) => {
          if (role) {
            handleSelectPortal(
              role,
              selectedStudentId
            );
          }
        }}
        onSwitchPortal={(role) => {
          handleSelectPortal(
            role,
            selectedStudentId
          );
        }}
        onGoHome={() => {
          setCurrentScreen('portal-select');
        }}
      />

      <main className="flex-1">

        <AdminDashboard
          students={students}
          schemes={schemes}
          onOpenLearner={
            handleTeacherInspectStudent
          }
          onSwitchPortal={(role) => {
            handleSelectPortal(
              role,
              selectedStudentId
            );
          }}
          onBackToPortals={() => {
            setCurrentScreen('portal-select');
          }}
        />

      </main>
    </div>
  )}

  {/* OFFLINE INDICATOR */}

  <OfflineIndicator />

  {/* EXIT MODAL */}

  <ExitAppModal
    isOpen={isExitModalOpen}
    onStay={() => {
      setIsExitModalOpen(false);
    }}
    onExit={() => {
      setIsExitModalOpen(false);
      setCurrentScreen('splash');
    }}
  />

</div>

);
}