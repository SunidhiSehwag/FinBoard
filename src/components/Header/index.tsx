"use client";
import { useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";

import { RootState } from "@/store";
import { finBoardIcon } from "@/helpers/images";
import AddWidgetDialog from "../AddWidgetDialog";

import classes from "./Header.module.css";

const Header = () => {
  const count = useSelector((state: RootState) => state.widgets.widgets.length);
  const [addWidgetActive, setAddWidgetActive] = useState(false);

  const addButtonClickHandler = () => {
    setAddWidgetActive(true);
  };

  const handleClose = () => {
    setAddWidgetActive(false);
  };

  return (
    <div className={classes.header}>
      <div className={classes.companyName}>
        <Image
          src={finBoardIcon.src}
          alt="finBoard Logo"
          className={classes.logo}
          height={20}
          width={20}
        />
        <div>
          <div className={classes.heading}>Finance Dashboard</div>
          <div className={classes.bottomContent}>
            {count > 0 ? (
              <div>
                <span>{count} active widgets</span>
                <span> · </span>
                <span>Real-time data</span>
              </div>
            ) : (
              <span>Connect to APIs and build your custom dashboard</span>
            )}
          </div>
        </div>
      </div>

      <button className={classes.addButton} onClick={addButtonClickHandler}>
        + Add Widget
      </button>
      <AddWidgetDialog open={addWidgetActive} onClose={handleClose} />
    </div>
  );
};

export default Header;
