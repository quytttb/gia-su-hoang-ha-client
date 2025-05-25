import { useEffect } from 'react';
import { SEOData } from '../../utils/seo';

interface SEOHeadProps {
  seoData: SEOData;
  structuredData?: object;
}

/**
 * SEO Head component for managing meta tags and structured data
 */
const SEOHead = ({ seoData, structuredData }: SEOHeadProps) => {
  useEffect(() => {
    // Update title
    document.title = seoData.title;

    // Update meta description
    updateMetaTag('description', seoData.description);

    if (seoData.keywords) {
      updateMetaTag('keywords', seoData.keywords);
    }

    // Open Graph tags
    updateMetaProperty('og:title', seoData.ogTitle || seoData.title);
    updateMetaProperty('og:description', seoData.ogDescription || seoData.description);
    updateMetaProperty('og:url', seoData.ogUrl || window.location.href);

    if (seoData.ogImage) {
      updateMetaProperty('og:image', seoData.ogImage);
    }

    // Twitter tags
    updateMetaProperty('twitter:title', seoData.ogTitle || seoData.title);
    updateMetaProperty('twitter:description', seoData.ogDescription || seoData.description);

    if (seoData.ogImage) {
      updateMetaProperty('twitter:image', seoData.ogImage);
    }

    // Canonical URL
    if (seoData.canonical) {
      updateCanonicalLink(seoData.canonical);
    }

    // Structured Data
    if (structuredData) {
      updateStructuredData(structuredData);
    }
  }, [seoData, structuredData]);

  return null; // This component doesn't render anything
};

/**
 * Update or create a meta tag
 */
const updateMetaTag = (name: string, content: string) => {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;

  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }

  meta.content = content;
};

/**
 * Update or create a meta property tag (for Open Graph)
 */
const updateMetaProperty = (property: string, content: string) => {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;

  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }

  meta.content = content;
};

/**
 * Update canonical link
 */
const updateCanonicalLink = (href: string) => {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }

  link.href = href;
};

/**
 * Update structured data
 */
const updateStructuredData = (data: object) => {
  // Remove existing structured data
  const existingScript = document.querySelector(
    'script[type="application/ld+json"][data-dynamic="true"]'
  );
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-dynamic', 'true');
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

export default SEOHead;
