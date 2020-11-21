import * as React from 'react';
import Helmet from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

export interface SEOPropsType {
  description: string;
  image: string;
  lang: string;
  meta: any[];
  title: string;
  keywords: string[];
}

function SEO(props: SEOPropsType) {
  const { description, lang, meta, title, keywords, image } = props;

  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `
  );

  const metaDescription = description ?? site.siteMetadata.description;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={title === 'Home' ? site.siteMetadata.title : `%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:image`,
          content: image,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          name: `keywords`,
          content: keywords,
        },
      ].concat(meta)}
    />
  );
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
  keywords: [],
  image: ``,
};

export default SEO;
