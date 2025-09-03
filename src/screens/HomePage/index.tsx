"use client";
import { useSelector } from "react-redux";

import { RootState } from "@/store";

import EmptyScreen from "@/components/EmptyScreen";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";

const HomePage = () => {
  const count = useSelector((state: RootState) => state.widgets.widgets.length);

  return (
    <>
      <Header />
      {count == 0 ? <EmptyScreen /> : <Dashboard />}
    </>
  );
};

export default HomePage;
