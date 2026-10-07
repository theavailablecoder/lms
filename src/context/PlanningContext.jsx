import { createContext, useContext, useState } from 'react';
import { starterCalendarEvents } from '../data/mockData.js';
import { planningApi } from '../api/planningApi.js';

const PlanningContext = createContext(null);

export function PlanningProvider({ children }) {
  const [calendarEvents, setCalendarEvents] = useState(starterCalendarEvents);
  const [exams, setExamsState] = useState(() => planningApi.getInitialExams());

  const addCalendarEvent = async (event) => {
    setCalendarEvents(await planningApi.addCalendarEvent(event));
  };
  const setExams = (next) => {
    setExamsState((current) => {
      const resolved = typeof next === 'function' ? next(current) : next;
      planningApi.saveExams(resolved);
      return resolved;
    });
  };

  return (
    <PlanningContext.Provider value={{ calendarEvents, addCalendarEvent, exams, setExams }}>
      {children}
    </PlanningContext.Provider>
  );
}

export function usePlanning() {
  const value = useContext(PlanningContext);
  if (!value) throw new Error('usePlanning must be used within PlanningProvider');
  return value;
}
