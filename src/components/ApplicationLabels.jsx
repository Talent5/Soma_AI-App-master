import { useMemo } from "react";
import PropTypes from "prop-types";

const ApplicationLabels = ({
  className = "",
  applicationsInProgress,
  vuesaxlineararrowRight,
  showApplicationLabels,
  propHeight,
  propDisplay,
}) => {
  const dividerStyle = useMemo(() => {
    return {
      height: propHeight,
      display: propDisplay,
    };
  }, [propHeight, propDisplay]);

  return (
    showApplicationLabels && (
      <div
        className={`self-stretch flex flex-col items-start justify-center p-4 gap-2 text-left text-base text-sg-sys-color-on-surface font-sg-sys-typescale-headline-medium-semibold ${className}`}
      >
        <div className="relative tracking-[0.01em] leading-[24px]">
          {applicationsInProgress}
        </div>
        <div className="self-stretch flex flex-row items-center justify-start gap-2.5 text-12xl-3">
          <div
            className="flex-1 relative leading-[23px] font-semibold"
            style={dividerStyle}
          >
            0
          </div>
          <img
            className="h-5 w-5 relative hidden"
            alt=""
            src={vuesaxlineararrowRight}
          />
        </div>
      </div>
    )
  );
};

ApplicationLabels.propTypes = {
  className: PropTypes.string,
  applicationsInProgress: PropTypes.string,
  vuesaxlineararrowRight: PropTypes.string,
  showApplicationLabels: PropTypes.bool,

  /** Style props */
  propHeight: PropTypes.any,
  propDisplay: PropTypes.any,
};

export default ApplicationLabels;
