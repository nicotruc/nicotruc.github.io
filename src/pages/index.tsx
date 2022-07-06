import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Timeline from '@site/src/components/Timeline'

import styles from './index.module.css';

type CertificationItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  link : string;
};

const CertificationList: CertificationItem[] = [
  {
    title: 'Google Cloud Associate',
    Svg: require('@site/static/img/google_ace.png').default,
    link: "https://www.credential.net/b840cd1c-31a2-46a5-b269-a91e12aaad16"
  },
  {
    title: 'CCNA',
    Svg: require('@site/static/img/ccna_600.png').default,
    link: "https://www.credly.com/badges/39b91e9a-87b0-45f6-ac05-4c601b8ce64a"
  },
  {
    title: 'Cisco Certified Specialist - Enterprise Core',
    Svg: require('@site/static/img/Cisco_Specialist_600.png').default,
    link: "https://www.credly.com/badges/d2038c98-55f8-4c0a-8ce6-e945630ba2b0"
  },
]


function CertificationEvent({Svg, link}: CertificationItem) {
  return (
    <div className={clsx('col col--6')}>
      <div className="text--center">
        <a href={link}><Svg className={styles.timelineSvg} role="img" /></a>
      </div>
    </div>
  );
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/blog">
            Voir mon blog
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <Timeline />
      </main>
    </Layout>
  );
}
