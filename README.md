# ProbaIT

Am ales proba de backend.

Pentru a rula aplicatia:
1. mysql server trebuie sa fie instalat
(tutorial instalare: https://youtu.be/Cz3WcZLRaWc?t=300)
2. in index.js, la linia 17, trebuie introduse credentialele de la
server-ul tau de mysql
3. se ruleaza "npm install"
4. se ruleaza "npm start"
5. se asteapta afisarea mesajelor "Example app listening on port 8000!"
si "Connection to the database has been established successfully!"

Am implementat:
1. Tot task-ul ContactRequest cu tot cu bonusuri (mai putin bonusul care trimite email)
2. Tot task-ul User cu tot cu bonusuri
3. Tot task-ul Review cu tot cu bonusuri
4. Tot task-ul TutoringClass cu tot cu bonusuri
5. Tot task-ul Enrolment

Am facut tot proiectul de la 0. 

Toate query-urile cu body folosesc express validator pentru asigura integritatea datelor transmise.
Am verificat extensiv toate campurile.

Pentru ca pentru ca PATCH si DELETE de la task-urile User, Review si TutoringClass sa functioneze, trebuie folosit un bearer token.
Acest token se poate obtine folosind endpoint-ul de login.

Endpoint-urie de POST de la task-urile Review, TutoringClass si Enrolment necesita, in mod asemanator, un bearer token, pentru a extrage id-ul user-ului autentificat.
