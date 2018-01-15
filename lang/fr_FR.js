var translations = [];

// Menu
translations["File"] = "Fichier";
translations["New"] = "Nouveau";
translations["Open"] = "Ouvrir";
translations["Save"] = "Enregistrer";
translations["View"] = "Affichage";
translations["Theme"] = "Thème";
translations["Dark"] = "Sombre";
translations["Light"] = "Clair";
translations["The modification will be applied at the next startup of MyViz"] = "La modification sera appliquée au prochain démarrage de MyViz";
translations["Systems"] = "Systèmes";
translations["Load"] = "Ouvrir";
translations["About T-Quad"] = "A propos de T-Quad";
translations["Help"] = "Aide";
translations["About MyViz"] = "A propos de Myviz";
translations["Tutorials"] = "Tutoriels";


// index.html
translations["#load"] = "Ouvrir";
translations["#save"] = "Enregistrer";
translations["#pane"] = "Ajouter un panneau";
translations["#datasources_list"] = "SOURCES DE DONNEES";
translations["#name"] = "Nom";
translations["#last_updated"] = "Derni&egrave;re mise &agrave; jour";
translations["#add"] = "Ajouter";
translations["#pretty"] = "[Normal]";
translations["#mini"] = "[Mini]";

// js/freeboard.js
translations["Save"] = "Enregistrer";
translations["Cancel"] = "Annuler";
translations["never"] = "jamais";
translations["Datasource"] = "Source de données";
translations["Widget"] = "Widget";
translations["Pane"] = "Panneau";
translations["Title"] = "Titre";
translations["Columns"] = "Colonnes";
translations['<p>Are you sure you want to delete this '] = '<p>Etes-vous sûr(e) de vouloir effacer ce ';
translations["Confirm Delete"] = "Confirmer la suppression";
translations["Yes"] = "Oui";
translations["No"] = "Non";
translations["<option>Select a type...</option>"] = "<option>Sélectionner un type...</option>";
translations["Name"] = "Nom";
translations["Type"] = "Type";

// extensions/button.widgets.js
translations["Button"] = "Bouton";
translations["A Button widget for serial or socket communications."] = "Contrôle de type bouton pour les communications série ou socket";
translations["Title"] = "Titre";
translations["Variable"] = "Variable";
translations["On value"] = 'Valeur "allumé"';
translations["Off value"] = 'Valeur "éteint"';
translations["Caption on button"] = 'Texte sur le bouton';
translations["Switch on"] = 'Allumer';

// extensions/buttonloaddashboard.widgets.js
translations["Button Load Dashboard"] = "Bouton ouverture dashboard";
translations["A Button widget that loads a dashboard when clicked."] = "Contrôle de type bouton permettant de charger un nouveau tableau de bord";
translations["Title"] = "Titre";
translations["Caption on button"] = 'Texte sur le bouton';
translations["Load"] = 'Ouvrir';
translations["Dashboard"] = 'Tableau de bord';
translations["Height"] = 'Hauteur';

// extensions/clock.datasources.js
translations["Clock"] = "Horloge";
translations["Refresh Every"] = "Rafraîchir toutes les";
translations["seconds"] = "secondes";

// extensions/closedloop.widgets.js
translations["Display closed loop"] = "Affichage boucle fermée";
translations["Reference"] = "Consigne";
translations["Variable corresponding to control reference"] = "Variable correspondant à la consigne d'asservissement";
translations["Error"] = "Erreur";
translations["Variable corresponding to the error between the reference and the output"] = "Variable correspondant à l'erreur (différence entre la consigne et la sortie)";
translations["Command"] = "Commande";
translations["Variable corresponding to the output of the controller"] = "Variable correspondant à la sortie du correcteur";
translations["Output"] = "Sortie";
translations["Variable corresponding to the output of the closed loop"] = "Variable correspondant à la sortie de la boucle fermée";

// extensions/colorwheel.widgets.js
translations["Color Wheel"] = "Roue des couleurs";
translations["Title"] = "Titre";
translations["Variable"] = "Variable";
translations["Variable corresponding to the color (in hexadecimal)"] = "Variable correspondant à la couleur (en hexadécimal)";
translations["Initial value of the color"] = "Valeur initiale de la couleur";

