import React from "react";
import PropTypes from "prop-types";

const SkipToContent = ({ content = "main" }) => {
  return (
    <>
      <a
        className="skip"
        href={"#" + content}
        aria-label="Skip to main Content"
      >
        Skip to Content
      </a>
    </>
  );
};

export default SkipToContent;

SkipToContent.propTypes = {
  content: PropTypes.string,
};
