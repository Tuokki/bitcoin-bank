# Bitcoin-pankki

Asennettava:

- Node.js
- Heroku toolbelt
- Git
- snarl

Teknologiat:
- MEAN (Mongo, Express, Angular, Node)
- Heroku (ajoympäristö)
- Git/GitHub versionhallinta

Positiivista:
- Voit paikallisesti kehittää, siten että tallentaessa sovellus käynnistyy automaattisesti, paikallisesti voi käyttää myös herokun mongoHQ-tietokantaa suoraan.

Muistettavaa:
- shh-keygen vaatii gitin bin-hakemiston asennuksen windows pathiin, muuten ei toimi
- MEAN sovellus kannattaa käynnistää gruntilla "grunt", koska muuten kaikki js-tiedostot eivät tule tarjolle. Asenna grunt-cli globaalisti "npm install -g grunt-cli"

Komentoja:
- Lisää tiedostot git:n valvovan silmän alle "git add ."
- Git tilanne "git status"
- Lisää tiedostot gitin paikalliseen versionhallintaan "git commit -m "commit viesti"" 
- Siirrä tiedostot herokuun ja käynnistä: "git push heroku master"

Lisää komentoja:
- Perusta gitin paikallinen repo "git init" kansiossa jonne haluat perustaa repon.
- Lisää gitHub verkossa oleva repo "git remote add origin https://github.com/XXX/project.git"
- Siirrä remoteen "git push -u origin master"
- Hae remotesta "?"