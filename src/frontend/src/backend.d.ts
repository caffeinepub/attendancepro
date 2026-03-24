import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Class {
    id: bigint;
    facultyId: Principal;
    subject: string;
    name: string;
    createdAt: Time;
    section: string;
    studentIds: Array<Principal>;
    schedule: string;
}
export type Time = bigint;
export interface AttendanceSession {
    id: bigint;
    status: string;
    facultyId: Principal;
    date: Time;
    classId: bigint;
}
export interface User {
    id: Principal;
    facultyId?: string;
    studentId?: string;
    name: string;
    createdAt: Time;
    role: UserRole;
    email: string;
    department?: string;
}
export interface BulkAttendanceEntry {
    status: string;
    studentId: Principal;
}
export interface AttendanceRecord {
    id: bigint;
    status: string;
    studentId: Principal;
    classId: bigint;
    markedAt: Time;
    sessionId: bigint;
}
export interface Alert {
    id: bigint;
    resolved: boolean;
    alertType: string;
    studentId: Principal;
    createdAt: Time;
    classId: bigint;
    percentage: bigint;
}
export interface UserProfile {
    facultyId?: string;
    studentId?: string;
    name: string;
    role: UserRole;
    email: string;
    department?: string;
}
export interface AttendanceStats {
    attended: bigint;
    totalSessions: bigint;
    percentage: bigint;
}
export enum UserRole {
    admin = "admin",
    faculty = "faculty",
    student = "student"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    bulkMarkAttendance(sessionId: bigint, entries: Array<BulkAttendanceEntry>): Promise<Array<bigint>>;
    closeAttendanceSession(sessionId: bigint): Promise<void>;
    createAttendanceSession(classId: bigint, date: Time): Promise<bigint>;
    createClass(name: string, subject: string, section: string, studentIds: Array<Principal>, schedule: string): Promise<bigint>;
    createUser(userId: Principal, name: string, email: string, role: UserRole, studentId: string | null, facultyId: string | null, department: string | null): Promise<void>;
    deleteClass(classId: bigint): Promise<void>;
    deleteUser(userId: Principal): Promise<void>;
    getAllAlerts(): Promise<Array<Alert>>;
    getAllClassesWithStats(): Promise<Array<[Class, AttendanceStats]>>;
    getAllUsers(): Promise<Array<User>>;
    getAttendanceSessionDetails(sessionId: bigint): Promise<{
        records: Array<AttendanceRecord>;
        session: AttendanceSession;
    }>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getClassAttendanceStats(classId: bigint): Promise<Array<{
        studentId: Principal;
        attended: bigint;
        totalSessions: bigint;
        percentage: bigint;
    }>>;
    getEnrolledClasses(): Promise<Array<Class>>;
    getFacultyClasses(): Promise<Array<Class>>;
    getStudentAlerts(): Promise<Array<Alert>>;
    getStudentAttendanceByClass(classId: bigint): Promise<AttendanceStats>;
    getStudentAttendanceHistory(classIdFilter: bigint | null, startDate: Time | null, endDate: Time | null): Promise<Array<AttendanceRecord>>;
    getSystemAnalytics(): Promise<{
        lowAttendanceCount: bigint;
        totalClasses: bigint;
        avgAttendance: bigint;
    }>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUsersByRole(role: UserRole): Promise<Array<User>>;
    isCallerAdmin(): Promise<boolean>;
    markAttendance(sessionId: bigint, studentId: Principal, status: string): Promise<bigint>;
    reopenAttendanceSession(sessionId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateAttendance(recordId: bigint, status: string): Promise<void>;
    updateClass(classId: bigint, name: string, subject: string, section: string, studentIds: Array<Principal>, schedule: string): Promise<void>;
    updateUser(userId: Principal, name: string, email: string, role: UserRole, studentId: string | null, facultyId: string | null, department: string | null): Promise<void>;
}
