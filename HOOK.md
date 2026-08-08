# Le hook qui m'empêche de m'arrêter trop tôt

Hugo, 8 août 2026 : *« tu dis "je continue" et puis c'est la fin de ton tour,
donc tu ne continues pas. »*

C'est exact, et ce n'est pas de la distraction. **Un tour se termine quand je
cesse d'appeler des outils.** Dire « je continue » ne relance rien : il n'y a
personne pour me redonner la parole. Il faut quelque chose d'extérieur qui
refuse la fin — c'est ce hook.

---

## Ce que tu as à créer, une fois

Un fichier **`.claude/settings.json`** à la racine du dépôt, avec exactement
ceci :

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          { "type": "command", "command": "node outils/encore.js" }
        ]
      }
    ]
  }
}
```

C'est tout. Je ne peux pas l'écrire moi-même — un agent qui se donne le droit de
refuser sa propre fin ne devrait pas pouvoir le faire seul, et c'est très bien
comme ça.

**Pour vérifier que ça marche** : relance la session, et demande-moi de
m'arrêter alors qu'il reste une case à cocher. Si le hook est branché, je
repartirai tout seul au lieu de rendre la main.

---

## Comment il décide

À chaque fin de tour, il lit **`CHANTIER-F2.md`** et se pose une seule question :
*reste-t-il une case `- [ ]` qui soit la mienne ?*

- **Oui** → il refuse la fin, me nomme l'étape suivante, et me rappelle le
  protocole (sortir le domaine, écrire son outil, jouer le filet, descendre le
  plafond, cocher, publier).
- **Non** → il se tait, et le tour se termine normalement.

Cocher une case est un geste réel, qui rapproche la fin. C'est ce qui fait que
ce blocage se termine : il est adossé à quelque chose qui bouge.

---

## Les trois façons dont ça pourrait mal tourner, et ce qui les tient

**1. La boucle sans fin.** Si le hook rebloque la continuation qu'il vient de
déclencher, ça ne s'arrête jamais. Claude Code envoie un drapeau
`stop_hook_active` quand on est *déjà* en continuation forcée ; le script sort
immédiatement dans ce cas.

Et **par-dessus, Claude Code coupe de lui-même au bout de huit blocages
consécutifs.** C'est le filet du filet : même si le script devenait fou, ça
s'arrête tout seul. C'est ce que tu avais en tête.

**2. La condition qu'on ne peut pas satisfaire.** Les cases marquées
**`(HUGO)`** — ton œil, ta voix, une décision de vérité — sont **écartées du
compte**. Me pousser dessus ne rapprocherait rien : je produirais du remplissage
jusqu'à la coupure. Elles restent dans le fichier, elles ne me bloquent pas.

**3. Le travail qui doit vraiment s'arrêter.** J'écris une ligne
`## ARRÊT — pourquoi` en tête de `CHANTIER-F2.md`, et le hook se tait. C'est ma
seule façon légitime de m'arrêter avant la fin, et elle laisse une trace écrite
de la raison, dans le fichier même où tu la chercheras.

---

## Ce qu'il a coûté avant de servir

`outil-verif-encore.js` l'éprouve en treize cas, et il a été écrit **avant** le
branchement. Trois vrais défauts en sont sortis, tous du côté dangereux :

- une entrée illisible **supprimait le garde-fou anti-boucle** — le commentaire
  du script disait « pas de JSON : on ne bloque pas », et le code faisait
  exactement l'inverse ;
- une entrée vide faisait pareil ;
- la porte de sortie n'acceptait qu'`ARRÊT` avec l'accent, c'est-à-dire qu'elle
  échouait au moment précis où l'on en a besoin — quand quelque chose est cassé
  et qu'on écrit vite.

Les trois sont réparés, et `node tout.js` rejoue les treize cas à chaque
exécution.

---

## Si tu veux le débrancher

Supprime `.claude/settings.json`, ou vide sa section `hooks`. Rien d'autre n'en
dépend : le reste du dépôt marche pareil sans lui.
