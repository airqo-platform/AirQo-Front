import React from 'react';
import classNames from "classnames";

import ArrowDown from 'icons/nav/ArrowDown';
import { Link } from 'react-router-dom';

const NavTab = ({ text, width, hideArrow, colored, filled, style, path, onClick }) => {
    return(
        <>
        {hideArrow ? (<Link to={path || "/"} style={{textDecoration:"none", color:"#000"}}>
            <div className={classNames("NavTab", { colored, filled })} style={{ width: width - 32, ...(style || {}) }} onClick={onClick}>
                <span>{text}</span>
            </div>
        </Link>) : (
            <div className={classNames("NavTab", { colored, filled })} style={{ width: width - 32, ...(style || {}) }} onClick={onClick}>
                <span className="dropdown-text">{text}</span>
                <div className="arrow-down">
                    <ArrowDown />
                </div>
            </div>
        )
        }
        </>
)};

export default NavTab;