// extensions/dweetio.datasources.js
translations["Thing Name"] = "Nom de l'objet";
translations["Example: salty-dog-1"] = "Exemple: salty-dog-1";

// extensions/gauge.widgets.js
translations["Gauge"] = "Jauge";
translations["Title"] = "Titre";
translations["Value"] = "Valeur";
translations["Units"] = "Unité";
translations["Minimum"] = "Minimum";
translations["Maximum"] = "Maximum";

// extensions/googlemap.widgets.js
translations["Latitude"] = "Latitude";

// extensions/html.widgets.js
translations["Can be literal HTML, or javascript that outputs HTML."] = "Peut être du HTML brut ou du javascript qui produit du HTML";
translations["Height Blocks"] = "Hauteur en nombre de blocs";
translations["A height block is around 60 pixels"] = "La hauteur d'un bloc est environ 60 pixels";

// extensions/http.datasources.js
translations["Variables (if any) used in the URL above, separated by comma"] = "Variables éventuellement utilisées dans l'URL ci-dessus, séparées par des virgules";
translations["Put -1 for a one-shot request."] = "Mettre -1 pour un envoi manuel";
translations["Send if request has not changed"] = "Envoyer si la requête est inchangée";
translations['Whether or not the request must be sent if the "refresh" parameter above is > 0 and if the request has not changed.'] = 'Détermine si la requête doit être envoyée même si elle est inchangée et si le paramètre de rafraîchissement ci-dessus est > 0';

// extensions/identification.widgets.js
translations["Identification of electrical parameters"] = "Identification des paramètres électriques";
translations["Identification of mechanical parameters"] = "Identification des paramètres mécaniques";
translations["Resistance: "] = "Résistance: ";
translations["Inductance: "] = "Inductance: ";
translations["Measured current"] = 'Courant mesuré';
translations["Identified current"] = 'Courant identifié';
translations["Torque constant: "] = "Constante de couple: ";
translations["Inertia: "] = "Inertie: ";
translations["Damping: "] = "Frottement: ";
translations["Measured speed"] = 'Vitesse mesurée';
translations["Identified speed"] = 'Vitesse identifiée';
translations["Identification"] = "Identification";
translations["Identification of DC Motor parameters"] = "Identification des paramètres d'un moteur à courant continu.";
translations["Time (X axis)"] = "Temps (axe X)";
translations["Current"] = "Courant";
translations["Angular speed"] = "Vitesse de rotation";
translations["Current window (ms)"] = "Fenêtre en courant (ms)";
translations["Length of identification window for the current"] = "Longueur de la fenêtre d'identification en courant";
translations["Steady state start time on speed (ms)"] = "Début du régime permanent sur la vitesse (ms)";
translations["Take a margin so that you are sure that the speed has reached the steady state"] = "Prenez une marge pour être sûr qu'après cet instant la vitesse a atteint le régime permanent";
translations["Motor voltage during current try (V)"] = "Tension moteur essai en courant (V)";
translations["Motor voltage during speed try (V)"] = "Tension moteur essai en vitesse (V)";
translations["Gear ratio"] = "Rapport de réduction";

// extensions/indicator.widgets.js
translations["Indicator Light"] = "Indicateur lumineux";
translations["Title"] = "Titre";
translations["Value"] = "Valeur";
translations["On Text"] = 'Texte "allumé"';
translations["Off Text"] = 'Texte "éteint"';

// extensions/json.datasources.js
translations["Try thingproxy"] = "Essayer thingproxy";
translations['A direct JSON connection will be tried first, if that fails, a JSONP connection will be tried. If that fails, you can use thingproxy, which can solve many connection problems to APIs. <a href="https://github.com/Freeboard/thingproxy" target="_blank">More information</a>.'] = 'Une connexion JSON directe sera essayée en premier ; si elle échoue, une connexion JSONP sera essayée alors. Si elle échoue également, vous pouvez essayer thingproxy, qui peut résoudre de nombreux problèmes de connexion aux APIs. <a href="https://github.com/Freeboard/thingproxy" target="_blank">Plus d\\\'informations (en anglais)</a>.';
translations["Refresh Every"] = "Rafraîchir toutes les";
translations["seconds"] = "secondes";
translations["Method"] = "Méthode";
translations["Body"] = "Corps";
translations["The body of the request. Normally only used if method is POST"] = "Corps de la requête. Normalement, utilisé uniquement si la méthode est POST";
translations["Headers"] = "En-tête";
translations["Name"] = "Nom";
translations["Value"] = "Valeur";

