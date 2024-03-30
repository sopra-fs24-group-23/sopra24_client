import React, { ReactNode } from "react";
import "../../styles/ui/BaseContainer.scss";
import PropTypes from "prop-types";

interface BaseContainerProps {
  children?: ReactNode;
  className?: string;
}

const BaseContainer: React.FC<BaseContainerProps> = props => (
  <div {...props} className={`base-container ${props.className ?? ""}`}>
    {props.children}
  </div>
);

BaseContainer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default BaseContainer;