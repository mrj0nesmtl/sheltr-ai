# SHELTR V2 : WhitePaper

## Table des Matières

1. [Aperçu](#aperçu)
2. [Vision et Mission](#vision-et-mission)
3. [Fonctionnalités Principales](#fonctionnalités-principales)
   - [QR Scan et Dons](#1-qr-scan-et-dons)
   - [Transparence Blockchain & Registre Public](#2-transparence-blockchain--registre-public)
   - [Rôles Multi-Auth des Utilisateurs](#3-rôles-multi-auth-des-utilisateurs)
   - [Homeless Depot : Intégration Shopify](#4-homeless-depot-intégration-shopify)
   - [Autonomisation Financière et Outils Alimentés par l'IA](#5-autonomisation-financière-et-outils-alimentés-par-lia)
   - [Analytique & Suivi de l'Impact](#6-analytique--suivi-de-limpact)
   - [Intégration des Réseaux Sociaux & Gamification](#7-intégration-des-réseaux-sociaux--gamification)
   - [Confidentialité & Conformité](#8-confidentialité--conformité)
4. [Technologie Utilisée](#technologie-utilisée)
   - [Technologies Frontend](#technologies-frontend)
   - [Technologies Backend](#technologies-backend)
   - [Gestion de l'État & Outils Utilitaires](#gestion-de-létat--outils-utilitaires)
   - [Outils d'IA & Analytique](#outils-dia--analytique)
5. [Déploiement & Scalabilité](#déploiement--scalabilité)
   - [Stratégie de Déploiement](#stratégie-de-déploiement)
6. [Feuille de Route Future](#feuille-de-route-future)
   - [Expansion des Capacités de l'IA](#1-expansion-des-capacités-de-lia)
   - [Plus d'Options White-Label](#2-plus-doptions-white-label)
   - [Intégrations de Paiement Supplémentaires](#3-intégrations-de-paiement-supplémentaires)
   - [Fonctionnalités Améliorées de Confidentialité des Données](#4-fonctionnalités-améliorées-de-confidentialité-des-données)
7. [Conclusion](#conclusion)

---

## Aperçu

**SHELTR V2** est une plateforme révolutionnaire visant à transformer les dons caritatifs pour lutter contre l'itinérance par la puissance de la technologie. En utilisant la **transparence blockchain**, des **informations pilotées par l'IA**, des **dons par code QR**, et un modèle de **gamification engageant**, SHELTR fournit une solution complète et scalable pour répondre aux besoins des personnes sans-abri tout en autonomisant les participants. Ce livre blanc décrit la technologie, l'ensemble des fonctionnalités, et la conception architecturale de la plateforme SHELTR.

Conçue sous le modèle **Arcana Concept**, SHELTR opère en tant que plateforme **SaaS** disponible comme **solution white-label**, la rendant adaptable pour les refuges, les ONG et les organisations sociales à travers le monde, sans coût pour les refuges participants ou les participants.

## Vision et Mission

La vision de SHELTR est de **redéfinir les dons caritatifs** en utilisant des technologies avancées pour créer une plateforme sécurisée, intelligente et scalable. En utilisant des **technologies blockchain**, des **outils d'IA**, et des **mécanismes d'autonomisation financière**, SHELTR est conçue pour soutenir directement les personnes sans-abri, promouvoir la transparence, et conduire à des solutions de logement à long terme.

## Fonctionnalités Principales

### 1. QR Scan et Dons

Une fonctionnalité clé de la plateforme SHELTR est le **système de dons par code QR**. Chaque participant se voit attribuer un **code QR unique** lié à son portefeuille numérique. Les donateurs peuvent facilement scanner un code QR pour faire un don directement à un participant spécifique, garantissant que les contributions atteignent rapidement ceux dans le besoin.

- **Génération & Suivi des Codes QR** : Les codes QR sont générés à l'aide de **HTML5-QRCode** et sont accessibles via les tableaux de bord des participants.
- **Options de Paiement** : Les donateurs peuvent contribuer via plusieurs plateformes, notamment **Stripe**, **PayPal**, **Apple Pay**, ou des **portefeuilles de cryptomonnaie**.

### 2. Transparence Blockchain & Registre Public

Tous les dons dans SHELTR sont traités par des **passerelles de paiement traditionnelles** telles que Stripe ou PayPal. La **blockchain** est exploitée pour servir de **registre public** garantissant la transparence dans l'allocation des fonds. Cette approche hybride garantit la conformité avec les systèmes financiers existants tout en maintenant la **vérifiabilité publique**.

- **Vérification Blockchain** : Chaque don est enregistré sur la blockchain, permettant aux **donateurs** et aux **participants** de vérifier les transactions et de constater l'impact réel de leurs contributions.
- **Contrats Intelligents pour l'Allocation des Fonds** : La distribution des fonds est gérée via des **contrats intelligents**, allouant automatiquement les dons dans trois catégories :
  - **80 %** pour les besoins essentiels des participants.
  - **15 %** pour un **fonds pour le logement**.
  - **5 %** pour les **coûts opérationnels**.

### 3. Rôles Multi-Auth des Utilisateurs

SHELTR V2 dispose d'un système robuste de **multi-authentification** pour gérer différents types d'utilisateurs, renforçant la sécurité et la facilité d'utilisation :

- **Administrateur de Refuge** : Gère les participants, l'intégration, les dons, et l'accès aux tableaux de bord.
- **Donateurs** : Intégration simple pour contribuer, avec des options pour générer des reçus fiscaux.
- **Participants** : Personnes sans-abri qui reçoivent des codes QR pour des financements directs et accèdent aux services via leur portefeuille.

L'authentification est gérée à l'aide de **Supabase**, qui fournit un **contrôle d'accès basé sur les rôles (RBAC)** pour s'assurer que chaque type d'utilisateur dispose du niveau d'accès approprié.

### 4. Homeless Depot : Intégration Shopify

**Le Homeless Depot** est une boutique en ligne alimentée par Shopify qui fournit aux participants des matériaux de marque pour renforcer leur visibilité et leurs efforts de collecte de fonds.

- **Matériaux de Marque** : Des articles comme les **Cartes de Code QR**, **T-Shirts**, **Affiches**, et **Actifs Numériques** sont disponibles pour aider les participants à promouvoir leurs liens de dons.
- **Accès des Participants** : Les participants peuvent accéder au Homeless Depot via leur **tableau de bord**, en utilisant soit des jetons gagnés, soit des fonds disponibles dans leur portefeuille.

### 5. Autonomisation Financière et Outils Alimentés par l'IA

SHELTR intègre des **outils de guidance financière pilotés par l'IA** pour autonomiser les participants :

- **Gestion du Budget** : Les participants reçoivent des **conseils en budgétisation** personnalisés à l'aide de l'IA, les aidant à suivre les dépenses sur les biens essentiels et à gérer les économies pour le fonds de logement.
- **Fonds de Logement à Haut Rendement** : **15 %** de tous les dons sont alloués à un fonds pour le logement, qui est investi dans un **ETF à haut rendement** pour générer des retours jusqu'à ce qu'il atteigne un objectif pour un logement durable.

### 6. Analytique & Suivi de l'Impact

SHELTR fournit des analyses approfondies aux refuges comme aux donateurs, offrant des aperçus en temps réel sur l'impact des dons.

- **Tableau de Bord d'Impact** : Développé à l'aide de **Recharts** et **React**, le tableau de bord permet aux participants, aux donateurs et aux refuges de visualiser des indicateurs clés, y compris les dons totaux, les progrès du fonds de logement, et l'impact communautaire.
- **Métriques et Indicateurs Clés de Performance (KPI)** : Les dons par participant, la croissance mensuelle, l'état du fonds de logement et les taux d'engagement sur les réseaux sociaux sont accessibles à toutes les parties prenantes.

### 7. Intégration des Réseaux Sociaux & Gamification

**Le Partage Social et l'Engagement Gamifié** sont des outils clés pour SHELTR afin d'améliorer la visibilité de la communauté et la motivation.

- **Partage sur les Réseaux Sociaux** : Des options de partage intégrées sur **Facebook**, **TikTok**, et **Instagram** permettent de sensibiliser le public et d'encourager davantage de dons.
- **Badges & Jalons** : Les participants et les donateurs peuvent gagner des badges en atteignant des jalons, tels que compléter un certain nombre de dons ou atteindre un objectif de fonds de logement.

### 8. Confidentialité & Conformité

La confidentialité est un pilier clé de SHELTR, étant donné la nature sensible des données :

- **Chiffrement des Données** : Les données sont protégées en utilisant le **chiffrement AES-256** pour les données au repos et **TLS 1.3** pour les données en transit.
- **Conformité au RGPD** : Conformité avec le **RGPD** et les normes canadiennes de protection des données, garantissant que toutes les données personnelles sont gérées de manière responsable.
- **Sécurité Supabase** : **RLS (Row Level Security)** et **Edge Functions** de Supabase assurent que les données des utilisateurs ne sont accessibles qu'aux personnes autorisées.

## Technologie Utilisée

### Technologies Frontend

- **React 18 & TypeScript** : Pour développer des interfaces utilisateur réactives et dynamiques.
- **Vite** : Environnement de développement optimisé pour des constructions plus rapides.
- **Tailwind CSS** : Framework CSS basé sur l'utilisation d'utilitaires pour créer des interfaces modernes et réactives.
- **React Router DOM** : Navigation efficace dans toute la plateforme.

### Technologies Backend

- **Supabase** : Solution BaaS pour la gestion de la base de données (PostgreSQL), abonnements en temps réel, authentification et stockage.
- **Stripe, PayPal, Apple Pay** : Intégrés pour des options de paiement sécurisées et diversifiées.
- **Blockchain** : Blockchain Ethereum ou similaire utilisée pour créer un registre transparent de toutes les transactions.

### Gestion de l'État & Outils Utilitaires

- **Zustand** : Gestion de l'état légère pour React pour améliorer les performances.
- **Zod** : Validation des types pour assurer l'intégrité des données.
- **HTML5-QRCode** : Pour générer et gérer des codes QR spécifiques aux participants.
- **i18next** : Utilisé pour l'internationalisation, offrant le support des langues anglaise et française.

### Outils d'IA & Analytique

- **API OpenAI** : Pour fournir des recommandations financières alimentées par l'IA et des conseils en budgétisation.
- **Recharts** : Bibliothèque de visualisation de données utilisée pour générer le Tableau de Bord d'Impact, représentant des métriques telles que la croissance des dons, le progrès des participants, et les objectifs de logement.
- **TensorFlow.js** : Apprentissage automatique basé sur le navigateur pour les prédictions financières spécifiques aux participants et l'optimisation.

## Déploiement & Scalabilité

**SHELTR V2** est conçue comme une plateforme **SaaS**, la rendant facilement déployable dans divers refuges à l'échelle mondiale. La **capacité white-label** lui permet d'être personnalisée pour répondre aux besoins uniques de marque et opérationnels des différentes organisations.

### Stratégie de Déploiement

- **Pipeline CI/CD** : Intégration et déploiement continus à l'aide de **GitHub Actions** pour un déploiement du code rationalisé et une assurance qualité.
- **Hébergement** : Déploiement initial utilisant **Replit** pour le prototypage et les tests, avec des plans de passage à **Netlify** ou **Vercel** pour la production.
- **Scalabilité** : Les services backend sont conçus pour être scalables, en utilisant **Supabase** pour la gestion des données en temps réel et **Stripe** pour la gestion des paiements.

## Feuille de Route Future

### 1. Expansion des Capacités de l'IA

- **Coaching Budgétaire Avancé** : Expansion du rôle de l'IA pour fournir des informations plus profondes sur les dépenses des participants et l'optimisation de l'allocation du fonds de logement.

### 2. Plus d'Options White-Label

- **Personnalisation pour les Partenaires** : Permettre aux refuges partenaires de créer des versions entièrement personnalisées de SHELTR, y compris des matériaux personnalisés dans le Homeless Depot.

### 3. Intégrations de Paiement Supplémentaires

- **Cryptomonnaie** : Étendre la prise en charge de cryptomonnaies supplémentaires pour rendre les dons plus accessibles aux donateurs internationaux.

### 4. Fonctionnalités Améliorées de Confidentialité des Données

- **Stockage Décentralisé des Données** : Intégration potentielle avec des solutions de stockage de données décentralisées comme **IPFS** pour protéger davantage la confidentialité et l'intégrité des données des participants.

## Conclusion

SHELTR V2 se situe à l'intersection de la **technologie**, de la **compassion**, et de l'action communautaire. En offrant une plateforme scalable, transparente et alimentée par l'IA, SHELTR permet aux refuges, aux donateurs, et aux participants de travailler ensemble pour lutter contre l'itinérance. Grâce à la **vérification blockchain**, aux **informations pilotées par l'IA**, et une infrastructure technologique robuste, SHELTR garantit que les dons caritatifs sont transparents, impactants et transformatifs pour ceux qui en ont le plus besoin.

**Arcana Concept** est fier de donner vie à ce projet et est profondément reconnaissant à nos **investisseurs anges** et soutiens, dont la croyance en notre mission a été instrumentale pour nous amener à ce stade. Alors que nous anticipons le **lancement au printemps 2025**, nous invitons des partenaires, refuges, et parties prenantes partageant les mêmes idées à se joindre à nous pour **hacker l'itinérance** et créer un changement significatif.

---