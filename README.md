#TAQA PREDICT: Maintenance Prédictive Pour Toutes Les Énergies
##Table des Matières

    Introduction

    Problème

    Solution

    Architecture

        Vue d'ensemble

        Composants

        Adaptabilité Multi-Énergies

        Détection d'Anomalies vs. Prédiction de Défaillance

    Configuration et Installation

        Prérequis

        Structure des Fichiers

        Mise en Place de l'Environnement Python

        Mise en Place de Node-RED

        Entraînement du Modèle

        Mise en Place de l'API Flask

        Mise en Place du Flux Node-RED

        Mise en Place du Frontend

    Utilisation

        Démarrer le Système

        Flux de Données

    Données

    Travaux Futurs

    Contributeurs

Introduction

TAQA PREDICT est une solution de maintenance prédictive basée sur l'Intelligence Artificielle, conçue pour surveiller en temps réel la santé des installations de production d'énergie, en particulier les centrales solaires. En détectant les comportements anormaux des équipements avant qu'ils ne conduisent à des défaillances majeures, TAQA PREDICT vise à réduire les temps d'arrêt imprévus, à optimiser les coûts de maintenance et à maximiser la production d'énergie.
Problème

Les infrastructures de production d'énergie, telles que les centrales solaires (PV et CSP), sont sujettes à des défaillances de composants (onduleurs, capteurs, etc.). Ces pannes imprévues entraînent des arrêts de production coûteux et des pertes financières importantes. Pour un complexe de grande envergure comme NOOR Ouarzazate, identifier rapidement où et quand un problème est susceptible de survenir est un défi logistique et opérationnel majeur. Les approches de maintenance réactive ou préventive basée sur le temps ne sont pas toujours optimales.
Solution

TAQA PREDICT propose une approche de maintenance prédictive en analysant en continu les données opérationnelles des installations. En utilisant des modèles d'apprentissage automatique pour identifier les schémas inhabituels qui précèdent souvent les défaillances, la plateforme alerte les opérateurs et les équipes de maintenance, leur permettant d'intervenir de manière proactive avant qu'une panne critique ne se produise.
Architecture
Vue d'ensemble

Le système TAQA PREDICT se compose de plusieurs modules qui travaillent ensemble pour collecter les données, les analyser, détecter les anomalies, émettre des alertes et visualiser l'état du système en temps réel.

