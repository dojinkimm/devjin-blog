import * as React from 'react';
import { FiFacebook, FiGithub, FiLinkedin, FiMail, FiLink } from 'react-icons/fi';
import { SiAboutDotMe } from "react-icons/si";

import './bio.scss';
const config = require('../../../config');

const Bio = () => {
  const { comment, email, resume, linkedin, facebook, github } = config;

  return (
    <div className="bio">
      {!comment ? null : <span className="comment"> 🔥 {comment} 🔥</span>}

      <div className="social">
        <a href={linkedin} target="_blank">
          <FiLinkedin className="icon"/>
        </a>
        <a href={github} target="_blank">
          <FiGithub className="icon"/>
        </a>
        <a href={facebook} target="_blank">
          <FiFacebook />
        </a>
        <a href={email} target="_blank">
          <FiMail className="icon"/>
        </a>
        <a href={resume} target="_blank">
          <SiAboutDotMe className="icon"/>
        </a>
      </div>
    </div>
  );
};

export default Bio;
