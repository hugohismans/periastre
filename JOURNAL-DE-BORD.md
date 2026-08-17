# Journal de bord

Le relevé au fil de l'eau : on a fait ci, on a fait ça. Écrit pour ne rien
coûter — quelques lignes par session, pas une rédaction.

**Il alimente `cap.html`**, la feuille de route lisible par un humain. Celle-ci
ne se met PAS à jour à chaque fois : c'est trop lourd, et Hugo l'a dit le
7 août 2026. La règle est donc :

1. J'écris ici à chaque session, en fin de session, court.
2. De temps en temps — quand ce fichier a assez grossi, ou qu'une direction a
   changé — je propose : *« on refait le cap ? »*
3. On remet `cap.html` d'aplomb ensemble, et on note ici la date de la remise.

Hugo peut aussi le déclencher à tout moment : « on refait le cap ».

**Dernière remise à plat de `cap.html` : 10 août 2026.**

---

## 17 août 2026 — la séance sortait de l'écran de son téléphone

**« La fenêtre de juge n'est pas adapté au layout mobile, elle sort de l'écran
je n'y ai pas accès. »** Avec une capture d'un téléphone couché, panneau coupé
par le bas.

Il n'a plus son ordinateur. La séance de jugement est le seul outil du projet
qu'aucun calcul ne remplace — tout ce que lui seul peut voir passe par elle — et
elle était devenue inatteignable sur le seul appareil qui lui reste. Tout le
reste du chantier attendait derrière.

### Ce qui a été fait

