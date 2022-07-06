import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type TimelineItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const TimelineList: TimelineItem[] = [
  {
    title: '2016-2019 : Apprenti ingénieur IoT',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Création de réseau LoRa, décodage des données capteurs, 
        intégration des données, valorisation.
      </>
    ),
  },
  {
    title: '2019-2021 : Ingénieur réseau',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Intégration (Cisco, Aruba, HPE...), SDWAN (Aruba Central, Meraki...), 
        Automatisation (Ansible), Developpment (K8s, Terraform)
      </>
    ),
  },
  {
    title: 'Depuis 2022 : Ingénieur Devops',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Maintenance OCI Golden image, CI/CD (Gitlab), Helm Chart,
        Solutions review (Falco, cert-manager, MiniO...)
      </>
    ),
  },
];

function TimelineEvent({title, Svg, description}: TimelineItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.timelineSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.timelineSection}>
      <h1 className="text--center"> 🛠 Experience</h1>
      <div className={styles.timeline}>
        <div className="container">
          <div className="row">
            {TimelineList.map((props, idx) => (
              <TimelineEvent key={idx} {...props} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
