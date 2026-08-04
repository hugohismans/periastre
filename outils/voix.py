"""Génère les MP3 de Lumen avec les voix neuronales de Microsoft.

Les répliques étant scriptées, la synthèse se fait une fois ici et le site ne
sert que des fichiers : pas de clé d'API, pas de serveur, pas de coût, et la
même voix pour tout le monde quel que soit le système du visiteur.

    pip install edge-tts
    python outils/voix.py            # ne régénère que ce qui manque
    python outils/voix.py --tout     # tout refaire

Une connexion est nécessaire pour générer, pas pour consulter le site.
"""

import asyncio
import json
import pathlib
import subprocess
import sys

import edge_tts

RACINE = pathlib.Path(__file__).resolve().parent.parent
SORTIE = RACINE / "voix"
DEBIT = "+4%"          # les voix neuronales sont un peu lentes par défaut


def lire_lignes():
    r = subprocess.run(
        ["node", str(RACINE / "outils" / "lignes.mjs")],
        capture_output=True, text=True, encoding="utf-8-sig", check=True,
    )
    return json.loads(r.stdout)


async def main():
    tout = "--tout" in sys.argv
    d = lire_lignes()
    faits = sautes = 0

    print(f'{len(d["lignes"])} répliques × {len(d["voix"])} voix\n')

    for v in d["voix"]:
        dossier = SORTIE / v["id"]
        dossier.mkdir(parents=True, exist_ok=True)
        for ligne in d["lignes"]:
            cible = dossier / f'{ligne["id"]}.mp3'
            if cible.exists() and cible.stat().st_size > 0 and not tout:
                sautes += 1
                continue
            await edge_tts.Communicate(ligne["dire"], v["modele"], rate=DEBIT).save(str(cible))
            faits += 1
            print(f'  {v["id"]}/{cible.name}')

    poids = sum(f.stat().st_size for f in SORTIE.rglob("*.mp3")) / 1e6
    print(f"\n{faits} générés, {sautes} déjà présents — {poids:.1f} Mo au total")


asyncio.run(main())
