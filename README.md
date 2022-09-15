# Instalar de fomra globarl JSON-SERVER

1 verigicar si tengo npm 
```sh
npm --version
```
2 instalo globalmente JSON server
```sh
npm install json-server -g
```
3 verifico que lo tengo instalado
```sh
json-server --version
```
4 creo la carpeta data y dentro creo db.json fuera de la carpeta del proyecto
5 Ejecuto el json-server
```sh
json-server --watch ../data/db.json --port 8000
```