Le panneau est coupé en deux : **le corps** (la question, ses variantes), qui se
resserre et défile sur un écran court, et **le socle** (le champ libre, les
rangées de boutons, la ligne d'état), qui ne quitte jamais le bas de la fenêtre.
Sur un grand écran la mise en page ne bouge pas d'un pixel.

### Ce que la mesure a appris, et que je n'aurais pas trouvé en réfléchissant

- **Borner le seul paragraphe ne suffisait pas.** Première réparation : le texte
  se tassait bien, mais les variantes et le champ libre poussaient quand même
  « Noter autre chose » et « Déplier pour répondre » quarante-six pixels sous le
  bord. C'est-à-dire le bouton qui sert quand on n'a PAS de réponse, et celui qui
  rouvre le panneau une fois replié : le refermer, c'était le perdre.
- **Les boutons de variante avaient disparu aussi.** Sur la capture de la
  troisième question, aucun angle de vue n'était visible : la question annonçait
  « quatre angles » et n'en montrait pas un. Ce sont des boutons — ils sont
  passés avec les boutons.
- **Le champ libre avait disparu entièrement.** Il était resté avec la question,
  donc il défilait avec elle ; sur la capture il ne restait que quatre boutons de
  verdict et rien pour écrire. Or c'est ce champ qui rend le vrai jugement —
  « pas mal mais les orbites sont circulaire ? », « non c'est super nul » : aucun
  de ces mots ne serait arrivé si la boîte pour les écrire ne s'était pas
  montrée. Un « ça coince » sans phrase est un défaut trouvé qu'on ne saura pas
  réparer. Il est passé dans le socle.
- **Le premier contrôle mesurait le panneau REPLIÉ**, donc il ne prouvait rien.
  Puis sa deuxième version cherchait le bouton dont le texte dit « Déplier » —
  ce libellé n'est réécrit qu'au changement de question, jamais au dépli : il a
  laissé une question fermée et son champ libre à zéro pixel. Un contrôle qui lit
  une étiquette pour connaître un état lit une étiquette périmée.
- **Une règle de style était inerte.** Sabotée, le contrôle restait vert : le
  socle ne grandissait déjà pas. Ce qu'il fallait lui interdire est de RÉTRÉCIR.

### Deux ajouts de séance, dans la foulée

- **Une question neuve : « le début du voyage ».** Il l'avait cochée le 16 août
  sans pouvoir dire quoi — ses transcriptions cassent, et une gêne se dit mal.
  C'est exactement le cas que la séance existe pour rattraper : on ne devine pas,
  on pose la chose sous ses yeux et on laisse le champ ouvert. Quatre angles : la
  seconde zéro, le demi-tour fini, un peu plus loin, et le même départ en
  « fidèle » pour comparer. Sa section dans `A-REGARDER.md` va avec, sinon
  l'outil rougit dans les deux sens.
- **La question de l'arrivée avouait encore un voile tombé.** Elle disait « ce
  ciel noir est peint, on le couvre » — c'était vrai jusqu'au 16 août. Elle dit
  maintenant ce qui reste faux : ces étoiles sont celles de l'amas de
  Sagittarius A*, pas les nôtres.

### Les contrôles laissés derrière (règle 1)

`VERIF.seanceSurTelephone()` joue la séance entière sur un écran de téléphone
couché simulé et mesure, question par question : rien du socle ne sort de la
fenêtre, le champ libre garde de quoi écrire une phrase, et ce qui déborde du
corps se rattrape en défilant. Sa vérité vient de la mise en page réelle, rendue
par le navigateur, et non de ma feuille de style. Son témoin : desserrée, la
séance doit VRAIMENT dépasser les quatre cents pixels — sinon tout passerait à
vide. Prouvé faillible deux fois, sur les deux règles qu'il surveille.

La règle de média est devenue une **classe**, exprès : une règle de média ne
s'éprouve qu'en redimensionnant la vraie fenêtre, ce qu'aucun contrôle de la page
ne sait faire. Sans ce changement, ce défaut-là n'aurait jamais eu de contrôle.

**Et un contrôle qui manquait depuis toujours :** `outil-verif-juge.js` vérifie
maintenant que `juge.js` COMPILE. Un accent grave écrit dans un commentaire ferme
le gabarit de chaîne qui porte la feuille de style et tue le fichier entier —
c'est arrivé trois fois en deux jours, et aucun des quarante-huit outils ne
pouvait le dire : celui-ci lisait le fichier comme du texte, et un texte cassé se
lit très bien.

---

## 16 août 2026, tard — un seul vol, et le compteur dit enfin la vérité

**« à la moitié du voyage, elle repasse à zéro alors que non, elle doit aller à
proche de la vitesse de un c, puis décélérer jusqu'à arriver au système solaire
avec une vitesse de zéro. C'est le compteur il ne marche pas. »**

Il avait raison, et le défaut était plus profond que le compteur. Le voyage était
**présenté comme un seul et calculé comme trois** : 0 → 1 c → **0** → 0,49 c → 0.
Tant qu'il y avait deux boutons entre les jambes, ce profil se lisait comme trois
voyages ; depuis ce matin, c'était un compteur cassé.

**Il n'y a plus qu'un vol.** `RECUL` le porte d'un bout à l'autre, et la scène
solaire comme la dernière marche cessent de posséder un trajet : elles lisent la
même position, dans leur repère à elles — distance au Soleil = chemin total moins
distance au trou noir, distance à la Terre = celle-là moins le demi-grand axe.
L'avancement de la dernière marche se **déduit** de la distance au lieu de
s'accumuler : deux horloges pour une même chute finissent toujours par se
contredire. Mesuré dans la page : 0,0009 c, 0,023 c, **c à 3 milliardièmes près**,
puis 0,526 c en freinant, 0,0025 c, 0,0001 c en arrivant. Une montée, une
descente.

**ET LE RYTHME A DÛ SUIVRE, sinon le remède empirait le mal.** Sa seconde
remarque — « au loin, on ne voit pas le système solaire, il n'y a pas de tags
[…] il y a juste le tag de la terre à la fin » — était mesurable : dix-sept
secondes sur vingt-trois ne montraient qu'un point et le mot « Soleil ». Sur un
vol unique en « fidèle », c'est pire : **3,8 % du temps d'écran** pour tout le
système solaire.

D'où **le régulier symétrique**, et c'est la vraie trouvaille de la soirée. Le
régulier étalait les décades de la distance COMPTÉE — celle de l'astre qu'on
quitte. Entre le nuage de Oort et nous, cette distance varie d'un cent-millième :
la moitié qui compte recevait un cent-millième du temps. On avance donc d'un
facteur constant par seconde **mesuré des deux côtés**, sur ce qu'on quitte et
sur ce qu'on rejoint. Le paramètre est u = log(d_quitté / d_restant), la position
s'en déduit en forme close, et le système solaire passe de 3,8 % à **23 %**.
La position change, la physique non : `vol` reste l'état du vrai vol à 1 g.

**Hugo a tranché le défaut**, et la ligne qui le gardait avait annoncé sa propre
fin : « le jour où il répond, c'est cette ligne-là qu'on change, exprès ».
« Fidèle » reste sous le bouton.

**Et sa troisième demande était de la physique, pas de la rédaction** : « il faut
que ce soit clair, qu'une vitesse c'est par rapport à quelque chose ». Le cadran
dit « vitesse / Soleil », et le repère porte sa propre simplification — le Soleil
et Sagittarius A* ne sont pas au repos l'un par rapport à l'autre. Quinzième
compromis déclaré.

**Ce qui est mort en chemin :** `lanceChute`, `majChute`, `lanceTerreLune`,
`finVoyage`, `majTerreLune`, `raccordUa`, et les deux coûts gardés à part. Six
fonctions et deux états retirés pour un voyage qui fait davantage.
`outil-verif-noms.js` m'a repris au passage — `verif.js` appelait encore
`raccordUa`, et c'est exactement la ReferenceError silencieuse qu'il existe pour
attraper.

Trois contrôles sont tombés en changeant le défaut, et les trois pour la bonne
raison — dont un sabotage qui tenait pour acquis que le défaut était « fidèle ».
Un contrôle qui recopie la valeur qu'il surveille cesse de surveiller au premier
changement. 48 outils, aucun échec.

## 16 août 2026, la nuit — ses deux remarques, et la seconde était grave

**« le premier question de juge ne me remet pas au trou noir, j'ai du mal de
juger je reste sur la terre. »** Il venait de faire le voyage, puis d'ouvrir la
séance. La scène Terre-Lune était restée OUVERTE, laissée par sa partie, et elle
se repeignait par-dessus : il jugeait le repère du voyage à travers une planète.
Les quatre poseurs de scène rangeaient le télescope, le trajet et la carte ;
aucun ne rangeait les deux scènes. Le préambule était recopié quatre fois — il
est maintenant dans `tableRase`, une fois, et il range tout. **Ça ne se voyait
pas tant qu'il fallait deux boutons pour arriver à la Terre.** Depuis ce matin,
c'est la chose la plus facile du site. Et la question part désormais DU TROU
NOIR, comme il l'a demandé.

**« les rotations de la caméra à la souris, ça ne marche plus. Genre je peux me
déplacer avec z q s d, mais pas avec la souris. »** Celle-là était plus grave, et
elle m'a coûté trois mesures fausses avant la bonne.

`TELESCOPE.carte` valait **0,83** à l'arrivée à la Terre. Or la rotation commence
par « si la carte est levée, le geste tourne LA CARTE et non la tête ». Son geste
tournait donc une carte d'étoiles S invisible. Le clavier n'y passe pas — d'où
« z q s d marche, la souris non ».

**La faute était dans `fondus` :** `veutCarte` ne regardait que « le recul est
fini et l'on ne rentre pas ». Toute arrivée levait la carte, y compris celle du
système solaire où il n'y a pas une étoile S à montrer. Le DESSIN le savait déjà
— la case 3.11 du 10 août a fait de `carte:` une donnée portée par la destination
— mais le fondu ne l'avait jamais apprise. **Deux vérités pour une même question,
dont l'une muette** : le dessin se taisait, la valeur montait quand même, et
personne ne regardait cette valeur-là. Elle commandait pourtant la souris.

**Et mes trois fausses pistes valent d'être écrites**, parce qu'elles se
ressemblent toutes : je mesurais depuis un état que je ne maîtrisais pas.

1. Je forçais `salon.actif` au lieu de franchir l'accueil — l'écran d'accueil
   restait par-dessus avec `pointer-events:auto` et avalait tous les clics. La
   mesure disait « la souris est morte » partout, y compris sur la version
   d'avant. J'ai failli « réparer » quelque chose qui n'avait rien.
2. Je lisais `glisse` depuis l'extérieur en croyant qu'un `null` voulait dire
   « le geste n'est pas arrivé ». Il voulait dire « je ne vois pas cette
   variable ».
3. J'ai comparé à la version publiée d'hier et conclu « ce n'est pas une
   régression » — ce qui était vrai de mon test faux, et faux du site.

C'est trois fois la règle 5, et c'est le seul contrôle qui m'ait vraiment appris
quelque chose aujourd'hui : **la comparaison à l'ancienne version ne prouve rien
quand la mesure est cassée des deux côtés.**

Deux contrôles neufs et leurs sabotages. `VERIF.seanceTableRase()` salit
lui-même les deux scènes, les marque d'une valeur qu'aucune ouverture ne
produirait, et exige qu'aucune question n'HÉRITE — il ne nomme aucune question,
donc il survivra au prochain remaniement de la file. Et deux points dans
`outil-verif-recul.js` : là où il y a une carte elle se lève, là où il n'y en a
pas elle reste éteinte. **Le contrôle du retour a été resserré au passage** : il
serait devenu vert pour deux raisons, donc vert le jour où `retour` cesserait
d'être lu.

48 outils, aucun échec. 155 contrôles dans `recul`, de 153.

## 16 août 2026, le soir — l'arrivée refaite après son « super nul »

Séance de jugement. La scène solaire passe (« ça va »), l'arrivée Terre-Lune ne
passe pas : *« non c'est super nul. pas du tout ce que je veux. »* Trois demandes
précises, et il avait raison sur les trois.

**Les vraies photos, et c'était le pire genre d'avoir raison.** *« la terre et la
lune utilise des vrai photo, ont les a dans le projet »* — elles y étaient depuis
cinq jours, sourcées NASA, gardées par un outil, et **seule la page du rivage
s'en servait**. La scène de l'arrivée dessinait encore des taches à la main. Le
registre sort dans `atlas.js` : recopier la liste aurait donné deux tables pour
six images, dont l'une aurait divergé en silence. La projection sur la sphère est
écrite une seconde fois — en pixels, la scène dessinant sur un canevas 2D — et
c'est assumé parce que les deux moteurs ne peuvent rien partager d'autre que le
RÉSULTAT : l'arbitre refait le chemin du nuanceur (couper la sphère, lire la
normale) quand `atlas.js` inverse la projection en forme close. Deux algèbres
sans une ligne commune, d'accord à 10⁻¹² sur 1 748 points. **C'est ce qui attrape
une inversion du nord**, et aucun œil ne rattrape ça sur la Lune.

**Les étiquettes, et le rang qui compte.** *« tu peux ajouter des tag, pour qu'on
remarque la lune »*. `etiquettes.js` était écrit, éprouvé, déjà chargé dans la
page ; personne ne l'appelait. La Lune est au **rang zéro** : quand les deux
étiquettes se marchent dessus, c'est elle qui parle. La Terre, on ne la rate pas.
Le sabotage échange les deux rangs — le COMPTE d'étiquettes ne bouge pas, seule
celle qui compte disparaît.

**Le voyage d'un seul tenant.** *« un voyage depuis sagitarius a travers la
galaxie, apres un moment on voit le systeme solaire, on zoom dessus, PUIS on zoom
sur le systeme terre lune »*. C'étaient trois vols séparés par deux boutons, et un
bouton est un arrêt. Le raccord se **dérive** — le demi-pixel de la Terre et son
demi-grand axe, 1,08 ua du Soleil — et 119,7 ua cesse d'être une fin pour devenir
un passage. Le disque du Soleil suit enfin `soleilVu.dessinable`, qui existait
depuis le 11 août : on descend sous 8,8 ua, et garder un point d'un pixel là où
il en fait onze aurait été un mensonge par omission.

