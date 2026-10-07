import { createContext, useContext, useEffect, useState } from "react";
import { assignmentsApi } from "../api/assignmentsApi.js";

const TeacherAssignmentContext = createContext();

function AssignmentsProvider({ children }) {
  const [assignments, setAssignments] = useState([]);


  return (
    <TeacherAssignmentContext.Provider
      value={{
        assignments,
      }}
    >
      {children}
    </TeacherAssignmentContext.Provider>
  );
}

function useAssignments() {
  return useContext(TeacherAssignmentContext);
}

export { AssignmentsProvider, useAssignments };
