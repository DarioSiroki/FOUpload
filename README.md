prvi put runnaj s ovim da vidis output

docker compose-up

onda rokni ctrl+c da zaustavis pa mores runnat ovak u pozadini

docker-compose up -d

d = detached da si lakse zapamtis ;)
dok oces ugasit(moras bit u folderu iz kojeg si ga pokrenul !11!!!):
docker-compose down 

odes u app folder i roknes
npm i
da instaliras node module
i onda da runnas server rokni
npm run dev

nezz dal znas za taj trik ali mores si postavit skripte u package.json
otvori i pogledaj kaj sam napisal u package.json pa bus skuzil,
npm run dev pokrece "nodemon app.js"
npm run start pokrece "node app.js"
