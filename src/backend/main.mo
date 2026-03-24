import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Set "mo:core/Set";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Data Types
  public type UserRole = {
    #admin;
    #faculty;
    #student;
  };

  public type User = {
    id : Principal;
    name : Text;
    email : Text;
    role : UserRole;
    studentId : ?Text;
    facultyId : ?Text;
    department : ?Text;
    createdAt : Time.Time;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    role : UserRole;
    studentId : ?Text;
    facultyId : ?Text;
    department : ?Text;
  };

  public type Class = {
    id : Nat;
    name : Text;
    subject : Text;
    section : Text;
    facultyId : Principal;
    studentIds : [Principal];
    schedule : Text;
    createdAt : Time.Time;
  };

  public type AttendanceSession = {
    id : Nat;
    classId : Nat;
    date : Time.Time;
    facultyId : Principal;
    status : Text; // "open" or "closed"
  };

  public type AttendanceRecord = {
    id : Nat;
    sessionId : Nat;
    studentId : Principal;
    classId : Nat;
    status : Text; // "present", "absent", "late"
    markedAt : Time.Time;
  };

  public type Alert = {
    id : Nat;
    studentId : Principal;
    classId : Nat;
    alertType : Text; // "low_attendance"
    percentage : Nat;
    createdAt : Time.Time;
    resolved : Bool;
  };

  public type AttendanceStats = {
    totalSessions : Nat;
    attended : Nat;
    percentage : Nat;
  };

  public type BulkAttendanceEntry = {
    studentId : Principal;
    status : Text;
  };

  // State variables
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let users = Map.empty<Principal, User>();
  let classes = Map.empty<Nat, Class>();
  let attendanceSessions = Map.empty<Nat, AttendanceSession>();
  let attendanceRecords = Map.empty<Nat, AttendanceRecord>();
  let alerts = Map.empty<Nat, Alert>();

  var nextClassId : Nat = 1;
  var nextSessionId : Nat = 1;
  var nextRecordId : Nat = 1;
  var nextAlertId : Nat = 1;

  // Helper function to convert UserRole to AccessControl.UserRole
  func toAccessControlRole(role : UserRole) : AccessControl.UserRole {
    switch (role) {
      case (#admin) { #admin };
      case (#faculty) { #user };
      case (#student) { #user };
    };
  };

  // Profile Management (Required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    switch (users.get(caller)) {
      case (null) { null };
      case (?user) {
        ?{
          name = user.name;
          email = user.email;
          role = user.role;
          studentId = user.studentId;
          facultyId = user.facultyId;
          department = user.department;
        };
      };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (users.get(user)) {
      case (null) { null };
      case (?u) {
        ?{
          name = u.name;
          email = u.email;
          role = u.role;
          studentId = u.studentId;
          facultyId = u.facultyId;
          department = u.department;
        };
      };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    switch (users.get(caller)) {
      case (null) {
        Runtime.trap("User not found");
      };
      case (?existingUser) {
        let updatedUser : User = {
          id = existingUser.id;
          name = profile.name;
          email = profile.email;
          role = existingUser.role; // Role cannot be changed via profile update
          studentId = profile.studentId;
          facultyId = profile.facultyId;
          department = profile.department;
          createdAt = existingUser.createdAt;
        };
        users.add(caller, updatedUser);
      };
    };
  };

  // ADMIN FUNCTIONS

  public shared ({ caller }) func createUser(
    userId : Principal,
    name : Text,
    email : Text,
    role : UserRole,
    studentId : ?Text,
    facultyId : ?Text,
    department : ?Text
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create users");
    };

    let newUser : User = {
      id = userId;
      name;
      email;
      role;
      studentId;
      facultyId;
      department;
      createdAt = Time.now();
    };

    users.add(userId, newUser);
    
    // Assign role in access control system
    let acRole = toAccessControlRole(role);
    AccessControl.assignRole(accessControlState, caller, userId, acRole);
  };

  public shared ({ caller }) func updateUser(
    userId : Principal,
    name : Text,
    email : Text,
    role : UserRole,
    studentId : ?Text,
    facultyId : ?Text,
    department : ?Text
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update users");
    };

    switch (users.get(userId)) {
      case (null) {
        Runtime.trap("User not found");
      };
      case (?existingUser) {
        let updatedUser : User = {
          id = userId;
          name;
          email;
          role;
          studentId;
          facultyId;
          department;
          createdAt = existingUser.createdAt;
        };
        users.add(userId, updatedUser);
        
        // Update role in access control system
        let acRole = toAccessControlRole(role);
        AccessControl.assignRole(accessControlState, caller, userId, acRole);
      };
    };
  };

  public shared ({ caller }) func deleteUser(userId : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete users");
    };
    users.remove(userId);
  };

  public query ({ caller }) func getAllUsers() : async [User] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    users.values().toArray();
  };

  public query ({ caller }) func getUsersByRole(role : UserRole) : async [User] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view users by role");
    };
    let filtered = users.values().toArray().filter(
      func(user : User) : Bool { user.role == role }
    );
    filtered;
  };

  public query ({ caller }) func getSystemAnalytics() : async {
    totalClasses : Nat;
    avgAttendance : Nat;
    lowAttendanceCount : Nat;
  } {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view system analytics");
    };

    let totalClasses = classes.size();
    let unresolvedAlerts = alerts.values().toArray().filter(
      func(alert : Alert) : Bool { not alert.resolved }
    );
    
    // Calculate average attendance (simplified)
    var totalAttendance : Nat = 0;
    var sessionCount : Nat = 0;
    for (session in attendanceSessions.values()) {
      let records = attendanceRecords.values().toArray().filter(
        func(r : AttendanceRecord) : Bool { r.sessionId == session.id }
      );
      let presentCount = records.filter(
        func(r : AttendanceRecord) : Bool { r.status == "present" }
      ).size();
      if (records.size() > 0) {
        totalAttendance += (presentCount * 100) / records.size();
        sessionCount += 1;
      };
    };
    
    let avgAttendance = if (sessionCount > 0) { totalAttendance / sessionCount } else { 0 };

    {
      totalClasses;
      avgAttendance;
      lowAttendanceCount = unresolvedAlerts.size();
    };
  };

  public query ({ caller }) func getAllClassesWithStats() : async [(Class, AttendanceStats)] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all classes");
    };

    let classArray = classes.values().toArray();
    classArray.map<Class, (Class, AttendanceStats)>(
      func(cls : Class) : (Class, AttendanceStats) {
        let sessions = attendanceSessions.values().toArray().filter(
          func(s : AttendanceSession) : Bool { s.classId == cls.id }
        );
        
        var totalPresent : Nat = 0;
        for (session in sessions.vals()) {
          let records = attendanceRecords.values().toArray().filter(
            func(r : AttendanceRecord) : Bool { 
              r.sessionId == session.id and r.status == "present"
            }
          );
          totalPresent += records.size();
        };
        
        let totalSessions = sessions.size();
        let totalPossible = totalSessions * cls.studentIds.size();
        let percentage = if (totalPossible > 0) {
          (totalPresent * 100) / totalPossible
        } else { 0 };

        let stats : AttendanceStats = {
          totalSessions;
          attended = totalPresent;
          percentage;
        };
        (cls, stats);
      }
    );
  };

  public query ({ caller }) func getAllAlerts() : async [Alert] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all alerts");
    };
    alerts.values().toArray();
  };

  // FACULTY FUNCTIONS

  public shared ({ caller }) func createClass(
    name : Text,
    subject : Text,
    section : Text,
    studentIds : [Principal],
    schedule : Text
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only faculty can create classes");
    };

    // Verify caller is faculty
    switch (users.get(caller)) {
      case (null) {
        Runtime.trap("User not found");
      };
      case (?user) {
        if (user.role != #faculty) {
          Runtime.trap("Unauthorized: Only faculty can create classes");
        };
      };
    };

    let classId = nextClassId;
    nextClassId += 1;

    let newClass : Class = {
      id = classId;
      name;
      subject;
      section;
      facultyId = caller;
      studentIds;
      schedule;
      createdAt = Time.now();
    };

    classes.add(classId, newClass);
    classId;
  };

  public shared ({ caller }) func updateClass(
    classId : Nat,
    name : Text,
    subject : Text,
    section : Text,
    studentIds : [Principal],
    schedule : Text
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only faculty can update classes");
    };

    switch (classes.get(classId)) {
      case (null) {
        Runtime.trap("Class not found");
      };
      case (?existingClass) {
        // Verify ownership
        if (existingClass.facultyId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own classes");
        };

        let updatedClass : Class = {
          id = classId;
          name;
          subject;
          section;
          facultyId = existingClass.facultyId;
          studentIds;
          schedule;
          createdAt = existingClass.createdAt;
        };
        classes.add(classId, updatedClass);
      };
    };
  };

  public shared ({ caller }) func deleteClass(classId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only faculty can delete classes");
    };

    switch (classes.get(classId)) {
      case (null) {
        Runtime.trap("Class not found");
      };
      case (?existingClass) {
        // Verify ownership
        if (existingClass.facultyId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own classes");
        };
        classes.remove(classId);
      };
    };
  };

  public query ({ caller }) func getFacultyClasses() : async [Class] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only faculty can view their classes");
    };

    let filtered = classes.values().toArray().filter(
      func(cls : Class) : Bool { cls.facultyId == caller }
    );
    filtered;
  };

  public shared ({ caller }) func createAttendanceSession(classId : Nat, date : Time.Time) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only faculty can create attendance sessions");
    };

    switch (classes.get(classId)) {
      case (null) {
        Runtime.trap("Class not found");
      };
      case (?cls) {
        // Verify ownership
        if (cls.facultyId != caller) {
          Runtime.trap("Unauthorized: Can only create sessions for your own classes");
        };

        let sessionId = nextSessionId;
        nextSessionId += 1;

        let newSession : AttendanceSession = {
          id = sessionId;
          classId;
          date;
          facultyId = caller;
          status = "open";
        };

        attendanceSessions.add(sessionId, newSession);
        sessionId;
      };
    };
  };

  public shared ({ caller }) func markAttendance(
    sessionId : Nat,
    studentId : Principal,
    status : Text
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only faculty can mark attendance");
    };

    switch (attendanceSessions.get(sessionId)) {
      case (null) {
        Runtime.trap("Session not found");
      };
      case (?session) {
        // Verify ownership
        if (session.facultyId != caller) {
          Runtime.trap("Unauthorized: Can only mark attendance for your own sessions");
        };

        let recordId = nextRecordId;
        nextRecordId += 1;

        let newRecord : AttendanceRecord = {
          id = recordId;
          sessionId;
          studentId;
          classId = session.classId;
          status;
          markedAt = Time.now();
        };

        attendanceRecords.add(recordId, newRecord);
        recordId;
      };
    };
  };

  public shared ({ caller }) func updateAttendance(
    recordId : Nat,
    status : Text
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only faculty can update attendance");
    };

    switch (attendanceRecords.get(recordId)) {
      case (null) {
        Runtime.trap("Record not found");
      };
      case (?record) {
        switch (attendanceSessions.get(record.sessionId)) {
          case (null) {
            Runtime.trap("Session not found");
          };
          case (?session) {
            // Verify ownership
            if (session.facultyId != caller) {
              Runtime.trap("Unauthorized: Can only update attendance for your own sessions");
            };

            let updatedRecord : AttendanceRecord = {
              id = record.id;
              sessionId = record.sessionId;
              studentId = record.studentId;
              classId = record.classId;
              status;
              markedAt = Time.now();
            };
            attendanceRecords.add(recordId, updatedRecord);
          };
        };
      };
    };
  };

  public shared ({ caller }) func bulkMarkAttendance(
    sessionId : Nat,
    entries : [BulkAttendanceEntry]
  ) : async [Nat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only faculty can mark attendance");
    };

    switch (attendanceSessions.get(sessionId)) {
      case (null) {
        Runtime.trap("Session not found");
      };
      case (?session) {
        // Verify ownership
        if (session.facultyId != caller) {
          Runtime.trap("Unauthorized: Can only mark attendance for your own sessions");
        };

        let recordIds = entries.map(
          func(entry : BulkAttendanceEntry) : Nat {
            let recordId = nextRecordId;
            nextRecordId += 1;

            let newRecord : AttendanceRecord = {
              id = recordId;
              sessionId;
              studentId = entry.studentId;
              classId = session.classId;
              status = entry.status;
              markedAt = Time.now();
            };

            attendanceRecords.add(recordId, newRecord);
            recordId;
          }
        );
        recordIds;
      };
    };
  };

  public query ({ caller }) func getAttendanceSessionDetails(sessionId : Nat) : async {
    session : AttendanceSession;
    records : [AttendanceRecord];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only faculty can view session details");
    };

    switch (attendanceSessions.get(sessionId)) {
      case (null) {
        Runtime.trap("Session not found");
      };
      case (?session) {
        // Verify ownership
        if (session.facultyId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own sessions");
        };

        let records = attendanceRecords.values().toArray().filter(
          func(r : AttendanceRecord) : Bool { r.sessionId == sessionId }
        );

        { session; records };
      };
    };
  };

  public query ({ caller }) func getClassAttendanceStats(classId : Nat) : async [{
    studentId : Principal;
    totalSessions : Nat;
    attended : Nat;
    percentage : Nat;
  }] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only faculty can view class statistics");
    };

    switch (classes.get(classId)) {
      case (null) {
        Runtime.trap("Class not found");
      };
      case (?cls) {
        // Verify ownership
        if (cls.facultyId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view statistics for your own classes");
        };

        let sessions = attendanceSessions.values().toArray().filter(
          func(s : AttendanceSession) : Bool { s.classId == classId }
        );
        let totalSessions = sessions.size();

        cls.studentIds.map<Principal, {
          studentId : Principal;
          totalSessions : Nat;
          attended : Nat;
          percentage : Nat;
        }>(
          func(studentId : Principal) : {
            studentId : Principal;
            totalSessions : Nat;
            attended : Nat;
            percentage : Nat;
          } {
            let records = attendanceRecords.values().toArray().filter(
              func(r : AttendanceRecord) : Bool {
                r.classId == classId and r.studentId == studentId and r.status == "present"
              }
            );
            let attended = records.size();
            let percentage = if (totalSessions > 0) {
              (attended * 100) / totalSessions
            } else { 0 };

            {
              studentId;
              totalSessions;
              attended;
              percentage;
            };
          }
        );
      };
    };
  };

  public shared ({ caller }) func closeAttendanceSession(sessionId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only faculty can close sessions");
    };

    switch (attendanceSessions.get(sessionId)) {
      case (null) {
        Runtime.trap("Session not found");
      };
      case (?session) {
        // Verify ownership
        if (session.facultyId != caller) {
          Runtime.trap("Unauthorized: Can only close your own sessions");
        };

        let updatedSession : AttendanceSession = {
          id = session.id;
          classId = session.classId;
          date = session.date;
          facultyId = session.facultyId;
          status = "closed";
        };
        attendanceSessions.add(sessionId, updatedSession);
      };
    };
  };

  public shared ({ caller }) func reopenAttendanceSession(sessionId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only faculty can reopen sessions");
    };

    switch (attendanceSessions.get(sessionId)) {
      case (null) {
        Runtime.trap("Session not found");
      };
      case (?session) {
        // Verify ownership
        if (session.facultyId != caller) {
          Runtime.trap("Unauthorized: Can only reopen your own sessions");
        };

        let updatedSession : AttendanceSession = {
          id = session.id;
          classId = session.classId;
          date = session.date;
          facultyId = session.facultyId;
          status = "open";
        };
        attendanceSessions.add(sessionId, updatedSession);
      };
    };
  };

  // STUDENT FUNCTIONS

  public query ({ caller }) func getEnrolledClasses() : async [Class] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only students can view enrolled classes");
    };

    let filtered = classes.values().toArray().filter(
      func(cls : Class) : Bool {
        cls.studentIds.find<Principal>(func(id : Principal) : Bool { id == caller }) != null
      }
    );
    filtered;
  };

  public query ({ caller }) func getStudentAttendanceByClass(classId : Nat) : async AttendanceStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only students can view their attendance");
    };

    switch (classes.get(classId)) {
      case (null) {
        Runtime.trap("Class not found");
      };
      case (?cls) {
        // Verify enrollment
        let isEnrolled = cls.studentIds.find<Principal>(
          func(id : Principal) : Bool { id == caller }
        ) != null;

        if (not isEnrolled and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Not enrolled in this class");
        };

        let sessions = attendanceSessions.values().toArray().filter(
          func(s : AttendanceSession) : Bool { s.classId == classId }
        );
        let totalSessions = sessions.size();

        let records = attendanceRecords.values().toArray().filter(
          func(r : AttendanceRecord) : Bool {
            r.classId == classId and r.studentId == caller and r.status == "present"
          }
        );
        let attended = records.size();

        let percentage = if (totalSessions > 0) {
          (attended * 100) / totalSessions
        } else { 0 };

        {
          totalSessions;
          attended;
          percentage;
        };
      };
    };
  };

  public query ({ caller }) func getStudentAttendanceHistory(
    classIdFilter : ?Nat,
    startDate : ?Time.Time,
    endDate : ?Time.Time
  ) : async [AttendanceRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only students can view their attendance history");
    };

    let allRecords = attendanceRecords.values().toArray();
    
    let filtered = allRecords.filter(
      func(r : AttendanceRecord) : Bool {
        if (r.studentId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          return false;
        };

        switch (classIdFilter) {
          case (?cid) {
            if (r.classId != cid) { return false };
          };
          case null {};
        };

        switch (startDate) {
          case (?start) {
            if (r.markedAt < start) { return false };
          };
          case null {};
        };

        switch (endDate) {
          case (?end) {
            if (r.markedAt > end) { return false };
          };
          case null {};
        };

        true;
      }
    );

    filtered;
  };

  public query ({ caller }) func getStudentAlerts() : async [Alert] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only students can view their alerts");
    };

    let filtered = alerts.values().toArray().filter(
      func(alert : Alert) : Bool {
        alert.studentId == caller or AccessControl.isAdmin(accessControlState, caller)
      }
    );
    filtered;
  };
};
