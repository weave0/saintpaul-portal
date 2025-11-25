import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, canonical }) => (
  <Helmet>
    {title && <title>{title}</title>}
    {description && <meta name="description" content={description} />}
    {canonical && <link rel="canonical" href={canonical} />}
    <meta property="og:type" content="website" />
    {title && <meta property="og:title" content={title} />}
    {description && <meta property="og:description" content={description} />}
  </Helmet>
);

export default SEO;