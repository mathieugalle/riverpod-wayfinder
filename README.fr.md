<div align="center">

# 🧭 Riverpod Wayfinder

**Va directement au provider Riverpod que tu as vraiment écrit — pas au fichier généré.**

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![100% Free & Open Source](https://img.shields.io/badge/100%25-free%20%26%20open%20source-blue)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.60.0-blue?logo=visualstudiocode)](https://code.visualstudio.com/)

[English](README.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [中文（简体）](README.zh-CN.md) · [中文（繁體）](README.zh-TW.md) · [Tiếng Việt](README.vi.md) · [فارسی](README.fa.md) · [Azərbaycan](README.az.md)

</div>

---

Une extension VSCode pour les projets Riverpod + `riverpod_generator`. Clique sur l'utilisation d'un provider — `viewFreshnessProvider`, `counterProvider`, peu importe — et va directement à la `class` ou la fonction que tu as réellement écrite, même dans des fichiers regroupant plusieurs providers.

## Pourquoi cette extension existe

Avec la génération de code, `fooProvider` n'est pas vraiment défini là où tu as écrit ton code `@riverpod` — il est défini dans le fichier généré `foo.g.dart`. La navigation native de VSCode t'y emmène naturellement, pas vers ta source. C'est une petite taxe permanente sur tout projet Riverpod : des dizaines de détours par jour, dans un fichier que tu n'es pas censé toucher.

Riverpod Wayfinder supprime ce détour. Il lit le fichier `.g.dart` à ta place, identifie précisément quel provider tu as cliqué (même quand le fichier en regroupe plusieurs), et t'emmène à la vraie déclaration.

## Fonctionnalités

- **`Ctrl+F12` / `Cmd+F12` (Go to Implementation)** — le geste principal. Saute directement à la source écrite à la main, à chaque fois, sans liste de choix.
- **`Ctrl+Click` / `Cmd+Click` (Go to Definition)** — propose aussi la source écrite à la main comme candidat, à côté de la réponse de l'extension Dart. Voir [Pourquoi une liste de choix ?](#pourquoi-ctrlclick--cmdclick-affiche-t-il-une-liste-au-lieu-de-sauter-directement) ci-dessous.
- **`Ctrl+Alt+D` / `Cmd+Alt+D`** — commande manuelle de secours, fonctionne depuis n'importe où dans le fichier.
- Gère correctement les fichiers avec **plusieurs providers**, mélangeant styles classe et fonction, dans n'importe quel ordre.
- Supporte `@riverpod class Foo extends _$Foo` et `@riverpod ReturnType foo(Ref ref)`.
- Aucune convention de nommage de fichier requise — la correspondance se fait par contenu, donc `foo.providers.dart` / `foo.providers.g.dart` comme `foo.dart` / `foo.g.dart` fonctionnent.
- Aucune convention de nommage de provider requise non plus — fonctionne que tes identifiants générés se terminent par `Provider`, `Controller`, ou autre chose selon la convention de ton équipe, partout où la génération `@riverpod` fonctionne elle-même.
- Journalisation de débogage optionnelle (`riverpod-wayfinder.enableLogging`) montrant chaque décision de résolution.

## Installation

Pas encore publiée sur un marketplace — récupère le `.vsix` depuis la page [Releases](../../releases) (ou construis-le toi-même, voir [Développement](#développement)) et installe-le manuellement :

1. Ouvre VSCode → vue Extensions → menu `···` → **Install from VSIX...**
2. Sélectionne le fichier `riverpod-wayfinder-*.vsix` téléchargé

Ou en ligne de commande :

```bash
code --install-extension riverpod-wayfinder-0.1.1.vsix
```

## Utilisation

1. Place ton curseur sur (ou sélectionne) une utilisation de provider, par ex. `viewFreshnessProvider`
2. Va à sa déclaration avec l'une de ces méthodes :
   - **`Ctrl+F12`** (Windows/Linux) / **`Cmd+F12`** (Mac) — "Go to Implementation" — atterrit toujours directement sur la source, sans liste de choix
   - **`Ctrl+Click`** / **`Cmd+Click`** (ou `F12`) — "Go to Definition" — ouvre généralement une liste avec l'emplacement généré `.g.dart` et la source écrite à la main ; choisis celle que tu veux
   - **`Ctrl+Alt+D`** (Windows/Linux) / **`Cmd+Alt+D`** (Mac), ou lance **"Riverpod Wayfinder: Go to Provider Source"** depuis la palette de commandes

### Exemple

Un fichier regroupant plusieurs providers, mélangeant les styles — exactement le cas pour lequel cette extension existe :

```dart
// Dans view_freshness.providers.dart
@riverpod
class ViewFreshness extends _$ViewFreshness { /* ... */ }

@riverpod
int viewFreshnessScore(Ref ref) { /* ... */ } // Ctrl+F12 sur viewFreshnessScoreProvider saute ICI, pas vers ViewFreshness

@riverpod
class ViewFreshnessHistory extends _$ViewFreshnessHistory { /* ... */ } // et viewFreshnessHistoryProvider saute ICI
```

### Pourquoi `Ctrl+Click` / `Cmd+Click` affiche-t-il une liste au lieu de sauter directement ?

`Ctrl+Click` déclenche le **Go to Definition** de VSCode, qui est agrégé entre toutes les extensions enregistrant un `DefinitionProvider` pour le langage `dart` — y compris l'extension Dart officielle, qui résout les utilisations de provider vers le fichier généré `.g.dart` (c'est réellement là que le symbole est défini). VSCode ne laisse pas la réponse d'un provider "gagner" par priorité, ordre ou vitesse ; quand plusieurs emplacements sont renvoyés, il affiche une liste/aperçu de tous. Riverpod Wayfinder enregistre lui aussi un `DefinitionProvider`, donc sa réponse (la source écrite à la main) apparaît dans cette liste à côté de celle de Dart — elle ne peut pas, et n'essaie pas de, remplacer ou masquer la contribution de Dart.

Si tu ne veux pas choisir à chaque fois, utilise **Go to Implementation** (`Ctrl+F12` / `Cmd+F12`) à la place — un geste séparé auquel l'extension Dart ne contribue pas, donc non contesté, et qui saute toujours directement vers la source.

### Comment ça marche

1. Trouve le fichier `.g.dart` contenant le provider cliqué
2. Lit sa déclaration `part of` pour localiser le fichier `.dart` écrit à la main
3. Identifie quelle annotation `@ProviderFor(...)` correspond au provider *précis* que tu as cliqué (pas juste la première du fichier)
4. Saute vers la `class` ou la fonction annotée `@riverpod` correspondante

## Prérequis

- VSCode 1.60.0+ (fonctionne aussi dans les éditeurs basés sur VSCode comme Cursor)
- L'[extension Dart](https://marketplace.visualstudio.com/items?itemName=Dart-Code.dart-code) (pour la génération `.g.dart` et le support Dart au quotidien)

## Paramètres

| Paramètre | Défaut | Description |
|---|---|---|
| `riverpod-wayfinder.enableLogging` | `false` | Journalise chaque décision de résolution (fichiers `.g.dart` candidats vérifiés, nom de classe/fonction inféré, ligne cible résolue) dans la console de débogage. |

## Problèmes connus

- Dépend de la déclaration `part of` du fichier `.g.dart` pour trouver le fichier source — des configurations de génération de code inhabituelles peuvent ne pas se résoudre correctement.
- L'inférence du nom de classe/fonction utilise une heuristique de casse (première lettre majuscule → classe, minuscule → fonction) ; du code qui ne respecte pas les conventions de nommage Dart peut mal se résoudre.

## Feuille de route

Cette extension se concentre sur une seule chose — une navigation fiable — mais il reste beaucoup de frictions Riverpod qu'aucune extension existante ne couvre bien pour l'instant : recherche inversée des utilisations d'un provider, commande de diagnostic de projet, graphes de dépendances, aide à la migration de code généré, et plus encore. Voir [ROADMAP.md](ROADMAP.md) pour la liste des idées — contributions et votes bienvenus.

## Développement

```bash
npm install
npm run test:unit    # tests unitaires purs du resolver, sans éditeur
npm run compile       # vérification de types, lint, bundle
npx @vscode/vsce package   # construit un .vsix installable
```

Pour la vérification d'intégration complète (est-ce que `Ctrl+F12` saute vraiment correctement dans un vrai éditeur), ouvre ce dossier dans VSCode et appuie sur `F5` pour lancer un Extension Development Host, ouvre un fichier `.dart` avec des providers générés, et teste — cette étape nécessite un humain au clavier.

Toute la logique de résolution vit dans [`src/resolver.ts`](src/resolver.ts), sans aucun import `vscode` — c'est une fonction pure testée contre des fixtures réalistes multi-providers dans [`test/fixtures/`](test/fixtures/). [`src/extension.ts`](src/extension.ts) est un fin wrapper côté VSCode.

## Contribuer

Les issues et pull requests sont les bienvenues — l'objectif est un outil vraiment porté par la communauté. Si tu rencontres un cas qui ne se résout pas correctement, merci d'inclure une paire minimale `.dart` + `.g.dart` qui reproduit le problème ; c'est généralement suffisant pour en faire un test de non-régression.

## Crédits

Ceci est un fork de [shinriyo/riverpod-jump-to-provider](https://github.com/shinriyo/riverpod-jump-to-provider) — tout le crédit pour l'idée originale revient à [@shinriyo](https://github.com/shinriyo). Ce fork corrige les bugs de résolution multi-providers, bascule le geste principal vers `Go to Implementation` pour que ça fonctionne vraiment de façon fiable, et ajoute un `DefinitionProvider` à côté de celui de Dart pour que `Ctrl+Click` propose un choix au lieu d'aller systématiquement vers le fichier généré.

## Licence

MIT — 100% libre et open source, sans contrepartie. Voir [LICENSE](LICENSE).
