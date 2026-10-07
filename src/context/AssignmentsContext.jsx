import { createContext, useContext, useEffect, useState } from "react";
import { starterAssignments } from "../data/mockData.js";
import { assignmentsApi } from "../api/assignmentsApi.js";

const AssignmentsContext = createContext();

function AssignmentsProvider({ children }) {
  const [assignments, setAssignments] = useState(starterAssignments);

  // Get all assignments
  useEffect(() => {
    assignmentsApi.list().then((data) => {
      setAssignments(data);
    });
  }, []);

  // Add assignment
  const addAssignment = (data) => {
    assignmentsApi.create(data).then((result) => {
      setAssignments(result);
    });
  };

  // Edit assignment
  const editAssignment = (id, data) => {
    assignmentsApi.update(id, data).then((result) => {
      setAssignments(result);
    });
  };

  // Delete assignment
  const deleteAssignment = (id) => {
    assignmentsApi.remove(id).then((result) => {
      setAssignments(result);
    });
  };

  // Submit homework
  const submitHomework = (id, data) => {
    assignmentsApi.submit(id, data).then((result) => {
      setAssignments(result);
    });
  };

  // Review homework
  const reviewHomework = (id, data) => {
    assignmentsApi.review(id, data).then((result) => {
      setAssignments(result);
    });
  };

  return (
    <AssignmentsContext.Provider
      value={{
        assignments,
        assigned: assignments,
        addAssignment,
        editAssignment,
        deleteAssignment,
        submitHomework,
        reviewHomework,
      }}
    >
      {children}
    </AssignmentsContext.Provider>
  );
}

function useAssignments() {
  return useContext(AssignmentsContext);
}

export { AssignmentsProvider, useAssignments };