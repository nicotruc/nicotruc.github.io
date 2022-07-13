---
slug: welcome
title: ReadOnlyRootFs ne doit pas être un problème
authors: [nicotruc]
tags: [devops, k8s, blog, workaround]
---

# ReadOnlyRootFs et ses contraintes
Sur un cluster k8s en production, il est parfois usuel de faire tourner le file system de vos workloads en read-only:

```yaml
securityContext:
    readOnlyRootFs: true
```

Son activation est effectivement **une pratique efficace pour isoler un maximum les operations de vos containers**, réduisant les potentiels attaques que vous pourriez rencontrer.

Pour exemple, vous ne pourrez pas creer de fichiers sur un container dans un pod avec cet option active:

```bash
> kubectl exec pod/demo-pod -- touch test.txt
ERROR:
> echo $?
1
```

De fait, son activation peut parfois apporter son lot de contraintes. Essayons de faire tourner une application jboss.

```bash
kubectl apply -f failed-jboss.yaml
...
kubectl logs -f deploy/jboss


```

Et oui : **notre application packagée ne peut pas tourner, car des répertoires doivent être modifié** à mesure de l'execution de la resource. `readOnlyRootFs` va donc empêcher l'applicatif de s'executer correctement.

Un utilisateur ayant les bon droits pourra forcer le read/write sur ce pod en particulier, ce qui ajoutera une exception dans notre cluster. Mais cette solution doit à tout pris être eviter !

# Vous n'avez pas les bases

Pour rendre celà fonctionnel, nous aurons besoin de 3 options de k8s:
- les emptyDirs;
- les initContainers;
- les sidecars.

Voyons donc les mécanismes nous permettant de rendre çelà fonctionnel :

## Les emptyDir

Doc : https://kubernetes.io/fr/docs/concepts/storage/volumes/#emptydir

L'API k8s proposent différents types de stockage, dont les emptyDirs. Ses stockages permettent de creer un volume propre au pod sur lequel il sera possible d'écrire n'importe quoi. Ces volumes étant assignés par pods et par noeud, si le pod disparait, le contenu de l'emptyDir également.

Un emptyDir est par définition vide, c'est à dire qu'une fois monté sur le fs du container, le dossier apparaitra comme vide pour le container, et donc les fichiers que le container contenait ne seront pas accessible.

Si le container dans le pod plante, l'emptyDir aura l'avantage de continuer à fournir les données qu'elle contient, et donc le container pourra toujours acceder aux même données qu'avant son plantage.

Les emptyDir sont stocké sur le filesystem de votre noeud, mais vous pourrez egalement forcer un typage `medium: Memory`, ce qui permettra de faire tourner votre volume dans la RAM, soit un tmpfs vous offrant ainsi **une très grande vitesse de lecture/ecriture**. En revanche, et par nature, les données sont supprimées au redémarrage du noeud. 

## Les initContainers

Les `initContainers` sont des containers qui seront executés à chaque fois qu'un nouveau pod sera créé. Une fois l'execution de ce container réussi, les containers principaux pourront démarrer

## Les sidecars

Les sidecars sont des containers executés en même temps que l'applicatif. Ses applicatifs auront leurs propres executions et peuvent communiquer isolément avec les autres containers.

Un applicatif dans un pod peut être découpé avec des sidecars pour des besoins d'éxecution parallèles specifiques. Par exemple, un sidecar pourrait être un container allant mettre à jour un emptyDir régulièrement, emptyDir qui sera consommé par l'autre container du pod.

# La demarche

Pour faire fonctionner notre application, nous allons donc exploiter les 3 options vu précédemment.

L'idée est de profiter des emptyDir et des initContainers pour copier dans l'emptyDir les fichiers du container ReadOnly, puis de monter l'emptyDir dans le container pour qu'il puisse s'executer.

IMAGE

Comme les secrets et les configmaps sont également en ReadOnly, vous pourrez également appliquer cette méthode pour copier ses contenus. 
Par exemple, un helm-chart pourra creer un configmap contenant un script avec les variables passées pour le chart Helm. puis ce script serait copié/coller dans l'emptyDir et modifiable par le container. 

Celà evite ainsi de modifier des droits lors du montage du configmap. Attention: il se peut qu'un upgrade du chart avec une modification du configmap ne soit ainsi pas reporté sur votre charge de travail étant donnée que ce script sera copié dans l'initContainer et n'est pas vu comme necessitant un rollout d'un deploiement. 

IMAGE ?

Pour reporter les modifications du filesystem, on peut également exploiter un sidecar pour s'adapter de manière transparente à l'applicatif en temps réel.

IMAGE

# Demonstration