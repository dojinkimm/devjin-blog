import PropTypes from 'prop-types'
import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { ThemeContext } from '../layouts'
import Article from '../components/Article'
import Headline from '../components/Article/Headline'

const AboutPage = () => {

  return (
    <React.Fragment>
      <ThemeContext.Consumer>
        {theme => (
          <Article theme={theme}>
            <header>
              <Headline title="About" theme={theme} />
            </header>
            <section>
              <p>&#127881; 배우는 것과 도전을 좋아하는 Server engineer입니다.
              완성도 있는 제품을 만들 줄 아는 개발자가 되기 위해 고민하고 공부하고 개발하고 있습니다. &#127881;
              <a href="https://career.banksalad.com/" className="banksaladLink">뱅크샐러드</a>  채용되고 싶으면 클릭 &#127881;
              </p>

            

              <div className="items">
                <h2 className="items-head">경력사항</h2>
                <ul className="item-list">
                  <li> 뱅크샐러드 2020.02~현재</li>
                  <li>퍼듀대학교 인턴 프로그램 2019.08~2019.12 </li>
                  <li>한컴GMD 인턴 2019.06~2019.08 </li>
                </ul>
              </div>


              <div className="items">
                <h2 className="items-head">교육사항</h2>
                <ul className="item-list">
                  <li> 한동대학교 전산전자공학부  2014.03 ~ 2020.02</li>
                </ul>
              </div>
            </section>
          </Article>
        )}
      </ThemeContext.Consumer>

      {/* --- STYLES --- */}
      <style jsx global>
        {`
          .banksaladLink:hover {
            background-color: #00c68e;
            color: #ffffff;
          }

          .banksaladLink {
            background-color: #ffffff;
            color: #00c68e;
          }

          .items{
            margin-top: 30px;
            margin-bottom: 30px;
          }

          .items-head{
            margin: 20px 0px 20px 0px;
          }

          .item-list li {
            position: relative;
            list-style-type: none;
            padding-left: 2.5rem;
            margin-bottom: 0.5rem;
          }
          
          .item-list li:before {
              content: '';
              display: block;
              position: absolute;
              left: 0;
              top: -2px;
              width: 5px;
              height: 11px;
              border-width: 0 2px 2px 0;
              border-style: solid;
              border-color: #00a8a8;
              transform-origin: bottom left;
              transform: rotate(45deg);
          }
        
          
        `}
      </style>
    </React.Fragment>
  )
}

AboutPage.propTypes = {
  data: PropTypes.object.isRequired,
}

export default AboutPage
