import * as React from 'react';
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { FiFacebook, FiGithub, FiLinkedin, FiMail, FiGlobe } from 'react-icons/fi';
import './bio.scss';
const config = require('../../../config');

const Bio = () => {
  const { comment, name, company, email, website, linkedin, facebook, github } = config;

  return (
    <div className="bio">
      {!comment ? null : <span className="comment">{comment}</span>}

      {!company ? null : (
        <div className="bio-item company">
          <div className="icon-wrap">
            <Fa icon={faAddressCard} />
          </div>
          <span>{company}</span>
        </div>
      )}

      <div className="buttons">
        <div className="button">
        <a href={linkedin} target="_blank">
          <FiLinkedin />
        </a>
        </div>
        <a href={github} target="_blank">
          <FiGithub />
        </a>
        <a href={facebook} target="_blank">
          <FiFacebook />
        </a>
        <a href={email} target="_blank">
          <FiMail />
        </a>
        <a href={website} target="_blank">
          <FiGlobe />
        </a>
      </div>
    </div>
  );
};

export default Bio;
