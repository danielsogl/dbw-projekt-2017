# DHBW Projekt 2017

Alle private API-Keys wurden aus der environment.ts, sowie md-bootstrap-pro aus der package.json Datei entfernt. Die Anwendung ist daher nichtmehr funktionsfäig! Bitte eigenes Firebase sowie PayPal Projekt anlegen und die gelöschten Keys damit ersetzten.

## Dokumentation

https://danielsogl.github.io/eventpicking/

## Inhaltsverzeichnis

* [Einrichtung der Entwicklungsumgebung](#einrichtung-der-entwicklungsumgebung)
* [Angular CLI Befehle](#angular-cli-befehle)
* [Testkonten](#testkonten)

## Einrichtung der Entwicklungsumgebung

### Software

Um mit dem Projektdaten arbeiten zu können, bedarfs es folgender Tools und
Programme. Alle Tools und Programme lassen sich unter Windows und macOS
installieren und nutzen.

* [Node.js LTS](https://nodejs.org)
* [Visual Studio Code](https://code.visualstudio.com) oder ein vergleichbarer
  Editor
* [Google Chrome](https://www.google.com/chrome/browser/desktop/index.html)
* [GitKraken](https://www.gitkraken.com) oder ein vergleichbarer Git-Client

### Installation der Angular CLI und der Firebase Tools

Nach der Instalaltion der Software kann in der Konsole/Terminal auf das Node
Package Repository mit NPM zugegriffen werden. Hierzu die Konsole öffnen und
folgende Befehle für die Installation der benötigten Tools ausführen:

```bash
npm install -g @angular/cli firebase-tools
```

### Einrichtung von Visual Studio Code

Visual Studio ist ein Editor, vergleichbar mit Nodepad++ und muss daher für die
benötigte Programmiersprache und Frameworks mit Plugins erweitert werden.
Installiert werden diese entweder über das Plugin Symbol auf der linken Seite
oder über das Betätigen der F1 Taste und dem befehl `ext install plugin-name`.
Folgende Plugins sind für die ENtwicklung von Web- und Angular-Anwendungen
sinnvoll:

* Angular Essentials
* Add jsdoc comments
* Auto Rename Tag
* Beautify
* Bracket Pair Colorizer
* Debugger for Chrome
* Material Icon Theme
* Prettier - Code Formater
* TypeScript Hero

Nach der Installation der Plugin sollten folgende Einstellungen eingetragen
werden:

```json
{
  "workbench.startupEditor": "newUntitledFile",
  "workbench.iconTheme": "material-icon-theme",
  "editor.formatOnSave": true,
  "prettier.singleQuote": true,
  "prettier.semi": true,
  "editor.trimAutoWhitespace": true,
  "files.trimTrailingWhitespace": true,
  "auto-rename-tag.activationOnLanguage": ["html"]
}
```

### Klonen des Projektes

Um das Projekt Klonen und weiterentwicklen zu können, muss dieses lediglich über
GitKraken geklont werden. Nach dem Klonen kann das Projekt über VSCode geöffnet
werden und die Abhänigkeiten über die Konsole mit dem Befehl `npm install`
installiert werden. Nun kann die Anwendung mit dem Befehl `ng serve -o`
ausgeführt werden.

## Angular CLI und Skript Befehle

* Ausführen der Anwendung: `ng serve`
* Generierung neuer Components/Pipes etc: `ng g <typ> <name>`
* Bauen der Anwendung als SPA: `ng build--prod`
* Ausführen der Unit-Tests: `npm run test`
* Ausführen der E2E-Tests: `ng e2e`
* Generierung der Dokumentation: `npm run docs`

## Testkonten

* fotograf@test.de - Passwort: passwort
* user@test.de - Passwort: passwort
* admin@test.de - Passwort: passwort
* PayPal Konto: fotograf@test.de - Passwort: passwort
