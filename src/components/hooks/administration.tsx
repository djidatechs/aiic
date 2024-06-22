// src/context/WorkingHoursContext.js
import React, { createContext, useState, useEffect } from 'react';

export const WorkingHoursContext = createContext({});

export const WorkingHoursProvider = ({ children }) => {
  const [workingHours, setWorkingHours] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Fetch working hours from the API or data source
    const fetchData = async () => {
      // Assuming an API call is made here and data is returned
      const response = await fetch('/api/admin/workinghours');
      const data = await response.json();
      setWorkingHours(data);
      setTotalPages(Math.ceil(data.length / 10)); // Assuming 10 items per page
    };
    fetchData();
  }, []);

  const value = {
    workingHours,
    currentPage,
    setCurrentPage,
    totalPages,
  };

  return (
    <WorkingHoursContext.Provider value={value}>
      {children}
    </WorkingHoursContext.Provider>
  );
};