// extensions/octoblu.datasources.js
translations["your device UUID"] = "UUID de votre device";
translations["your device TOKEN"] = "TOKEN de votre device";
translations["Server"] = "Serveur";
translations["your server"] = "Votre serveur";
translations["Port"] = "Port";
translations["server port"] = "Port de votre serveur";

// extensions/openweathermap.datasources.js
translations["Open Weather Map API"] = "API Open Weather Map";
translations["Location"] = "Lieu";
translations["Example: London, UK"] = "Exemple: Paris, FR";
translations["Units"] = "Unité";
translations["Metric"] = "Métrique";
translations["Imperial"] = "Impériale";
translations["Refresh Every"] = "Rafraîchir toutes les";
translations["seconds"] = "secondes";

// extensions/picture.widgets.js
translations["Picture"] = "Image";
translations["Image URL"] = "URL de l'image";
translations["Refresh Every"] = "Rafraîchir toutes les";
translations["seconds"] = "secondes";
translations["Leave blank if the image doesn't need to be refreshed"] = "Laisser vide si l'image ne doit pas être rafraîchie";

// extensions/playback.datasources.js
translations["Data File URL"] = "URL du fichier de données";
translations["A link to a JSON array of data."] = "Lien vers un tableau de données JSON";
translations["Is JSONP"] = "JSONP";
translations["Loop"] = "Boucler";
translations["Rewind and loop when finished"] = "Boucler depuis le début lorsque terminé";
translations["Refresh Every"] = "Rafraîchir toutes les";
translations["seconds"] = "secondes";

// extensions/plot.widgets.js
translations["Plot"] = "Tracé";
translations[" (right axis)"] = " (axe droit)";
translations["Title"] = "Titre";
translations["X axis"] = "Axe X";
translations["Seconds from start"] = "Secondes depuis le début";
translations["Column of datasource"] = "Colonne de la source de données";
translations['When choosing "Seconds from start", the data are timestamped when they are received'] = 'Si vous avez choisi "Secondes depuis le début", les données sont étiquettées temporellement lorsqu\\\'elles sont reçues';
translations["Time (X axis)"] = "Temps (axe X)";
translations['Fill only if you chose "Column of datasource" above.'] = 'Remplir uniquement si vous avez choisi "Colonne de la source de données" plus haut';
translations["X stop value"] = "Valeur de fin en X";
translations['X value at which the plot should stop. Put "inf" for continuous plot.'] = 'Valeur de X à laquelle arrêter le tracé. Mettre "inf" pour un tracé continu.';
translations["Time Window"] = "Fenêtre temporelle";
translations["Length (in seconds) of sliding time window"] = "Longueur (en secondes) de la fenêtre temporelle glissante";
translations["Left Y axis values"] = "Valeur de l'axe Y gauche";
translations["Left Y axis minimum range"] = "Intervalle minimum sur l'axe Y gauche";
translations["Right Y axis values"] = "Valeur de l'axe Y droit";
translations["Right Y axis minimum range"] = "Intervalle minimum sur l'axe Y droit";
translations["Two values separated by a comma. This range will be automatically extended if necessary, but it will not be reduced."] = "Deux valeurs séparées par des virgules. Cet intervalle sera automatiquement étendu si nécessaire, mais iil ne sera pas réduit";
translations["Include Legend"] = "Inclure la légende";
translations["Legend"] = "Légende";
translations["Comma-separated for multiple plots, left variables first, then right variables"] = "Séparer par des virgules en cas de tracés multiples. Commencer par les variables de l'axe gauche, puis celles de l'axe droit";
translations["Height Blocks"] = "Hauteur en nombre de blocs";
translations["A height block is around 60 pixels"] = "La hauteur d'un bloc est environ 60 pixels";
translations["Pausable"] = "Pausable";

