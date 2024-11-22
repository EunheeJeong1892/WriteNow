import Header from "../components/Header";
import projectStypes from "../css/project.module.css";
import { Helmet } from "react-helmet-async";
import dayjs from "dayjs";
import {
  setPosId,
  printText,
  checkPrinterStatus,
  cutPaper,
  getPosData,
  setCharacterset,
} from "../printer/bxlpos";

import { requestPrint } from "../printer/bxlcommon";

function Project() {
  const formattedDate = dayjs().format("YYYY-MM-DD");
  const viewResult = (result: string) => {
    console.log(result);
  };

  const handlePrintBtn = async () => {
    try {
      setPosId(0);
      checkPrinterStatus();
      setCharacterset(949);
      printText(`\n\n기획,디자인\n\n*\n\n`, 0, 0, false, false, false, 0, 1);
      printText(`김민경`, 1, 1, false, false, false, 0, 1);
      printText(
        `\n@mean.kyung\n야호 저 졸업합니다~\n\n-\n\n개발\n\n*\n\n`,
        0,
        0,
        false,
        false,
        false,
        0,
        1
      );
      printText(`정은희`, 1, 1, false, false, false, 0, 1);
      printText(
        `\n@uni_ynwa\n외주문의 환영\n\n-\n\n`,
        0,
        0,
        false,
        false,
        false,
        0,
        1
      );
      printText(
        `${formattedDate}\nwritenow.work\n\n\n`,
        0,
        0,
        false,
        false,
        false,
        0,
        1
      );
      cutPaper(1);
      var strSubmit = getPosData();
      console.log(strSubmit);
      requestPrint("print", strSubmit, viewResult);
      return true;
    } catch (error) {
      console.error("Failed to print:", error);
      alert("Failed to print. Check the console for details.");
    }
  };

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
        <div onClick={handlePrintBtn} className={projectStypes.creditBtn}>
          CREDIT
        </div>
      </div>
    </>
  );
}

export default Project;
