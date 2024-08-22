import PropTypes from "prop-types";
import "./ProgressLabels.css";

const ProgressLabels = ({
  className = "",
  applicationsInProgress,
  vuesaxlineararrowRight,
  showProgressLabels,
}) => {
  return (
    showProgressLabels && (
      <div className={`progress-labels ${className}`}>
        <div className="applications-in-progress text-lg font-semibold">
          {applicationsInProgress}
        </div>
        <div className="completed flex items-center mt-2">
          <div className="empty-progress text-lg font-semibold">0</div>
          <img
            className="vuesaxlineararrow-right-icon ml-2"
            alt=""
            src={vuesaxlineararrowRight}
          />
        </div>
      </div>
    )
  );
};

ProgressLabels.propTypes = {
  className: PropTypes.string,
  applicationsInProgress: PropTypes.string,
  vuesaxlineararrowRight: PropTypes.string,
  showProgressLabels: PropTypes.bool,
};

export default ProgressLabels;