// extensions/pointer.widgets.js
translations["Pointer"] = "Pointeur";
translations["Direction"] = "Direction";
translations["In degrees"] = "En degrés";
translations["Value Text"] = "Texte correspondant à la valeur";
translations["Units"] = "Unité";

// extensions/select.widgets.js
translations["Datasource type not supported by this widget"] = "Type de source de données non supporté par ce contrôle";
translations["Select"] = "Liste déroulante";
translations["Title"] = "Titre";
translations["Datasource"] = "Source de données";
translations["You *must* create first a datasource with the same name"] = "Vous *devez* créer tout d'abord une source de données avec ce nom";
translations["Variable"] = "Variable";
translations["List of captions"] = "Liste de textes";
translations["Use the comma as separator"] = "Utiliser la virgule comme séparateur";
translations["List of values"] = "Liste de valeurs";
translations["Use the comma as separator"] = "Utiliser la virgule comme séparateur";

// extensions/serialport.datasources.js
translations["Serialport"] = "Port série";
translations["A real-time stream datasource from Serial port."] = "Flux de données temps-réel provenant du port série.";
translations["Port"] = "Port";
translations["Baudrate"] = "Nombre de bauds";
translations["Variables to read"] = "Variables à lire";
translations["Name of the variables to read, separated by comma"] = "Nom des variables à lire, séparées par des virgules";
translations["Variables to send"] = "Variables à envoyer";
translations["Name of the variables to send, separated by comma"] = "Nom des variables à envoyer, séparées par des virgules";
translations["Refresh rate for sending data"] = "Taux de rafraîchissement pour l'envoi des données";
translations["Refresh rate for sending data. Data will be sent even if control values are not changed"] = "Taux de rafraîchissement pour l'envoi des données. Les données seront envoyées même si la valeur des contrôles auxquelles elles sont connectées sur le tableau de bord est inchangé";
translations["milliseconds"] = "millisecondes";
translations["Separator"] = "Séparateur";
translations["Separator character for received and (optionally) sent values"] = "Séparateur des données reçues (et éventuellement envoyées)";
translations["Checksum method"] = 'Méthode de "somme de contrôle"';
translations["If values are sent, a checksum will be automatically added in variable '_crc', computed from the other values."] = 'Si des données sont envoyées, une "somme de contrôle" sera automatiquement ajoutée dans une variable "_crc", calculée à partir des autres valeurs';
translations["None"] = "Aucune";
translations["Sum"] = "Somme";
translations["String concatenation"] = "Concaténation de chaîne de caractères";
translations["Immediate startup"] = "Démarrage immédiat";
translations["Define whether or not you want to start the communication when the dashboard is loaded."] = "Permet de définir si vous souhaitez ou non démarrer la communication lors de l'ouverture du tableau de bord.";

// extensions/slider.widgets.js
translations["Datasource type not supported by this widget"] = "Type de source de données non supporté par ce contrôle";
translations["Slider"] = "Curseur";
translations["A Slider widget for serial or socket communications."] = "Contrôle de type curseur pour les communications série ou socket";
translations["Title"] = "Titre";
translations["Datasource"] = "Source de données";
translations["You *must* create first a datasource with the same name"] = "Vous *devez* créer tout d'abord une source de données avec ce nom";
translations["Variable"] = "Variable";
translations["Formula"] = "Formule";
translations['The value really sent will be computed from the slider value. <br />Use "x" as slider value'] = 'La valeur réellement envoyée sera calculée à partir de la valeur du curseur. <br />Utiliser "x" comme valeur du curseur';
translations["Initial value"] = "Valeur initiale";
translations["Min"] = "Min";
translations["Max"] = "Max";
translations["Number of decimals"] = "Nombre de décimales";
translations["Reset value"] = "Valeur de réinitialisation";
translations["Caption on reset button"] = "Texte sur le bouton de réinitialisation";
translations["Reset"] = "Réinitialisation";

