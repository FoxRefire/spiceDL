# SpiceDL
[![Github Stars badge](https://img.shields.io/github/stars/FoxRefire/spiceDL?logo=github&style=social)](https://github.com/CharlieS1103/spicetify-extensions/)

Spicetify extension for download musics using spotDL

## Install
Install this extension from marketplace or add `spiceDL.js` into `config-xpui.ini`.

And then start [python daemon](https://github.com/FoxRefire/spiceDL/blob/main/serve.py).
```
pip3 install spotdl flask flask_cors tkinter # Install dependencies
python3 serve.py
```

Alternatively, you can use zotify as downloading backend of music/podcast.
Use this [alternative daemon](https://github.com/FoxRefire/spiceDL/blob/main/serve_zotify.py)
```
pip3 install spotdl flask flask_cors git+https://zotify.xyz/zotify/zotify.git
python3 serve_zotify.py
```


## Screenshots
![Screenshot1](https://github.com/FoxRefire/spiceDL/blob/Screenshot/Screenshot1.png?raw=true)
![Screenshot2](https://github.com/FoxRefire/spiceDL/blob/Screenshot/Screenshot2.png?raw=true)

## Comparation of downloading backend
![Comparation](https://github.com/FoxRefire/spiceDL/blob/Screenshot/comparition.png?raw=true)
