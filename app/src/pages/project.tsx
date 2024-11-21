import { useRef, useState } from "react";
import Header from "../components/Header";
import projectStypes from "../css/project.module.css";
import { Helmet } from "react-helmet-async";

function Project() {
  return (
    <>
      <Helmet>
        <title></title>
      </Helmet>
      <Header showInput={false} />
      <div className={projectStypes.container}>
        <div className={projectStypes.upperDiv}>
          <div className={projectStypes.selectBorderDiv}>writeNow</div>
          <div className={projectStypes.selectBorderDiv}>지금 쓰세요!</div>
        </div>
        <div>
          <video
            src="https://daqsct7lk85c0.cloudfront.net/public/main04.mp4" // 동영상 파일 URL
            style={{ height: "100%", width: "844px", objectFit: "cover" }}
            playsInline
            controls
            muted={true}
          />
        </div>
        <div className={projectStypes.creditBtn}>CREDIT</div>
      </div>
    </>
  );
}

export default Project;
