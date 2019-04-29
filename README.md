##### Docker:
run container from file:  
`docker compose-up`  
dodaj -d flag (detached) da runnas u pozadini  
ugasi detachani kontejner:  
`docker-compose down`  

##### Node:  
odes u app folder i roknes logicno  
`npm i`  
i onda da runnas server rokni  
`npm run dev`  
nezz dal znas za taj trik ali mores si postavit skripte u package.json  
otvori i pogledaj kaj sam napisal u package.json pa bus skuzil,  
`npm run dev` pokrece `nodemon app.js`  
`npm run start` pokrece `node app.js`  