**Quatre défauts trouvés en chemin, dont trois que je ne cherchais pas.**

1. **L'aveu disait « reliefs évoqués » devant une photographie.** Vu sur la
   première capture. Les deux moitiés étaient justes séparément ; la faute
   n'était que dans leur rapport, et ce rapport n'était écrit nulle part.
2. **La dernière marche avançait dans le DESSIN.** Le temps de la scène dépendait
   de son affichage : une image sautée la figeait, et la fin du voyage ne pouvait
   se déclencher que si quelqu'un regardait. La maladie de `couture()`, en plus
   discret parce que rien ne bougeait de travers.
3. **Mes propres mesures m'ont repris deux fois** — `acos` ne sait pas résoudre
   sous 10⁻⁸ près de zéro, et j'ai failli desserrer le seuil au lieu de mesurer
   la corde ; puis `poseMots` fusionne, donc un contrôle qui lui passait `{}`
   mesurait les mots posés trois lignes plus haut.
4. Et **`outil-verif-ordre.js`** a refusé deux états déclarés sous les fonctions
   qui les lisent.

**Ce qui est resté sur le carreau, et pourquoi.** Sa remarque sur les orbites —
*« je pensais que c'etait plus eliptique que ca »* — appelle les vraies ellipses.
Le dépôt ne porte l'excentricité d'aucune planète, la table du JPL n'était
joignable depuis **aucune adresse** de cette machine, et l'on n'écrit rien de
mémoire. `SOURCES-SOLAIRE.md` §7 porte l'adresse, les deux colonnes qu'il faut et
le rappel que b se dérive. C'est la même retenue que le 10 août, et elle avait
payé le lendemain.

Deux compromis déclarés (la face qu'on regarde, le rayon qu'on descend).
`outil-verif-atlas.js` neuf (25 contrôles), la scène passe de 81 à 95,
`VERIF.voyageDunSeulTenant()` en pose 10 avec quatre sabotages sur le vrai dépôt.
Le plafond de taille monte de 106 lignes en quatre temps, chacun argumenté sur
place — et il en rend 24 avec les deux cartes du panneau. **48 outils, aucun
échec.**

## 16 août 2026 — la séance ne posait que la moitié des questions

Hugo revient après deux jours et demande où en sont les plans : sept sessions
Périastre restaient ouvertes, deux marquées « bloquées ». Il a tranché tout de
suite qu'on ne les réveille pas — **leur travail était déjà fusionné, branche par
branche**, et chacune avait écrit son compte rendu ici même. Il n'y avait rien à
récupérer d'elles. Rangées.

**Ce qui était ouvert n'était pas du code. Et il en manquait la moitié.**
`A-REGARDER.md` portait quatre questions ; `juge.js` n'en posait que deux. Les
deux du 14 août — le repère du voyage, la vitre avant — avaient été rédigées,
complètes et bien tournées, et n'étaient jamais arrivées jusqu'à la séance. Or ce
fichier s'ouvre sur « ne me lis pas, ouvre `?juge` » : **une question qui reste
dans la source n'est posée nulle part.** Hugo pouvait y passer ses dix minutes et
ressortir en croyant avoir tout jugé.

Elles sont posées. Le contrôle qui les garde lit les deux fichiers et exige leur
accord **dans les deux sens** — une section ouverte sans question posée, et une
question posée dont la section est passée en ✅. Le second sens est celui qui a
mordu le 11 août.

**Et trois défauts sont tombés en chemin, dont deux que je n'allais pas chercher.**

1. **L'outil se faisait avoir par son propre fichier.** Le corps d'une question
   va jusqu'à la suivante, donc il emporte le commentaire qui présente celle-ci
   — et ces commentaires écrivent « donc `inspection: true` ». La phrase suffisait
   à faire croire que le champ était là. Une déclaration se lit dans le code,
   jamais dans la prose qui l'explique : on ôte les commentaires avant de
   chercher les champs. **Ce qui a démasqué le défaut n'est pas le contrôle, mais
   son sabotage** — qui virait au rouge en silence depuis six jours.
2. **Et sitôt réparé, il a trouvé une vraie question sans forme déclarée** :
   `arrivee-hors-file`, dernière du tableau, verte uniquement grâce au texte qui
   la suivait. Elle est rangée, et c'est justement pour ça qu'il fallait la
   déclarer — `rythme-grand-trajet` a été rouverte le 11 août, et le jour où l'on
   rouvre celle-ci, un champ manquant coûterait la séance sans prévenir.
3. **La vitre avant se dérobait sous l'œil, et ça ne se voyait que dans la
   page.** Tourner la visée de 180° ne suffit pas : `recentre` la ramène vers
   l'astre à 0,8 par seconde. Mesuré : **21° en six dixièmes de seconde, et 7,8°
   d'écart au bout d'une seconde** là où il en faut 180. Hugo aurait jugé une vue
   qui fuit, et il l'aurait trouvée mauvaise pour une raison qui n'est pas celle
   qu'on lui demande. Le remède est le drapeau que la page pose elle-même quand
   la main prend la visée : la séance ne triche pas, elle refait son geste.

**Le piège du 11 août était armé une seconde fois, à la même place.** Ce jour-là,
`rangeGrandTrajet` reposait « fidele » en dur — juste tant que le rythme n'était
pas réglable, destructeur le jour où le bouton est apparu. Le repère l'est depuis
le 14. La séance mémorise donc ce qu'elle a trouvé et repose **celui-là**.
`VERIF.questionsDuVoyage()` écrit un choix de joueur, joue la question, et exige
de le retrouver ; sa seconde moitié tient la vitre avant, avec son témoin — sans
lui, « la vue ne bouge pas » ne prouverait rien.

**Une seule loi pour le grand trajet.** Trois questions en ont maintenant besoin
— le rythme, le repère, la vitre. `poseGrandTrajet` est sortie du corps de
`rejoueGrandTrajet` plutôt que recopiée trois fois. Et il fallait bien le GRAND
trajet : `rejoueVoyage` part vers les étoiles S, à dix mille unités
astronomiques, un saut qui ne porte pas une décade — les neuf ne sont que sur la
route du système solaire.

17 contrôles dans `outil-verif-juge.js` (de 6), 6 dans la page, cinq sabotages
rejoués sur de vraies copies des deux fichiers et deux sur le vrai dépôt.
47 outils, aucun échec.

**Ce qui attend son œil** : les quatre questions, dans `?juge`, dix minutes. Et
`cap.html` date du 10 août — ni les coquilles, ni la vitre, ni l'arrivée chez
nous n'y sont. **On refait le cap une fois ses verdicts connus**, pour que la
remise à plat les intègre au lieu de les précéder.

## 14 août 2026 — les coquilles se dessinent, et le vaisseau a une vitre avant

Sa critique du 12 août commandait tout : *« le quadrillage, c'est comme si on
dézoomait, mais on ne dézoome pas, on RECULE. »* La loi (`RECUL.coquilles`)
était posée et gardée depuis ce jour-là ; **personne ne dessinait rien**.

**Le dessin, et la seconde forme qui a disparu.** Une coquille est une sphère,
et un point de sphère s'écrit avec deux angles. Je cherchais quoi tracer pour
une coquille franchie — un cercle qui rétrécit derrière — sans inventer une
forme à côté du maillage. Il n'y en a pas besoin : **la silhouette EST une
parallèle**, celle de θ = acos(R/d), qui n'existe que si R < d, c'est-à-dire
exactement quand la coquille est franchie. Le cercle derrière et les anneaux
qu'on traverse devant sont le **même trait**, à deux valeurs de θ.

**Aucune échelle.** Le vaisseau se déplace vraiment dans le repère du monde
pendant le voyage, et l'unité du monde est le rayon de Schwarzschild : une
coquille de 10ⁿ rₛ se dessine à 10ⁿ, littéralement.