graph LR
    A[Capteurs IoT / Source de Données] --> B[Collecte & Prétraitement des Données]
    B --> C[Modèle IA (LSTM) - Détection d'Anomalies]
    C --> D[API Flask (Service de Prédiction)]
    D --> E[Node-RED (Orchestration & Logique d'Alertes)]
    E -- WebSocket --> F[Application Frontend (Tableau de Bord)]
    F --> G[Opérateur / Équipe de Maintenance]

Composants

    Capteurs IoT / Source de Données: Collectent les données opérationnelles en temps réel (puissance, températures, irradiation, etc.). Dans ce projet, nous utilisons des fichiers CSV pour simuler ce flux de données.

    Prétraitement des Données: Nettoyage, synchronisation temporelle, mise à l'échelle et structuration des données en séquences temporelles adaptées au modèle LSTM.

    Modèle IA (LSTM): Un réseau de neurones Long Short-Term Memory entraîné pour apprendre le comportement normal des données opérationnelles et prédire l'état futur attendu. La déviation significative entre la prédiction et la réalité est utilisée pour détecter les anomalies.

    API Flask: Un service web léger qui charge le modèle IA entraîné et le scaler, reçoit les nouvelles séquences de données, effectue la prédiction, calcule l'erreur de prédiction mise à l'échelle et détermine si une anomalie est détectée en comparant l'erreur à un seuil prédéfini.

    Node-RED: Une plateforme de programmation visuelle pour l'Internet des Objets. Dans ce projet, Node-RED orchestre le flux de données : il simule la réception de nouvelles données, appelle l'API Flask, reçoit les résultats (incluant le flag d'anomalie et l'erreur mise à l'échelle), applique une logique basée sur des règles (par exemple, suivi des anomalies consécutives et évaluation du niveau de risque/indication de temps), et envoie les messages d'état et d'alerte au frontend via WebSocket.

    Application Frontend (Tableau de Bord): Une application web (potentiellement développée avec Next.js/React) qui se connecte à l'endpoint WebSocket de Node-RED, reçoit les messages en temps réel et visualise l'état du système, les métriques opérationnelles, les alertes (avec indication de temps), et l'historique des anomalies sur un tableau de bord convivial.

Adaptabilité Multi-Énergies

Un point fort de TAQA PREDICT est son architecture adaptable. Le même modèle LSTM peut être utilisé pour différents types d'installations énergétiques (Solaire PV, CSP, Éolien) en adaptant simplement les données d'entrée provenant des capteurs IoT spécifiques à chaque technologie (par exemple, Irradiation pour le Solaire, Température des sels pour le CSP, Vitesse du vent pour l'Éolien). Le "cerveau" IA reste le même, ce qui simplifie le déploiement sur différentes plateformes énergétiques.
Détection d'Anomalies vs. Prédiction de Défaillance

Il est important de noter que le modèle LSTM actuel est entraîné pour détecter des anomalies (déviations par rapport au comportement normal appris) en se basant sur la prédiction du prochain état. Il ne prédit pas directement le moment exact d'une défaillance future.

Dans ce projet, nous utilisons les anomalies détectées comme des signaux d'alerte précoce. La logique implémentée dans Node-RED suit la persistance et la sévérité de ces anomalies pour évaluer un niveau de risque et déclencher une alerte "Critique" qui est interprétée sur le tableau de bord comme indiquant un "Risque Potentiel de Défaillance dans les 24-48h". Cette indication de temps est basée sur une règle définie dans Node-RED (potentiellement inspirée par des études de cas génériques sur la maintenance prédictive), et non sur un modèle spécifiquement entraîné sur des données historiques de défaillance pour prédire le RUL (Remaining Useful Life).
Configuration et Installation

Ce projet nécessite la mise en place d'un environnement Python pour l'entraînement du modèle et l'API Flask, ainsi que l'installation de Node-RED pour l'orchestration et la mise en place du frontend.
Prérequis

    Python 3.x: Pour les scripts d'entraînement et l'API Flask.

    pip: Le gestionnaire de paquets Python.

    Node.js & npm/yarn: Pour l'installation et l'exécution de Node-RED et potentiellement du frontend (si basé sur Node.js/npm/yarn).

    Node-RED: Installé et opérationnel.

Structure des Fichiers

Assurez-vous d'avoir une structure de fichiers similaire à celle-ci (les noms exacts peuvent varier) :

/votre_projet/
├── data/
│   ├── Plant_1_Generation_Data.csv
│   ├── Plant_1_Weather_Sensor_Data.csv
│   ├── Plant_2_Generation_Data.csv  # Pour la simulation temps réel
│   └── Plant_2_Weather_Sensor_Data.csv # Pour la simulation temps réel
├── models/ # Ce dossier sera créé par le script d'entraînement
│   ├── my_energy_model.keras
│   ├── scaler.save
│   └── anomaly_threshold_scaled.joblib
├── flask_app/
│   └── model_service.py # Code de l'API Flask
├── node_red/
│   └── flow.json # Export de votre flux Node-RED
├── frontend/ # Dossier de votre application frontend
│   ├── public/
│   ├── src/
│   └── package.json
└── train_model.py # Script Python pour l'entraînement

Placez vos fichiers de données CSV dans le dossier data/.
Mise en Place de l'Environnement Python

    Clonez ou téléchargez les fichiers du projet.

    Naviguez dans le répertoire racine de votre projet.

    Créez un environnement virtuel (recommandé) :

    python -m venv venv
    source venv/bin/activate # Sur Linux/macOS
    # venv\Scripts\activate # Sur Windows

    Installez les dépendances Python :

    pip install pandas numpy tensorflow scikit-learn joblib flask

Mise en Place de Node-RED

    Installez Node-RED si ce n'est pas déjà fait :

    npm install -g --unsafe-perm node-red

    Démarrez Node-RED :

    node-red

    Accédez à l'interface web (généralement http://localhost:1880).

    Installez les nœuds nécessaires (si non déjà installés) :

        Cliquez sur le menu hamburger en haut à droite -> Manage palette -> Install.

        Recherchez et installez node-red-node-http (pour les requêtes HTTP vers Flask) et node-red-node-websocket (pour la communication avec le frontend).

Entraînement du Modèle

    Assurez-vous que vos fichiers de données (Plant_1_Generation_Data.csv, Plant_1_Weather_Sensor_Data.csv) sont dans le bon chemin (ajustez PLANT_1_GEN_PATH, PLANT_1_WEATHER_PATH dans le script train_model.py si nécessaire).

    Exécutez le script d'entraînement :

    python train_model.py

    Ce script va charger les données, les prétraiter, entraîner le modèle LSTM, évaluer sa performance, calculer le seuil d'anomalie mis à l'échelle et sauvegarder le modèle (my_energy_model.keras), le scaler (scaler.save) et le seuil (anomaly_threshold_scaled.joblib) dans le dossier models/.

Mise en Place de l'API Flask

    Placez le fichier model_service.py dans un dossier (par exemple flask_app/).

    Assurez-vous que les chemins vers le modèle, le scaler et le seuil (MODEL_PATH, SCALER_PATH, ANOMALY_THRESHOLD_SCALED_PATH) dans model_service.py sont corrects et pointent vers les fichiers générés lors de l'entraînement.

    Assurez-vous que CSV_PATH dans model_service.py pointe vers le fichier de données que vous utiliserez pour la simulation en temps réel (par exemple, une version fusionnée de Plant_2_Generation_Data.csv et Plant_2_Weather_Sensor_Data.csv, ou même Plant_1_Merged_Data.csv si vous simulez avec les données d'entraînement).

Mise en Place du Flux Node-RED

    Importez votre flux Node-RED exporté (flow.json) dans l'interface web de Node-RED (Menu hamburger -> Import -> Paste).

    Vérifiez et configurez les nœuds :

        Nœud http request: Assurez-vous que l'URL pointe vers votre API Flask (http://localhost:5000/get_prediction si elle tourne localement sur le port 5000). Configurez-le pour retourner un "parsed JSON object".

        Nœud function ("Traiter Résultats"): Assurez-vous que le code JavaScript à l'intérieur est la dernière version qui implémente la logique de risque multi-niveaux et utilise correctement les champs de la réponse Flask (res.is_anomaly, res.mae_scaled, etc.). Configurez le nombre correct de sorties (généralement 2).

        Nœud websocket out: Configurez le type sur "Listen on" et définissez un chemin URL (par exemple, /ws/live-data). Assurez-vous que les sorties de votre nœud function sont connectées à ce(s) nœud(s) websocket out.

        Nœud inject: Configurez-le pour déclencher le flux périodiquement (par exemple, toutes les 15 minutes) pour simuler l'arrivée de nouvelles données.

        Nœuds debug: Laissez des nœuds debug connectés aux sorties de votre nœud function et potentiellement après le http request pour faciliter le débogage.

Mise en Place du Frontend

    Naviguez dans le dossier de votre application frontend.

    Installez les dépendances :

    npm install # ou yarn install

    Adaptez le code frontend (si nécessaire) pour :

        Établir une connexion WebSocket à l'URL Node-RED configurée (ws://[adresse_ip_node_red]:1880/ws/live-data).

        Recevoir et parser les messages JSON.

        Mettre à jour l'état des composants React pour afficher les données en temps réel (statut, alertes, métriques, graphique, log) en fonction des données reçues (payload, alert).

Utilisation
Démarrer le Système

    Démarrez l'API Flask: Ouvrez un terminal dans le dossier flask_app/ et exécutez :

    python model_service.py

    Laissez ce terminal ouvert.

    Démarrez Node-RED: Ouvrez un autre terminal et exécutez node-red. Accédez à l'interface web.

    Déployez le Flux Node-RED: Dans l'interface web de Node-RED, cliquez sur "Deploy". Le flux devrait commencer à s'exécuter selon la configuration de votre nœud inject.

    Démarrez l'Application Frontend: Ouvrez un terminal dans le dossier de votre frontend et exécutez la commande appropriée (par exemple, npm run dev pour Next.js). Accédez à l'application dans votre navigateur.

Flux de Données

Le nœud inject déclenche le flux. Le nœud http request appelle l'API Flask pour obtenir la prédiction et le résultat d'anomalie pour la séquence de données suivante (simulée à partir du fichier CSV chargé par Flask). Le nœud function "Traiter Résultats" traite la réponse de Flask, met à jour le compteur d'anomalies consécutives, applique la logique de risque multi-niveaux et génère un message structuré. Ce message est ensuite envoyé via le nœud websocket out à tous les clients frontend connectés. Le frontend reçoit le message et met à jour son affichage en temps réel.
Données

Le projet utilise les fichiers de données suivants :

    Plant_1_Generation_Data.csv: Données de génération (DC/AC Power, Yield) pour la formation du modèle. Contient des SOURCE_KEY qui identifient les onduleurs.

    Plant_1_Weather_Sensor_Data.csv: Données météorologiques (Température Ambiante/Module, Irradiation) pour la formation du modèle. Contient un SOURCE_KEY unique pour la station météo.

    Plant_2_Generation_Data.csv et Plant_2_Weather_Sensor_Data.csv: Données similaires pour la simulation en temps réel par l'API Flask.

Note sur les données Inverter-level: Bien que Plant_1_Generation_Data.csv contienne des SOURCE_KEY pour différents onduleurs, l'analyse a montré que le jeu de données fourni ne contient qu'une seule entrée par SOURCE_KEY sur toute la période, ce qui rend l'entraînement de modèles individuels par onduleur impossible avec ce dataset spécifique. Le modèle est donc entraîné et utilisé au niveau agrégé de la centrale. Pour une surveillance par onduleur, un dataset avec des séries temporelles continues pour chaque onduleur serait nécessaire.
Travaux Futurs

    Intégration avec des Données Granulaires: Obtenir un dataset avec des séries temporelles continues par onduleur ou par composant pour permettre une détection d'anomalies et une localisation plus précises.

    Prédiction de la Défaillance Spécifique (Fault Diagnosis): Entraîner un modèle pour identifier le type de défaillance ou le composant spécifique défaillant (nécessite des données historiques de défaillance étiquetées par type et composant).

    Prédiction de la Durée de Vie Restante (RUL): Développer un modèle pour prédire le temps restant avant une défaillance (nécessite des données historiques avec le temps jusqu'à la défaillance).

    Intégration avec de Vrais Capteurs IoT: Connecter TAQA PREDICT à des flux de données en temps réel provenant de capteurs IoT déployés sur une centrale (par exemple, NOOR Ouarzazate III).

    Amélioration du Tableau de Bord: Ajouter des fonctionnalités d'analyse historique plus poussées, des visualisations interactives, des notifications par e-mail/SMS.

Contributeurs

    RGUIBI MOHAMED MOUAD

    AIT SAID AYOUB

    SABIR ACHRAF# TaqaPredict
