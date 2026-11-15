import { Suspense } from "react";
import Dashboard from "./dashboard";

const AdminHomePage = () => {
  return (
    <Suspense>
      <Dashboard />
    </Suspense>
  );
};

export default AdminHomePage;