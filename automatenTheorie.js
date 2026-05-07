// DEA Verkleinerungsprogramm

let automat = {
    q100: { a: "q100", b: "q100" }
};

let safe = {};

let eingabeAlphabet = "ab".split("");

let startZustand = "q100";
let endzustaende = ["q100"];

function getGroup(zustand) {
    for (let i in safe) {
        if (safe[i].includes(zustand)) {
            return i;
        }
    }
    return null;
}

function createGroups() {
    let end = [];
    let notEnd = [];

    for (let i in automat) {
        if (endzustaende.includes(i)) {
            end.push(i);
        } else {
            notEnd.push(i);
        }
    }

    safe = {};

    if (notEnd.length > 0) {
        safe["N"] = notEnd;
    }

    if (end.length > 0) {
        safe["E"] = end;
    }
}

createGroups();

function checkChanges() {
    let newSafe = {};
    let changes = false;

    for (let i in safe) {
        for (let x of safe[i]) {
            let str = "";

            for (let h of eingabeAlphabet) {
                str += getGroup(automat[x][h]) + "|";
            }

            let key = i + ":" + str;

            if (newSafe[key]) {
                newSafe[key].push(x);
            } else {
                newSafe[key] = [x];
            }
        }
    }

    if (Object.keys(newSafe).length !== Object.keys(safe).length) {
        changes = true;
    }

    return { newSafe, changes };
}

let result = checkChanges();

while (result.changes) {
    safe = result.newSafe;
    result = checkChanges();
}

function createNewAutomat() {
    let newAutomat = {};

    function groupName(gruppe) {
        return "{" + gruppe.join(",") + "}";
    }

    for (let i in safe) {
        let gruppe = safe[i];
        let name = groupName(gruppe);

        newAutomat[name] = {};

        let vertreter = gruppe[0];

        for (let h of eingabeAlphabet) {
            let zielzustand = automat[vertreter][h];
            let zielgruppeKey = getGroup(zielzustand);
            let zielgruppe = safe[zielgruppeKey];

            newAutomat[name][h] = groupName(zielgruppe);
        }
    }

    return newAutomat;
}

let neu = createNewAutomat();

function createHashTable() {
    let idx = 0;
    let table = "";
    let decode = {};
    let lastZustand = [];

    for (let i in neu) {
        if (i.includes(startZustand)) {
            decode[i] = idx++;

            table += decode[i];

            for (let x = 0; x < eingabeAlphabet.length; x++) {
                let symbol = eingabeAlphabet[x];
                let ziel = neu[i][symbol];

                if (!(ziel in decode)) {
                    decode[ziel] = idx++;

                    if (!lastZustand.includes(ziel)) {
                        lastZustand.push(ziel);
                    }
                }

                table += `:${symbol}_${decode[ziel]}`;
            }

            table += ";";
            break;
        }
    }

    while (lastZustand.length > 0) {
        let state = lastZustand.shift();
        let decoded = decode[state];

        table += decoded;

        for (let x = 0; x < eingabeAlphabet.length; x++) {
            let symbol = eingabeAlphabet[x];
            let ziel = neu[state][symbol];

            if (!(ziel in decode)) {
                decode[ziel] = idx++;

                if (!lastZustand.includes(ziel)) {
                    lastZustand.push(ziel);
                }
            }

            table += `:${symbol}_${decode[ziel]}`;
        }

        table += ";";
    }

    console.log("Minimierter Automat:");
    console.log(neu);

    console.log("Decode-Tabelle:");
    console.log(decode);

    console.log("HashTable:");
    console.log(table);

    return table;
}

console.log(simpleHash(createHashTable()));

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    hash = hash * 31 + charCode;
    hash = hash | 0;
  }
  return hash;
}