**Le contrôle qui porte sa critique** : sur tout le trajet, le rayon d'une
coquille ne dérive pas de plus de 8 × 10⁻¹⁶ sur douze décades, tandis que la
maille du quadrillage est multipliée par 1,0 × 10⁹. C'est CE geste qu'il a
nommé « dézoomer », et il est maintenant mesuré à côté du sien.

**Le quadrillage reste sous la main**, dans les réglages. Les deux repères
portent les neuf décades — mesuré des deux côtés — donc aucun calcul ne les
départage : ce qui les sépare est le geste, et un geste se juge à l'œil. Le
plafond de taille monte de 42 lignes, argumenté sur place.

**La vitre avant** — « oui, les vitres, c'est le cœur ». La cloison arrière
s'ouvre, même découpe et même signature que la baie. Le piège évité : la faire
entrer dans `vitres()` aurait déplacé l'ancre de l'arrivée Terre–Lune, qui est
la moyenne de cette liste, au milieu de la pièce.

**Deux défauts trouvés à l'œil, chacun devenu un contrôle.**

1. On se retourne, et le repère s'éteint — 1,00 en regardant la baie, 0,39 puis
   0,10 après le demi-tour. `enVue` mesurait l'alignement à l'ASTRE, ce qui
   était juste tant qu'il n'y avait qu'une ouverture. Le trajet est radial et
   les deux vitres cadrent le même AXE : `enVueAxe`.
2. **Et celui-là était en ligne depuis des jours.** Par la vitre avant on lisait
   « Soleil » à côté d'une coquille de 1,3 al, alors qu'il est à vingt-sept
   mille. `APPROCHE.dessine` était appelé pendant tout le trajet et son garde ne
   gardait rien — il testait `S()`, qui rend un module toujours chargé. Le nuage
   de Oort était peint pendant les neuf décades du voyage, et invisible pour une
   seule raison : le calque ne se découpait qu'à la baie, qui regarde en
   arrière, tandis que la scène se pose devant. Peinte et jetée à chaque image.
   **Une ouverture neuve a été le premier outil capable de le voir.**

**Ce qui attend son œil** : coquilles ou quadrillage. Le voile de l'arrivée
(douzième compromis) n'a PAS été retiré — il porte sur ce que la baie peint à
l'arrivée, et rien ici ne l'a levé. À reprendre au prochain cap : `CLAUDE.md`
écrit que « le vaisseau ne se déplace jamais », alors que `majVoyage` pose
`salon.p` à la distance courante — c'est même ce qui rend les coquilles justes
sans aucune échelle.

## 11 août 2026 — la scène solaire : on arrive dans le vide, et on tombe

Le cadrage était d'Hugo, tranché la veille au soir : *« les deux, dans cet
ordre »*. On arrive dans le nuage de Oort, où les huit planètes tiennent dans
deux pixels et où **aucune étiquette n'a le droit d'exister**, puis on continue à
tomber jusqu'à ce que les orbites s'écartent. Le passage d'un régime à l'autre
est le sujet, pas un fondu.

**Trois modules neufs, et pas une ligne de leur logique dans la page.**

- **`etiquettes.js`** — « point du monde → étiquette », et sa première
  responsabilité est de **se taire**. Trois silences distincts, et **aucun seuil
  de repli** : un appelant qui ne dit pas son écartement n'obtient rien.
