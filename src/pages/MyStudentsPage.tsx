// src/pages/MyStudentsPage.tsx
//
// Teacher-only page that lists all crew profiles whose `selectedTeacherIds`
// array contains the current user's UID. Students are grouped by the class
// names declared in the teacher's `teacherInfo.classes`. A student who picked
// the teacher but no specific class shows up in the "Other students" group.
//
// Access control: only renders content when current user has
// profileType === 'teacher'. Other users see an explanatory empty state.
//
// Linked from the user dropdown in Navigation.tsx.

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, getDoc, doc, query, where } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import type { CrewProfile, SelectedTeacherInfo } from '../types/CrewProfile';

interface StudentSummary {
  uid: string;
  name: string;
  username?: string;
  profileImageUrl?: string;
  institution?: string;
  /** Names of THIS teacher's classes the student declared enrollment in. */
  enrolledClasses: string[];
}

const UNGROUPED_KEY = '__ungrouped__';

const MyStudentsPage: React.FC = () => {
  const { t } = useTranslation();
  const [user, userLoading] = useAuthState(auth);

  const [teacherProfile, setTeacherProfile] = useState<CrewProfile | null>(null);
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load the current user's profile (so we know if they're a teacher and what
  // classes they teach) and then query all students who selected them.
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 1. Read the teacher's own profile
        const teacherSnap = await getDoc(doc(db, 'crewProfiles', user.uid));
        if (cancelled) return;

        const teacherData = teacherSnap.exists() ? (teacherSnap.data() as CrewProfile) : null;
        setTeacherProfile(teacherData);

        const isTeacher =
          teacherData?.profileType === 'teacher' || teacherData?.isTeacher === true;
        if (!isTeacher) {
          setStudents([]);
          setLoading(false);
          return;
        }

        // 2. Find all crew profiles where this teacher's UID is in selectedTeacherIds.
        //    Firestore array-contains is exactly the right query for this.
        const studentsQuery = query(
          collection(db, 'crewProfiles'),
          where('selectedTeacherIds', 'array-contains', user.uid)
        );
        const studentDocs = await getDocs(studentsQuery);
        if (cancelled) return;

        const summaries: StudentSummary[] = studentDocs.docs.map(snap => {
          const data = snap.data() as CrewProfile;
          // Find the entry for THIS teacher in the student's selectedTeachers
          // so we can read which classes the student enrolled in (if any).
          const entryForThisTeacher: SelectedTeacherInfo | undefined =
            data.selectedTeachers?.find(entry => entry.uid === user.uid);
          return {
            uid: data.uid || snap.id,
            name: data.name || data.username || t('myStudents.unnamedStudent'),
            username: data.username,
            profileImageUrl: data.profileImageUrl,
            institution: data.studentInfo?.institution || data.school,
            enrolledClasses: entryForThisTeacher?.classes || []
          };
        });

        setStudents(summaries);
      } catch (e: any) {
        if (cancelled) return;
        console.warn('[MyStudentsPage] load failed', e);
        setError(e?.message || 'Failed to load students');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user, t]);

  const teacherClasses = useMemo(
    () => teacherProfile?.teacherInfo?.classes?.filter(Boolean) || [],
    [teacherProfile]
  );

  const isTeacher =
    teacherProfile?.profileType === 'teacher' || teacherProfile?.isTeacher === true;

  // Group students by class name. Students with no class enrollment for this
  // teacher land in UNGROUPED_KEY ("Other students"). Students enrolled in
  // multiple classes intentionally appear in each group's list.
  const grouped = useMemo(() => {
    const groups = new Map<string, StudentSummary[]>();
    for (const className of teacherClasses) groups.set(className, []);
    groups.set(UNGROUPED_KEY, []);

    for (const student of students) {
      if (student.enrolledClasses.length === 0) {
        groups.get(UNGROUPED_KEY)!.push(student);
        continue;
      }
      let matchedAny = false;
      for (const className of student.enrolledClasses) {
        if (groups.has(className)) {
          groups.get(className)!.push(student);
          matchedAny = true;
        }
      }
      // If the student is enrolled in a class the teacher no longer offers,
      // surface them under "Other" so they aren't invisible.
      if (!matchedAny) groups.get(UNGROUPED_KEY)!.push(student);
    }
    return groups;
  }, [students, teacherClasses]);

  const exportCsv = () => {
    const rows: string[][] = [
      [
        t('myStudents.csv.name'),
        t('myStudents.csv.username'),
        t('myStudents.csv.institution'),
        t('myStudents.csv.classes')
      ]
    ];
    for (const s of students) {
      rows.push([
        s.name || '',
        s.username || '',
        s.institution || '',
        s.enrolledClasses.join('; ')
      ]);
    }
    const escape = (v: string) => `"${(v || '').replace(/"/g, '""')}"`;
    const csv = rows.map(r => r.map(escape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-students-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ---- Render branches ----

  if (userLoading || loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <p className="text-gray-500">{t('common.loading')}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-light text-gray-900 mb-3">{t('myStudents.title')}</h1>
        <p className="text-gray-600">
          {t('myStudents.signInPrompt')}{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">
            {t('nav.signIn')}
          </Link>
        </p>
      </div>
    );
  }

  if (!isTeacher) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-light text-gray-900 mb-3">{t('myStudents.title')}</h1>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <p className="text-amber-900 font-medium mb-2">{t('myStudents.notTeacherTitle')}</p>
          <p className="text-amber-800 text-sm mb-4">{t('myStudents.notTeacherBody')}</p>
          <Link
            to="/edit-profile"
            className="inline-block px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
          >
            {t('myStudents.goToProfile')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-light text-gray-900 tracking-tight">
            {t('myStudents.title')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('myStudents.subtitle', { count: students.length })}
          </p>
        </div>
        {students.length > 0 && (
          <button
            type="button"
            onClick={exportCsv}
            className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            {t('myStudents.exportCsv')}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-800 text-sm">
          {error}
        </div>
      )}

      {students.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-700 font-medium mb-2">{t('myStudents.emptyTitle')}</p>
          <p className="text-gray-500 text-sm">{t('myStudents.emptyBody')}</p>
        </div>
      ) : (
        <div className="space-y-10">
          {teacherClasses.map(className => {
            const classStudents = grouped.get(className) || [];
            return (
              <section key={className}>
                <div className="flex items-baseline justify-between mb-3 border-b border-gray-200 pb-2">
                  <h2 className="text-xl font-medium text-gray-900">{className}</h2>
                  <span className="text-sm text-gray-500">
                    {t('myStudents.classCount', { count: classStudents.length })}
                  </span>
                </div>
                {classStudents.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">{t('myStudents.noStudentsInClass')}</p>
                ) : (
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {classStudents.map(student => (
                      <StudentRow key={`${className}-${student.uid}`} student={student} />
                    ))}
                  </ul>
                )}
              </section>
            );
          })}

          {/* Always render the "Other" section so it doesn't quietly hide students */}
          <section>
            <div className="flex items-baseline justify-between mb-3 border-b border-gray-200 pb-2">
              <h2 className="text-xl font-medium text-gray-900">
                {t('myStudents.otherStudents')}
              </h2>
              <span className="text-sm text-gray-500">
                {t('myStudents.classCount', { count: grouped.get(UNGROUPED_KEY)?.length || 0 })}
              </span>
            </div>
            {(grouped.get(UNGROUPED_KEY)?.length || 0) === 0 ? (
              <p className="text-sm text-gray-500 italic">{t('myStudents.noOtherStudents')}</p>
            ) : (
              <ul className="grid sm:grid-cols-2 gap-3">
                {grouped.get(UNGROUPED_KEY)!.map(student => (
                  <StudentRow key={`other-${student.uid}`} student={student} />
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

const StudentRow: React.FC<{ student: StudentSummary }> = ({ student }) => {
  const { t } = useTranslation();
  const profileLink = student.username ? `/crew/${student.username}` : `/crew-public`;
  return (
    <li className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition">
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium overflow-hidden flex-shrink-0">
        {student.profileImageUrl ? (
          <img
            src={student.profileImageUrl}
            alt={student.name}
            className="w-full h-full object-cover"
          />
        ) : (
          (student.name?.[0] || '?').toUpperCase()
        )}
      </div>
      <div className="min-w-0 flex-1">
        <Link
          to={profileLink}
          className="block text-sm font-medium text-gray-900 hover:underline truncate"
        >
          {student.name}
        </Link>
        {student.institution && (
          <p className="text-xs text-gray-500 truncate">{student.institution}</p>
        )}
        {student.enrolledClasses.length > 1 && (
          <p className="text-xs text-gray-400 truncate" title={student.enrolledClasses.join(', ')}>
            {t('myStudents.alsoIn', { classes: student.enrolledClasses.join(', ') })}
          </p>
        )}
      </div>
    </li>
  );
};

export default MyStudentsPage;
