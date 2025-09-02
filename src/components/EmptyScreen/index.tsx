import Image from "next/image";

import { HomePageLogo } from "@/helpers/images";

import classes from "./EmptyScreen.module.css";

const EmptyScreen = () => {
  return (
    <div className={classes.emptyScreen}>
      <Image
        src={HomePageLogo.src}
        alt="Home Page Logo"
        height={100}
        width={100}
        className={classes.logo}
      />
      <div className={classes.heading}>Build Your Finance Dashboard</div>
      <div className={classes.subheading}>
        Create custom widgets by connecting to any finance API. Track stocks,
        crypto, and much more in real time. All in one place.
      </div>
    </div>
  );
};

export default EmptyScreen;