// extensions/sparkline.widgets.js
translations["Sparkline"] = "Sparkline";
translations["Title"] = "Titre";
translations["Value"] = "Valeur";
translations["Include Legend"] = "Inclure la légende";
translations["Legend"] = "Légende";
translations["Comma-separated for multiple sparklines"] = "Séparer par des virgules pour de multiples sparklines";

// extensions/switchbutton.widgets.js
translations["Datasource type not supported by this widget"] = "Type de source de données non supporté par ce contrôle";
translations["Switch button"] = "Interrupteur";
translations["A Switchbutton widget for serial or socket communications."] = "Contrôle de type interrupteur pour les communications série ou socket";
translations["A Switchbutton widget for serial, socket or http communications."] = "Contrôle de type interrupteur pour les communications série, socket ou http";
translations["Title"] = "Titre";
translations["Datasource"] = "Source de données";
translations["You *must* create first a datasource with the same name"] = "Vous *devez* créer tout d'abord une source de données avec ce nom";
translations["Variable"] = "Variable";
translations['"YES" text'] = 'Texte correspondant à "YES"';
translations['"YES" value'] = 'Valeur "YES"';
translations['Value corresponding to "YES" position'] = 'Valeur corrspondant à la position "YES"';
translations["Corresponding numeric value is 1"] = "La valeur numérique correspondante est 1";
translations['"NO" text'] = 'Texte correspondant à "NO"';
translations['"NO" value'] = 'Valeur "NO"';
translations['Value corresponding to "NO" position'] = 'Valeur corrspondant à la position "NO"';
translations["Corresponding numeric value is 0"] = "La valeur numérique correspondante est 0";
translations["Corresponding value is defined below"] = "La valeur correspondante est définie ci-dessous";
translations["Initial state"] = "Etat initial";

// extensions/switchserialport.widgets.js
translations["Datasource type not supported by this widget"] = "Type de source de données non supporté par ce contrôle";
translations["Switch Serial Port"] = "Interrupteur Port Série";
translations["A Switchbutton widget for serial communications."] = "Contrôle de type interrupteur pour les communications série";
translations["Title"] = "Titre";
translations["Serial datasource"] = "Source de données séries";
translations["Datasource name corresponding to the serial port to switch. You *must* create first a datasource with the same name"] = "Source de données correspondant au port série à commuter. Vous *devez* créer tout d'abord une source de données avec ce nom";
translations['"ON" text'] = 'Texte correspondant à "ON"';
translations['"OFF" text'] = 'Texte correspondant à "OFF"';
translations["Initial state"] = "Etat initial";

// extensions/text.widgets.js
translations["Text"] = "Texte";
translations["Title"] = "Titre";
translations["Size"] = "Taille";
translations["Regular"] = "Normale";
translations["Big"] = "Grande";
translations["Small"] = "Petite";
translations["Value"] = "Valeur";
translations["Include Sparkline"] = "Inclure une sparkline";
translations["Animate Value Changes"] = "Animer les changements de valeur";
translations["Units"] = "Unité";

// extensions/textarea.widgets.js
translations["Play"] = "Redémarrer";
translations["Pause"] = "Pause";
translations["Pause and Explore"] = "Pauser et Explorer";
translations["Save to file"] = "Enregistrer";
translations["Text Area"] = "Zone de texte déroulante";
translations["Title"] = "Titre";
translations["Number of lines to keep"] = "Nombre de lignes à conserver";
translations["Empty for unlimited"] = "Laisser vide si le nombre est limité";
translations["Value"] = "Valeur";

// extensions/websocket.datasources.js
translations["A real-time stream datasource from Websocket servers."] = "Flux de données temps-réel provenant d'un serveur de Websocket.";
translations["Host"] = "Hôte";
translations["Include ws:// or http:// ,..."] = "Inclure ws:// ou http:// ,...";
translations["Refresh rate for sending data. Data will be sent even if control values are not changed"] = "Taux de rafraîchissement pour l'envoi des données. Les données seront envoyées même si la valeur des contrôles auxquelles elles sont connectées sur le tableau de bord est inchangé";
translations["milliseconds"] = "millisecondes";

exports.translations = translations;