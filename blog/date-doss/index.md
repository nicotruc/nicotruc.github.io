# Effectuer des tests unitaires sur des images OCI

Une de mes activités étaient de maintenir un repo contenant un pool de Golden Image. Ces images étant la base de tout les projets développés par la boite, il est important de s'assurer que chacune de ces images respectent toutes les contraintes que nous lui définissons.

# Pourquoi ça compte de tester unitairement des images ?

Si celà peut paraitre stupide de tester une image, nous sommes parfois dépendant de composantes évoluantes dnas les développements ou les dépendances de nos projets.

Exemple pour l'image suivante:

```Docker
FROM mon-image
RUN apt install -f monpackage && apt clean all
COPY monscript.sh /app
ENTRYPOINT ["/app/monscript.sh"]
```

L'entrypoint de cette image est apporté par monpackage. Si monscript appelle une commande fournie par le RPM monpackage, mais que le RPM n'apporte plus la commande en question, comment le code se comportera-t-il ? Et pourtant, le test fonctionnait sur ma machine.
Alors effectivement, ce genre de contrainte pouvait facilement se tester via la pipeline CI/CD, Néanmoins, celà représente une charge dans la pipeline, que nous souhaitions la plus simple possible. Et dans un repositorie de golden image, il y a peu de places à la spécificité dans les tests.

## Solution pour une image Docker : GoogleContainerTools/container-struct-test
J'ai dans un premier temps été séduit par la solution proposé par Google Container Tools avec container-struct-test https://github.com/GoogleContainerTools/container-structure-test. L'outil permet avec une définition simple d'un YAML de tester un grand panel de caractèristiques sur une image :

- Tests de commandes (tester les sorties standard/erreur d'une commande);
- Test d'existence et de permission sur les fichiers;
- Test de contenu du fichier ;
- Test de Metadata.

L'outil permet d'effectuer ses tests sur un container en runtime et même sur une image exporté (excepté logiquement les tests de commandes)
Enfin, l'outil, très complet, permet de générer des rapports de vos tests.

L'execution est très simple : 

```bash
container-structure-test test --image gcr.io/registry/image:latest --config config.yaml

====================================
====== Test file: config.yaml ======
====================================
=== RUN: File Existence Test: whoami
--- PASS
duration: 0s
=== RUN: Metadata Test
--- PASS
duration: 0s

=====================================
============== RESULTS ==============
=====================================
Passes:      2
Failures:    0
Duration:    0s
Total tests: 2

PASS
```

### Oui mais...
J'ai essayé de l'implementer avec mes images, mais celà ne fonctionne pas. En effet, le format de fichier d'une image Docker diffère largement du format de fichier d'un OCI. Ce faisant, l'outil plantera pour tout.
Ajoutons également que l'outil n'est pas fréquemment tenu à jour, la dernière release ayant eu lieu il y a 9 mois au moment de la redaction de l'article.

## Qu'est ce qu'une image OCI ?
L'Open Container Initiative est une norme 

## Solution pour une image OCI : dgoss

dgoss est le packaging de goss pour container.

Vous pourrez trouver un exemple de fonctionnement de l'outil sur ce repo.
