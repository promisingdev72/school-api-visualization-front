import React from "react";
import { useRoutes } from "react-router-dom";

import NewsPage from "../pages/news";
import CalendarPage from "../pages/calendars";

export default function Routes() {
  return useRoutes([
    { path: "/newstab", element: <NewsPage /> },
    { path: "/calendarsaccordion", element: <CalendarPage /> },
  ]);
}
