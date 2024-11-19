import PropTypes from "prop-types";
import classes from "../css/actionOperations.module.css";

interface Props {
  fillClassName: any;
  fill: string;
  onClick?: () => void;
}

export const ActionsOperations = ({
  fillClassName,
  fill = "fill.svg",
  onClick,
}: Props): JSX.Element => {
  return (
    <div className={classes["actions-operations"]} onClick={onClick}>
      <img
        className={`${classes.fill} ${fillClassName}`}
        alt="Fill"
        src={fill}
      />
    </div>
  );
};

ActionsOperations.propTypes = {
  fill: PropTypes.string,
};