- **le Soleil, dans `solaire.js`** — doctrine de `lune.js` : son disque reste
  **sous le demi-pixel partout** dans la scène (le premier pixel arrive à 8,8 ua,
  soit dans l'orbite de Saturne), donc jamais de disque, on dit le grossissement
  qu'il faudrait. Mais il rayonne : sa magnitude est **dérivée** de la luminosité
  nominale et du point zéro de l'UAI.
- **`approche.js`** — les deux bouts de la chute et sa physique. Départ à
  20 000 ua, le bord du nuage externe que la fiche porte déjà ; **arrivée pas
  écrite**, cherchée à la distance où le cinquième nom tient debout — 119,7 ua.

**Une seule loi, deux fois plutôt qu'une.** Les deux tests de `solaire.js` et le
test unique d'`etiquettes.js` sont **le même**, et c'est prouvé sur 73 distances
plutôt qu'affirmé. Et la loi du trajet à 1 g est **sortie du corps d'`avance`**
dans `RECUL.ou`, parce que la chute en avait besoin : deux copies d'une loi de
mouvement finissent toujours par diverger, l'œil d'Hugo l'a déjà vu une fois.

**Ce qu'on dessine sont des anneaux, pas des orbites.** On ne sait pas où est
Jupiter — les colonnes du JPL donnent le demi-grand axe et rien d'autre. On trace
donc le cercle qui **borne** l'écart au Soleil, et l'aveu le dit au visiteur.

**Le défaut, et il a fallu regarder pour le voir.** Première image de la scène :
le Soleil n'était pas mal placé, il était **absent**. La baie regarde l'astre
pendant tout le vol — c'est ce qui rend le recul visible — donc on arrivait
**dos à sa destination**. Vingt-sept mille années-lumière pour arriver le nez
contre une cloison. Aucun outil ne pouvait le dire : le module rendait les bons
nombres. Le vaisseau se retourne maintenant en trois secondes, par la **même**
rotation que la dérive de la baie. Règle 1 : `VERIF.sceneSolaire()`.

**Et je me suis fait avoir deux fois par mes propres mesures.**

1. `distanceParlante` rendait `NaN` dès qu'on lui demandait trois noms : sa borne
   basse était à une unité astronomique, c'est-à-dire **dedans**, là où la
   monotonie sur laquelle repose sa bissection n'existe pas.
2. Le contrôle de la page comptait **tous** les pixels peints. Le voile de la
   scène couvre toute la baie à n'importe quelle distance : « bien moins qu'en
   bas » passait au vert à vingt-deux pixels près, en ne mesurant rien. On compte
   les pixels **clairs** — 972 en bas, 75 dans le nuage, 0 quand on regarde
   ailleurs.

**Et une fausse piste, notée pour ne pas y revenir.** J'ai pris pour un artefact
du nuanceur un disque noir cerclé d'orange qui restait dans la baie après le
demi-tour, et j'ai modifié le lanceur de géodésiques pour le corriger. C'était
**Lumen**, le drone, en silhouette devant la vitre. Le nuanceur a été remis
intact : une correction fondée sur un mauvais diagnostic est pire que rien.

**Et le rythme tranché le même jour change ce qu'on voit.** La chute lit le même
réglage que le grand trajet — une seule loi — donc « fidèle » y produit treize
secondes où rien n'arrive, puis trois où tout arrive. C'est exact, et c'est
exactement ce que la question posée à Hugo doit départager.

**Compte : 45 outils, 3 neufs (19 + 38 contrôles), et 8 contrôles de plus dans la
page.** Plafond de taille monté de 3 865 à 3 954, justifié par écrit. Une
question dans `?juge`, et c'est celle qu'aucun calcul ne tranche : est-ce que
« il n'y a rien à voir » se lit comme une intention, ou comme une panne ?

---

## 11 août 2026 — le bouton du rythme, quatre jours après la demande

**Le site annonçait un réglage qui n'existait pas.** `contenu.js` avoue depuis le
9 août que « le défilement du voyage a deux rythmes ». Les deux étaient bien
écrits dans `recul.js` — la demande d'Hugo du 7 au soir, « fais les deux,
paramétrable dans les options » — mais `poseRythme` n'était appelé que par la
séance de jugement et par les outils. Aucun bouton, nulle part. Un aveu qui
décrit un bouton absent est pire qu'un aveu absent : il apprend à ne plus les
lire, et c'est nous-mêmes qui l'avions écrit deux jours plus tôt.

**Conséquence, et elle est plus grave que le bouton manquant** : ce qu'Hugo a
jugé « ça va » le 9 août au soir — le rythme régulier — n'a jamais été ce que le
site jouait. `juge.js` remet le défaut en sortant de séance, exprès. Son verdict
portait donc sur un rythme que personne ne voyait en jouant.

**Refait la mesure avant de coder**, sur le vrai trajet vers le système solaire
(9,10 décades, 33,7 s d'écran) : le fidèle franchit **3,93 décades dans la
première seconde**, finit sur douze secondes où l'écran ne bouge plus, et son
freinage commence à 50 % ; le régulier part de 0,00 et freine à 79,8 %.

**Le sélecteur est dans les réglages**, à côté du rendu et sur son patron :
fabrique unique et liste de repeints, même s'il n'est posé qu'à un seul endroit
aujourd'hui — la langue puis le rendu ont payé deux fois le prix des deux
fabriques. Le choix se range sous sa propre clé, `periastre.rythme`, écrite au
clic et jamais ailleurs : `CHAMPS` ne range pas de chaînes, et la panne du 7 août
venait d'une mémoire réécrite trop souvent.

**Trouvé en posant le bouton** : `rangeGrandTrajet` remettait « fidele » en dur à
la sortie de séance. C'était juste tant que rien n'était réglable ; ça effaçait
désormais le choix du joueur, c'est-à-dire exactement ce que cette précaution
voulait empêcher. La séance retient ce qu'elle trouve et le repose.

**Le contrôle qui manquait, et c'est le vrai livrable** — `outil-verif-aveu.js`,
groupe 8 : un aveu posé dans un panneau de réglage doit **nommer** son hôte
(`regle:`), cet hôte doit exister dans le balisage, **et** la page doit le
remplir. Un `<div>` vide sous une étiquette est encore un réglage qui n'existe
pas. Sa vérité vient de deux fichiers qui ne se connaissent pas — `contenu.js`
dit ce qu'il avoue, `index.html` dit ce qui existe. Éprouvé faillible trois fois
sur le vrai dépôt (hôte renommé, sélecteur retiré, `regle` effacé) et trois fois
sur des pages fabriquées, plus un point qui vérifie qu'une page saine passe :
sans lui, un contrôle qui rougit sur tout ne mesurerait rien non plus.

Vingt-deux contrôles de plus dans `outil-verif-recul.js`. Le meilleur ne croit
pas la liste des rythmes sur parole : il joue le vrai trajet et exige que deux
noms donnent deux défilements **différents**, et qu'un nom inconnu joue
exactement le défaut. Un bouton qui ne ferait rien est l'inverse du défaut
d'aujourd'hui, et tout aussi menteur.

**Le plafond de `index.html` monte de 3 865 à 3 902** — trente-sept lignes de
DOM, écrites et justifiées dans `outil-verif-taille.js`. Pas fondu la fabrique du
rythme avec celle du rendu : ce serait la bonne économie à la troisième, et pour
deux ça aurait touché un réglage qui marche pour en poser un qui n'existait pas.

**LE DÉFAUT N'EST PAS TRANCHÉ, ET C'EST À HUGO.** Il reste `fidele`, avec un
contrôle qui le garde pour qu'il ne bascule pas par accident. Ma recommandation
est *régulier* — c'est celui qu'il a jugé « ça va », et *fidèle* fige l'écran une
douzaine de secondes sur ce trajet. Mais c'est une décision d'image, elle lui
appartient, et son verdict du 9 août portait sur un rythme que le site ne jouait
pas : il vaut un avis, pas une décision. **Question posée, réponse attendue.**

---

## 10 août 2026, le soir — le système solaire est enfin sourcé

Session lancée **exprès sur un réseau ouvert** : la précédente n'atteignait ni le
JPL, ni arXiv, ni ADS, ni A&A, et elle a eu raison de ne rien écrire plutôt que
d'écrire de mémoire. Une seule mission : aller relever.

**Cinq sources relevées, chaque page ouverte.** `SOURCES-SOLAIRE.md` garde
l'adresse et la ligne de chaque chiffre — de quoi recommencer sans refaire la
recherche. Les demi-grands axes (table 1 du JPL) ; l'unité astronomique, dont
j'ai lu la résolution UAI 2012 B2 dans le document primaire ; les valeurs
nominales et le point zéro bolométrique de Prša et al. 2016 ; les masses de
DE440 ; et le nuage de Oort par la revue exacte que le chantier réclamait, Dones,
Weissman, Levison & Duncan, trouvée libre chez ASP après le refus du LPI et de
Springer.

**Trois choses trouvées en relevant, qu'on ne cherchait pas :**

1. **Le JPL se trompe de résolution.** Sa page *Astrodynamic Parameters* attribue
   l'unité astronomique à « IAU 2012 Resolution B1 ». C'est B2 — le document
   primaire et la brochure du BIPM s'accordent contre lui.
2. **L'UA a quatre écrivains, pas cinq.** `CHANTIER-P.md` nommait
   `index.html:3877` : cette ligne déclare le parsec.
3. **La table du JPL pose ses propres réserves**, et personne ne les répétait :
   ce ne sont pas des moyennes mais un ajustement valable 1800-2050, et la ligne
   « Terre » est le barycentre Terre-Lune. La fiche les porte maintenant.

**La fiche `f-solaire`**, trois niveaux dans les deux langues, sépare ce qui est
publié de ce qui est dérivé ici — comme `f-ciel`. Planchers relevés : 47 sources
avec lien, 246 textes sourcés.

**`outil-verif-solaire.js`, 49 contrôles, et sa vérité vient d'ailleurs.** Il ne
porte pas les demi-grands axes : il les **reconstruit** par Kepler depuis la
colonne voisine des taux de longitude moyenne et les masses de DE440. Il retombe
à 20 ppm de Mercure à Saturne, 400 ppm sur Neptune — et il **avoue par un
contrôle** ce qu'il ne peut pas voir, le huitième chiffre. Il ferme aussi une
boucle que personne ne fermait : ce que la fiche affirme et ce que le code
calcule sont désormais le même nombre. Quatre sabotages joués sur les vrais
fichiers : tous rougissent.

**Et une découverte qui change le décor à venir, écrite dans `A-REGARDER.md`.**
Je croyais pouvoir dire à Hugo « depuis le nuage de Oort les planètes sont dans
le même pixel, donc pas d'étiquettes ». C'est vrai — mais la bascule est
brutale : à 20 000 ua, Jupiter est à 0,3 pixel du Soleil ; à 1 000 ua, Neptune
est à 36 pixels et il y a une vraie scène. La question « d'où plante-t-on la
caméra » lui revient, avec trois options et ma recommandation.

**41 outils, aucun échec.**

---

## 10 août 2026 — le plan du système solaire, et sa première marche

Hugo : « fais-moi un plan à partir de ce cap », avec un élément à lui —
« j'aimerais bien qu'on puisse voir le système solaire bientôt ». Il a tranché
**d'abord la vue de loin, puis la Terre**, et **regarder devant/derrière dans le
même lot**.

**Trois défauts sont sortis en écrivant le plan**, aucun n'était cherché.

1. **Le voyage ne savait pas où il arrivait.** `d.id` existait depuis le premier
   jour de la table des destinations et n'était lu nulle part. On partait
   vingt-sept mille années-lumière pour le système solaire et l'on arrivait
   devant les dix orbites du centre galactique — **à la même taille apparente**
   qu'à l'arrivée aux étoiles S, puisque `ETOILES_S.cadre` pose
   `échelle = arrivée / distance` et atteint donc la taille un à toute arrivée.
   Sept millions de fois trop grandes. Et le pied du panneau écrivait « le trou
   noir est là, au centre » à qui venait de s'en éloigner.
2. **Le rythme qu'il a jugé n'est pas celui que le site joue.** `poseRythme`
   n'est appelé que par la séance et les outils : le bouton demandé le 7 août n'a
   jamais été posé, et le jeu tourne sur le défaut `fidele`. Mesuré sur le vrai
   trajet de 33,7 s — **3,93 décades sur 9,10 dans la première seconde**, puis
   onze secondes d'écran figé. Et `contenu.js` avoue déjà ce réglage : le site
   annonce un bouton qui n'existe pas.
3. **On lui ramène la tête vers le trou noir pendant tout le vol.** `recentre`
   tire la visée vers l'astre à chaque image, sans condition. Sa demande du
   9 août n'est pas d'abord une affaire de vitres.

**Étape 1 faite : le voyage sait où il arrive.** La décision est une **donnée**
portée par la destination (`carte:`) et non un test dans le rendu — c'est ce qui
permet de la vérifier sans lire une ligne de dessin. Un pied de panneau par
destination, dans les deux langues. Le lieu d'aveu `arrivee` s'est dédoublé, pour
que l'aveu de la carte des étoiles ne se pose plus là où cette carte ne se montre
pas. `poseArrivee` reçoit enfin la destination, au lieu d'un calcul qu'il
n'ouvrait jamais sous deux formes d'argument différentes.

Deux contrôles, et **les deux savent échouer** : `outil-verif-arrivee.js`
(9 contrôles, cinq sabotages dont celui de sa propre découpe) et
`VERIF.arriveeJuste()` dans la page. Le second est différentiel et joue la **même
mesure sur deux destinations** — 59 008 pixels ajoutés aux étoiles S, −28 au
système solaire. Éprouvé en remettant le défaut dans un navigateur : le système
solaire passe à 57 998 et il rougit.

Le plafond de taille monte de 3 821 à 3 865, et **c'est la première fois qu'il
monte pour réparer une chose fausse** plutôt que pour en ajouter une.

## 10 août 2026 — la remise à plat du cap

Hugo a perdu le fil des conversations et a demandé le contexte complet. Deux
journées de travail — le 8 et le 9 — n'étaient écrites nulle part sauf dans les
messages de commit : c'est exactement le cas que la règle prévoit. Journal
rattrapé ci-dessous, `cap.html` remis d'aplomb.

État relevé ce jour-là : **38 outils, 1 654 contrôles hors navigateur, aucun
échec**. 117 contrôles dans la page. La file de `?juge` est vide.

---

## 9 août 2026

Grosse journée. Elle a fermé P2 et ouvert P3.

- **Le ciel de là-bas, sourcé** — huit références vérifiées, fiche à trois
  niveaux, deux langues. La réponse déborde la question : **il n'y fait jamais
  nuit** (le fond intégré pèse des centaines de pleines lunes), la vraie
  nébulosité a une forme (trois bras ionisés, un anneau opaque), et la poussière
  qui nous cache le centre est de notre côté. Notre fond noir est donc faux en
  soi, pas seulement mal peuplé. C'est la case 2.7, et elle appartient à Hugo.
- **L'aveu dénonçait une nébuleuse que la bascule venait d'éteindre.** Défaut de
  ma main, en ligne depuis la veille. Un aveu peut désormais porter `selonMode` :
  en cinéma il dit ce que le mode ajoute, en simulation ce qui reste faux une
  fois la nébuleuse éteinte. *Un aveu faux est pire qu'un aveu absent — il apprend
  à ne plus les lire.*
- **Le choix du rendu se pose au premier passage**, à côté de la langue, une
  seule fabrique pour les deux sélecteurs.
- **P2 est close sauf 2.7.** Deux séances, sept questions, sept verdicts.
- **P3 s'ouvre.** Le quadrillage sait dire les années-lumière, dans les deux
  langues — il écrivait « une case = 1 000 UA » en dur, en français, pendant tout
  le trajet d'un lecteur anglais. Table `DESTINATIONS` morte supprimée : deux
  vérités pour une chose, dont une fausse et invisible.
- **On part pour le système solaire.** La destination était refusée avec son prix
  pour toute réponse ; la leçon était dans le chiffre, pas dans le refus. Le prix
  reste sur la carte, sur sa propre ligne. La durée d'écran suit la longueur du
  trajet.
- **Deux formats trouvés en chemin** : « 26998 ans » sans espace de milliers — le
  chiffre le plus frappant du site — et « c − 4.1·10^-4 » avec un point décimal
  anglais en français.
- **La page ne savait pas qu'elle était vieille.** L'estampille protège les
  scripts, pas `index.html`, servi avec dix minutes de cache. Un visiteur déjà
  venu recevait l'ancien site en croyant avoir rechargé, sans aucun geste pour
  s'en sortir sur téléphone. `frais.js` : 22 contrôles, dont la moitié sur les cas
  où il ne doit **rien** faire — ici le faux positif est le danger.
- **L'aberration relativiste** — demandée le matin. Direction, couleur, éclat en
  D⁴, 19 contrôles dont la réciprocité des deux sens, celle qui attrape l'erreur
  de signe. Pas branchée au nuanceur : ce qui reste est de l'image, pas du calcul.
- **La séance ne ramenait pas le vaisseau à son orbite** — signalé par Hugo. On
  repartait du système solaire pour le système solaire : trajet nul, écran figé.
  Le défaut dormait depuis toujours ; c'est le fait de **rejouer** qui l'a
  réveillé.
- **Le voyage jugé « ça va »**, et sa remarque vaut plus que le verdict : il ne
  sentait pas la moitié d'accélération et la moitié de freinage. Il a raison, et
  c'est le **temps d'écran** qui ment — 28 secondes à accélérer, 6 à freiner. Le
  remède demande quelque chose vers quoi s'approcher : le système solaire vu de
  loin. Les deux ne font qu'un chantier, et c'est le suivant.

## 8 août 2026

- **La rotation devient un curseur**, comme demandé — le continuum était le sujet,
  quatre boutons n'en donnaient que quatre points. La borne 0,998 est un fait
  (limite de Thorne, 1974), pas un arrondi de confort. On n'enregistre qu'au
  relâchement : la leçon du 7 août, où une écriture en mémoire avait divisé par
  huit la cadence de son téléphone.
- **Cinq verdicts rayés** de la séance du soir.
- **La descente au périastre commence.** Les fondations étaient l'apoastre — loin,
  lent, à consolider ; maintenant le passage au plus près. Cinq chantiers, et le
  hook lit la liste.
- **P1 — le carnet du voyageur.** Les deux horloges du salon étaient calculées,
  montrées, puis jetées à la sortie. Elles s'inscrivent : *« Depuis ta première
  mission, tu as vécu 57 min — la Terre a vécu 1,0 h. »* Un vrai passage
  s'inscrit, un coup d'œil non.
- **P2 s'ouvre : la nébuleuse passe sous commande** — simulation ou cinéma. Le
  défaut reste « cinéma » : changer l'image sous les pieds de qui n'a rien demandé
  serait traiter le visiteur comme un argument.
- **Un angle mort dans l'outil de l'ordre, et il a mordu.** Une fonction déclarée
  est hissée : appelée depuis le sommet, tout ce que son corps lit devient mortel,
  et l'outil comptait ça comme inoffensif. Réparé le lendemain — il suit
  maintenant les appels, et il a trouvé du premier coup que **le lien de test de
  la touche C ne restaurait rien**.

---

## 7 août 2026

- **Le contrôle de la couture mesurait les étoiles.** Il a échoué à spin 0,9 en
  rendant 36. Un seul pixel, sur une seule rangée, bleuté : une étoile du fond,
  pas une couture. Corrigé par une médiane sur cinq azimuts — ce qui est collé à
  la scène survit, ce qui est collé au ciel disparaît.
- **Et la caméra n'obéissait pas aux contrôles.** On demandait azimut 0,54, elle
  se plaçait à 1,05 : l'ouverture cinématique la réécrit pendant neuf secondes.
  Tout contrôle lancé sur une page fraîche mesurait un travelling. Coupé dans
  `fige()`, donc pour tous les contrôles qui lisent des pixels, pas seulement
  celui qui l'a révélé. **Cinquième règle dure** ajoutée à `CLAUDE.md`.
- **Troisième question de jugement** ajoutée : l'image après la réécriture du
  moteur, les quatre rotations sur la même vue.
- **La publication réparée pour de bon.** Le dépôt était en état mixte — réglage
  Jekyll hérité, action moderne — et les trois signaux d'état mentaient. Une
  action écrite (`.github/workflows/pages.yml`) remplace tout ça : la publication
  passe désormais en une minute au lieu de rater bruyamment pendant dix.
  Au passage, j'ai basculé le réglage avant d'avoir écrit l'action : plus rien ne
  pouvait être publié entre les deux. Sans coupure du site, mais c'était une
  faute.
- **`outil-verif-publication.js` réécrit** : un seul fait tranche, ce que le
  serveur envoie cache interdit. Les relevés d'API restent affichés mais ne
  peuvent plus faire échouer quoi que ce soit.
- **Idée d'Hugo au carnet** : le cours attaché à l'expérience — touche H,
  trois niveaux, sourcé, et des curseurs pour essayer soi-même. Pas en chantier.
- **`cap.html` créé** — la feuille de route pour Hugo, non liée et non indexée.

État en milieu de journée : 81 contrôles dans la page, 12 outils hors
navigateur, tout au vert.

### Le soir — la séance de jugement, et ce qu'elle a ouvert

- **Deux questions closes.** La rotation du trou noir d'étude : « ça va », après
  quatre tentatives dont trois gâchées par mes propres fautes. L'image après la
  réécriture du moteur : « rien n'a bougé, tout a l'air conforme ».
- **Ma question sur l'image était mal écrite.** Ses quatre variantes étaient des
  points de vue d'inspection, pas des choix ; la séance a donc produit « garde
  celle-ci, enlève les autres », ce qui appliqué à la lettre aurait supprimé les
  rotations du site. Une question d'inspection ne doit pas emprunter la forme
  d'une question de choix.
- **La carte des orbites tournait toute seule** — `vue.azim += dt*0.05`, ajouté
  par moi. Elle fabriquait un déplacement du vaisseau qui n'existe pas. Retiré,
  gardé par `VERIF.carteFixe()`.
- **Trois défauts de mes propres contrôles sont sortis en chemin** : un contrôle
  qui n'exerçait rien, une bande de mesure en pixels durs qui rendait `couture()`
  dépendante de la taille de la fenêtre — et qui aurait menti précisément sur un
  téléphone — et un témoin posé sur le bord de l'ombre, qui n'est pas une
  colonne mais une rampe.
- **`VOYAGE.etat(d, τ)`** — la position, les deux horloges, β, γ et la phase à
  chaque instant du vol. 54 contrôles dans `outil-verif-voyage.js`, qui a trouvé
  au passage une annulation catastrophique vieille de plusieurs semaines dans
  `trajet()` et `enChemin()`.
- **Le cliquet de taille descend** de 4 310 à 4 298 lignes.

### Le voyage refait, dans la foulée

- **La carte passe dehors.** Découpée aux trois vitres, projetées avec la caméra
  de la pièce. Mesuré par différence : elle ajoute 2 544 pixels dans la baie et
  zéro dehors.
- **Sa taille suit la distance** — 6 au départ, 1 à l'arrivée, interpolé en
  logarithme. Pas une perspective, et c'est déclaré.
- **Les traces se voient dès le départ**, le voile reste à l'arrivée.
- **Le « pop » avait une cause** : le recul s'arrête avant que le voile ne monte,
  et les traces retombaient à zéro dans l'intervalle. Chute maximale entre deux
  images après correction : **zéro**.
- **Le bandeau de vol** — vitesse en fraction de c, dilatation, distance
  parcourue, phase. Les chiffres viennent de la **position**, pas du temps
  d'écran.
- **J'ai fait fausse route d'abord** en faisant suivre à la position le vrai
  profil relativiste : fidèle, et mauvais — 2,7 décades dans la première moitié
  de l'animation, 0,3 dans la seconde. `outil-verif-recul.js` l'a refusé.
- **Le plafond de taille monte deux fois**, 4 298 → 4 343. Première hausse
  depuis sa création, justifiée par écrit. La marge est consommée.

**90 contrôles dans la page, 13 outils.** Séance de jugement remplie : trois
questions sur le voyage refait.

État à la fin de la journée : 86 contrôles dans la page, 13 outils hors
navigateur, tout au vert. Séance de jugement vide — rien à faire juger tant que
le voyage n'est pas refait.

---

## 11 août 2026 — Le rivage

Hugo, deux fois de suite : « tu m'en parles, tu m'en parles, mais toujours pas
vu ». Il avait raison, et la cause était bête : je lui avais posé une question
deux fois sans jamais insister, et j'avais attendu.

### Ce qui était déjà là et que personne ne lui avait montré

`lune.html` existait, éprouvée, publiée — **et liée depuis nulle part**. Il l'a
trouvée « vraiment super », puis a tranché net : *« c'est une page
d'explication, ce n'est pas une page de jeu. Je veux que le joueur il soit dans
un monde interactif. Il peut cliquer, voilà, je mets la Lune. Il voit comment
c'est la Lune. EN TANT QUE JOUEUR SUR TERRE. »*

Et son cadrage, une minute après, meilleur que le mien : le sujet est **la
taille, ressentie par substitution** — « ah ouais, c'était à la place de la
Lune, aussi gros que ça ».

### Ce qu'il a tranché, à l'outil à boutons

Deux questions posées, deux réponses immédiates. La règle 4 fonctionne quand on
s'en sert.

- **Dehors, sur Terre, la nuit**, première personne, un cadran à hauteur de main.
- **Le ciel fixe, la mer vivante** — il a pris « 1 et 3 ».
- Puis, devant le premier jet : **la Lune reste dans le cadre, à la même
  échelle**, parce qu'un étalon invisible ne mesure rien.

Il a aussi demandé, de lui-même : *« tu fais une skybox ou tu intègres l'élément
dans la skybox ? »* La bonne question. Le fond en est une ; **l'astre n'en est
pas une**, sinon sa taille serait figée dans une image — et la taille est le
seul sujet de la scène.

### Ce qui a été bâti

- **`rivage.js`** — la physique, sans DOM ni WebGL. Aucun chiffre d'astre n'y est
  saisi : tout dérive de `LUNE.ASTRES`. Marée d'équilibre, rythme par Kepler sur
  le couple, limite de Roche, verdict rivage/englouti/brisée.
- **`outil-verif-rivage.js`** — 35 affirmations. Sa vérité vient d'ailleurs : il
  ignore le développement du module et **recalcule la marée par la loi de Newton
  nue**. Plus trois ancres hors dépôt : 54 cm, 46 %, 12 h 25.
- **`rivage.html`** — ciel et sol calculés par direction de regard, pixel par
  pixel, donc taille angulaire exacte.

### Trois fois que je me suis fait prendre, dans ma propre session

1. **L'outil exigeait 0,1 mm** d'accord là où le terme d'ordre 3 en impose 6. La
   tolérance se dérive maintenant, elle ne se choisit plus.
2. **« Mars = 2,06 Lunes », écrit de mémoire.** Le vrai rapport des rayons
   sourcés est 1,95. La règle 7 s'est refermée sur l'outil censé la faire
   respecter. Les attendus se dérivent des rayons.
3. **Un accent grave dans un commentaire du nuanceur** a fermé le texte qui le
   portait. La page ne construisait plus rien. `node tout.js` ne lit pas les
   pages : l'outil extrait maintenant le script et le fait analyser, avec sa
   contre-épreuve.

### Où ça en est

Publié. **46 outils, aucun échec.** Hugo va regarder avant de juger — c'est son
choix, et c'est le bon ordre.

**Ce que je sais déjà de travers, et que je lui ai dit avant qu'il l'ouvre :**
la marée ne se voit pas (54 cm sans repère dans l'eau — il manque un piquet
gradué) ; le rivage n'est pas un lieu de `lieux.js`, on y arrive par un lien ;
le cadran est un menu posé par-dessus, pas un objet du monde.

**Et le déséquilibre du projet bouge dans le bon sens** : pour une fois, du jeu
neuf. La règle qui a débloqué la journée n'est pas technique — c'est *« ce genre
de questions, tu peux me les poser »*, du 7 août, que je n'appliquais pas.

---

## 11 août 2026 — l'arrivée montre enfin la Terre et la Lune

> « J'aimerais bien qu'on voie enfin cette Terre et cette Lune, parce que tu m'en
> parles, tu m'en parles, mais toujours pas vu. » — Hugo, et il avait raison :
> on lui promettait cette arrivée depuis deux jours et la baie était vide.

Il a tranché la contradiction qui bloquait — `lune.js` était dit « branché » dans
`CHANTIER-P.md` et « écarté, pas sourçable » dans `tout.js`. **On le branche.**

### Ce qui existe maintenant

- **`terrelune.js`** — la chute vers le couple Terre–Lune, à l'arrivée du voyage.
  Elle part de la distance où le disque de la Terre atteint **un demi-pixel**
  (le seuil de `lune.js` : sous lui on ne dessine rien, et le prendre comme
  départ fait commencer la scène à l'instant où la Terre a le droit d'exister) et
  finit quand elle occupe la moitié de la baie. Entre les deux, taux relatif
  constant — la loi de `recul.js`, pas une quatrième.
- **Aucun chiffre d'astre dans le fichier**, et un contrôle relit son source pour
  l'exiger. Rayons, masses et demi-grand axe lunaire viennent de `lune.js`.
- Les pixels viennent de la **focale du site**, pas d'un réglage : `projette`
  pose px = tan(α)·F·H/2, et c'est cette échelle-là qui est employée.
- Le **terminateur est calculé**, et les deux astres reçoivent la même lumière —
  ce qui est physique : à 384 400 km l'un de l'autre et à 1 ua du Soleil, leurs
  directions d'éclairement diffèrent de 0,147°.

### Ce que la scène est venue dire, et que j'ai failli rater deux fois

La Terre et la Lune sont séparées de **trente diamètres terrestres**. Au dernier
instant où la Lune tient dans la baie, la Terre ne fait que **dix-huit pixels**.
Aucune image ne peut montrer les deux astres gros à la fois. La chute traverse
donc ce moment au lieu de s'y arrêter : on voit les deux et le gouffre, puis la
Lune sort par le côté et la Terre grandit jusqu'à remplir la vitre.

### Trois défauts trouvés EN REGARDANT, et un aveu

Aucun des trois n'était un nombre faux. Ils se sont vus en jouant la scène dans
un navigateur, et chacun a laissé un contrôle derrière lui.

1. **La scène était dans le dos du joueur.** Je l'avais posée à l'opposé du trou
   noir — l'avant du voyage — et `projette` rendait `null`. La baie ne regarde
   que dans un sens, et c'est ce sens qui commande.
2. **Le voile du ciel tombait d'un coup.** Après trente-quatre secondes de
   nébuleuse, l'arrivée se lisait comme un écran qui s'éteint. Il monte en 1,2 s.
3. **L'azimut de la Lune — et là c'est le contrôle qui m'a corrigé.** J'avais cru
   la voir sortir par le haut, j'ai couché l'azimut à plat « pour employer la
   largeur ». Le contrôle a chiffré les deux : à plat elle sort à 766 000 km, en
   diagonale à 720 000. La diagonale est le point le plus éloigné du centre dans
   une baie large et basse, et c'est démontrable — min(L/|cos a|, H/|sin a|) est
   maximal quand tan a = H/L. La règle 3 marche dans les deux sens.

**Et l'aveu, qui est le vrai apport de la journée** : *le vaisseau ne se déplace
jamais.* Le recul est un diagramme ; le salon reste à seize rayons de
Sagittarius A*. À l'arrivée, la baie peignait donc encore le trou noir qu'on
venait de quitter, pendant que le panneau écrivait qu'il était « à vingt-sept
mille années-lumière derrière vous ». L'image contredisait le texte, depuis le
jour où cette destination a été ouverte. On voile ce ciel pour montrer la Terre,
et **on le déclare** — douzième compromis, sous `arrivee-soleil`.

### Le contrat

- **Fiche « La Terre et la Lune, de loin »**, trois niveaux dans les deux langues.
- **Quatre sources montent** du registre parallèle de `lune.js` au contrat :
  `jplPlanetes`, `jplSatellites`, `jplElements`, `codata2018`. `SOURCES-SOLAIRE.md`
  avait écrit le 10 août qu'elles monteraient « avec la fiche qui les emploiera —
  `lune.js` branché ». Les trois pages du JPL ont été **rouvertes** et les quatre
  nombres relus à leur ligne plutôt que recopiés du module.
- Planchers relevés : 51 sources avec lien (de 47), 254 textes sourcés (de 246),
  12 compromis déclarés (de 11).
- `UA_KM` porte enfin sa clé de source dans `lune.js`.
- La ligne `lune.js` de `POURQUOI_PAS_BRANCHE` **disparaît**. Elle y était depuis
  cinq jours.

### Ce qui reste ouvert, et qui lui appartient

La question est dans `?juge` : **le moment où l'on voit les deux est-il trop
maigre ?** On peut décaler le cadrage pour doubler la Terre à cet instant, au
prix d'un cadrage choisi et non subi. C'est une hésitation entre le fidèle et le
lisible, et sa règle du 7 août dit de ne pas la trancher seul.

**76 contrôles dans `outil-verif-terrelune.js`**, six sabotages. `node tout.js` :
44 outils, aucun échec.

---

## 11 août 2026 — les planètes deviennent des photographies

**Ce qui change pour Hugo :** Jupiter, Mars, la Terre, la Lune, Saturne et
Neptune ne sont plus dessinés. Ce sont des photographies, prises par des engins
qui sont allés les voir. La « merde orange » a disparu.

La session précédente avait câblé tout le chemin — projection, chargement
paresseux, repli sur le dessin, la serrure des sources — et n'avait pas pu
poser un seul fichier : elle n'avait aucun accès au dehors. Il ne restait donc
qu'à aller les chercher. Six cartes en 2048×1024, sous 400 Ko chacune, 1,3 Mo
en tout.

### Ce qui a été payé, et qu'il ne faut pas repayer

- **Quatre sur six seulement sont des observations pleines.** Jupiter est une
  mosaïque Cassini, Mars une mosaïque Viking, la Terre un composite MODIS, la
  Lune une mosaïque LRO. Mais **aucune agence ne publie de carte globale de
  Saturne ni de Neptune** — ni Voyager ni Cassini n'en ont couvert la surface
  entière. Les seules cartes libres pour ces deux-là sont des textures dérivées
  d'imagerie NASA, aux couleurs retouchées. C'est écrit dans leur `source`.
- **Les cartes de Björn Jónsson ont été refusées**, alors qu'elles sont les
  meilleures qui existent pour ces deux planètes. Sa page de conditions — lue,
  pas devinée — autorise leur usage mais demande expressément qu'on n'en héberge
  pas de copie. Un site statique ne peut pas faire autrement. C'est exactement
  le genre de chose qu'on ne découvre qu'en allant lire.
- **Le crédit devait aller jusqu'à l'écran.** Deux de ces licences sont des
  Creative Commons Attribution : le droit de servir l'image est *conditionnel*,
  et la condition est de citer l'auteur. Une citation enfouie dans un fichier de
  code n'en est pas une. La scène porte donc la provenance de la carte affichée,
  en haut à droite — et elle avoue « astre dessiné » quand il n'y en a pas.
  Défaut juridique, invisible sur tout écran, attrapable par un seul contrôle.

### Ce que l'outil sait faire de plus (règle 1)

Il **ouvre les fichiers** maintenant. Il lit l'en-tête JPEG et mesure : les deux
côtés sont-ils des puissances de deux — une mire de 360×180 avait rendu un
disque *entièrement noir*, sans message ni erreur —, le rapport est-il de deux
pour un, le poids tient-il. Sa vérité ne vient plus du registre mais des octets,
et il se prouve faillible sur un en-tête fabriqué de la taille exacte qui avait
noirci le disque. De 57 à 127 affirmations.

### Ce qui reste ouvert

Inchangé : le rivage n'est toujours pas un lieu de `lieux.js`, et le cadran
reste un menu posé par-dessus la scène plutôt qu'un objet du monde.
