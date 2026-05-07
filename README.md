# Skripts zur Automatentheorie

In diesem Repository werden verschiedene Skripts zum Thema **Automatentheorie** gesammelt.

Die Skripts behandeln unterschiedliche Themen, zum Beispiel deterministische endliche Automaten, Minimierung, Übergangstabellen, Hashing von Automatenstrukturen und weitere Verfahren aus der theoretischen Informatik.

Diese README dient als Übersicht.  
Über die folgende Liste kommt man direkt zu den Beschreibungen der einzelnen Programme.

---

## Übersicht der Programme

> Die Programmnamen können hier später eingetragen oder angepasst werden.

- [DEA-Verkleinerungsprogramm](#dea-verkleinerungsprogramm)
- [Beweis der Eindeutigkeit der Minimierung](#Beweis-der-Eindeutigkeit-der-Minimierung)

---

## DEA-Verkleinerungsprogramm


Dieses Skript minimiert einen deterministischen endlichen Automaten (DEA).

Die Idee ist, Zustände zusammenzufassen, die sich für die erkannte Sprache gleich verhalten. Wenn zwei Zustände bei allen Eingaben immer in gleichartige Zustandsgruppen führen und beide entweder Endzustände oder Nicht-Endzustände sind, können sie zusammengelegt werden.

Am Ende wird aus dem minimierten Automaten zusätzlich eine kompakte Zeichenkette erzeugt. Diese Zeichenkette wird anschließend mit einer einfachen Hash-Funktion in eine Zahl umgerechnet.

---

### Grundidee

Ein DEA besteht aus:

- Zuständen
- einem Eingabealphabet
- Übergängen
- einem Startzustand
- Endzuständen

Das Skript versucht, gleichwertige Zustände zu finden. Gleichwertig bedeutet hier:

> Von diesen Zuständen aus verhält sich der Automat für alle möglichen Eingaben gleich.

Solche Zustände können zusammengefasst werden, ohne dass sich die erkannte Sprache ändert.

---

### Eingabe des Automaten

Der Automat wird direkt im Code als JavaScript-Objekt definiert:

```js
let automat = {
    q100: { a: "q100", b: "q100" }
};
```

In diesem Beispiel gibt es nur einen Zustand: `q100`.

Für den Zustand `q100` gilt:

- bei Eingabe `a` bleibt der Automat in `q100`
- bei Eingabe `b` bleibt der Automat ebenfalls in `q100`

Der Automat hat also eine Schleife auf sich selbst für beide Zeichen.

---

### Eingabealphabet

Das Alphabet steht in dieser Zeile:

```js
let eingabeAlphabet = "ab".split("");
```

Dadurch entsteht dieses Array:

```js
["a", "b"]
```

Das Programm prüft also für jeden Zustand die Übergänge mit `a` und `b`.

Wenn man ein anderes Alphabet verwenden möchte, muss man diese Zeile anpassen.

Beispiel:

```js
let eingabeAlphabet = "abc".split("");
```

Dann müsste aber auch jeder Zustand Übergänge für `a`, `b` und `c` besitzen.

---

### Startzustand und Endzustände

Der Startzustand wird hier festgelegt:

```js
let startZustand = "q100";
```

Die Endzustände stehen in diesem Array:

```js
let endzustaende = ["q100"];
```

In diesem Beispiel ist `q100` gleichzeitig Startzustand und Endzustand.

Da `q100` bei jeder Eingabe wieder zu sich selbst zurückgeht, akzeptiert dieser Automat jedes Wort über dem Alphabet `{a, b}`.

Also zum Beispiel:

```text
ε
a
b
ab
aaa
babba
```

---

### Die Variable `safe`

Die Variable `safe` speichert die aktuellen Gruppen von Zuständen:

```js
let safe = {};
```

Während der Minimierung werden Zustände in Gruppen eingeteilt.

Am Anfang gibt es höchstens zwei Gruppen:

- Endzustände
- Nicht-Endzustände

Danach werden diese Gruppen immer weiter aufgeteilt, falls sich Zustände innerhalb einer Gruppe doch unterschiedlich verhalten.

---

### Funktion `getGroup(zustand)`

```js
function getGroup(zustand) {
    for (let i in safe) {
        if (safe[i].includes(zustand)) {
            return i;
        }
    }
    return null;
}
```

Diese Funktion sucht heraus, in welcher Gruppe ein Zustand gerade liegt.

Beispiel:

```js
safe = {
    E: ["q0", "q1"],
    N: ["q2"]
};
```

Dann würde gelten:

```js
getGroup("q0") // "E"
getGroup("q2") // "N"
```

Die Funktion wird später gebraucht, um zu vergleichen, ob Zustände bei gleichen Eingaben in dieselben Gruppen führen.

---

### Funktion `createGroups()`

```js
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
```

Diese Funktion erstellt die erste Einteilung der Zustände.

Dabei werden alle Zustände in zwei Gruppen getrennt:

- `E` für Endzustände
- `N` für Nicht-Endzustände

Diese erste Trennung ist wichtig, weil ein Endzustand und ein Nicht-Endzustand nie gleichwertig sein können.

Ein Endzustand akzeptiert das bisher gelesene Wort. Ein Nicht-Endzustand tut das nicht.

---

### Funktion `checkChanges()`

Diese Funktion ist der wichtigste Teil der Minimierung.

```js
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
```

Die Funktion schaut sich jede aktuelle Zustandsgruppe an.

Für jeden Zustand wird geprüft:

> In welche Gruppen führen seine Übergänge?

Daraus wird ein Schlüssel gebaut.

Beispiel:

```text
E:E|N|
```

Das würde bedeuten:

- der Zustand ist aktuell in Gruppe `E`
- bei der ersten Eingabe geht er in Gruppe `E`
- bei der zweiten Eingabe geht er in Gruppe `N`

Zustände mit demselben Schlüssel bleiben zusammen in einer Gruppe.

Zustände mit unterschiedlichem Schlüssel werden getrennt.

---

### Wiederholung der Aufteilung

Nach dem ersten Prüfen wird die Aufteilung so lange wiederholt, bis sich nichts mehr ändert:

```js
let result = checkChanges();

while (result.changes) {
    safe = result.newSafe;
    result = checkChanges();
}
```

Das ist nötig, weil eine neue Aufteilung weitere Unterschiede sichtbar machen kann.

Sobald keine neuen Gruppen mehr entstehen, ist die Minimierung abgeschlossen.

Dann enthält `safe` die endgültigen Gruppen der gleichwertigen Zustände.

---

### Funktion `createNewAutomat()`

Nachdem die endgültigen Gruppen gefunden wurden, wird daraus ein neuer Automat gebaut.

```js
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
```

Jede Gruppe wird zu einem neuen Zustand.

Wenn zum Beispiel die Zustände `q1` und `q2` zusammengelegt werden, bekommt der neue Zustand diesen Namen:

```text
{q1,q2}
```

Für die Übergänge reicht es, einen Vertreter aus der Gruppe zu nehmen:

```js
let vertreter = gruppe[0];
```

Das funktioniert, weil alle Zustände in derselben Gruppe gleichwertig sind. Sie haben also dasselbe Verhalten bezogen auf die Gruppen.

---

### Funktion `createHashTable()`

Diese Funktion baut aus dem minimierten Automaten eine kompakte Textdarstellung.

Dabei bekommen die neuen Zustände Nummern:

```js
decode[i] = idx++;
```

Der Startzustand bekommt zuerst eine Nummer. Danach werden alle erreichbaren Folgezustände nummeriert.

Ein Eintrag sieht ungefähr so aus:

```text
0:a_0:b_0;
```

Das bedeutet:

- Zustand `0`
- bei Eingabe `a` geht es zu Zustand `0`
- bei Eingabe `b` geht es zu Zustand `0`

Für den Beispielautomaten entsteht genau so eine Struktur, weil der einzige Zustand bei `a` und `b` auf sich selbst zeigt.

---

### Ausgaben des Programms

Die Funktion gibt drei Dinge in der Konsole aus:

```js
console.log("Minimierter Automat:");
console.log(neu);

console.log("Decode-Tabelle:");
console.log(decode);

console.log("HashTable:");
console.log(table);
```

#### 1. Minimierter Automat

Hier sieht man den neu erzeugten Automaten nach der Minimierung.

Beim Beispiel bleibt nur ein Zustand übrig:

```js
{
  "{q100}": {
    a: "{q100}",
    b: "{q100}"
  }
}
```

#### 2. Decode-Tabelle

Die Decode-Tabelle zeigt, welche Zustandsgruppe welche Nummer bekommen hat.

Beispiel:

```js
{
  "{q100}": 0
}
```

#### 3. HashTable

Die HashTable ist die kompakte Textform des Automaten.

Beim Beispiel:

```text
0:a_0:b_0;
```

---

### Funktion `simpleHash(str)`

Zum Schluss wird die erzeugte HashTable gehasht:

```js
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    hash = hash * 31 + charCode;
    hash = hash | 0;
  }
  return hash;
}
```

Die Funktion geht Zeichen für Zeichen durch den String.

Für jedes Zeichen wird der Hash-Wert neu berechnet:

```js
hash = hash * 31 + charCode;
```

Danach sorgt

```js
hash = hash | 0;
```

dafür, dass der Wert wie eine 32-Bit-Ganzzahl behandelt wird.

Am Ende wird eine Zahl zurückgegeben.

Diese Zahl kann man als einfachen Fingerabdruck des minimierten Automaten sehen.

---

### Ablauf des Programms

Der Ablauf ist insgesamt:

1. Automat, Alphabet, Startzustand und Endzustände werden definiert.
2. Die Zustände werden zuerst in Endzustände und Nicht-Endzustände aufgeteilt.
3. Die Gruppen werden so lange verfeinert, bis keine neue Aufteilung mehr entsteht.
4. Aus den fertigen Gruppen wird der minimierte Automat gebaut.
5. Der minimierte Automat wird in eine kompakte Textform gebracht.
6. Diese Textform wird gehasht.
7. Der Hash-Wert wird ausgegeben.

---

### Beispiel mit dem vorhandenen Automaten

Der eingebaute Automat ist:

```js
let automat = {
    q100: { a: "q100", b: "q100" }
};
```

Er hat nur einen Zustand.

Dieser Zustand ist auch ein Endzustand:

```js
let endzustaende = ["q100"];
```

Deshalb kann hier nichts weiter minimiert werden.

Der minimierte Automat ist praktisch derselbe Automat, nur als Gruppe geschrieben:

```js
{
  "{q100}": {
    a: "{q100}",
    b: "{q100}"
  }
}
```

Die HashTable lautet:

```text
0:a_0:b_0;
```

Danach wird daraus ein Hash-Wert berechnet und in der Konsole ausgegeben.

---

## Hinweis

Das Programm erwartet einen vollständigen DEA.

Das heißt:

- Jeder Zustand muss für jedes Zeichen aus dem Alphabet einen Übergang haben.
- Jeder Zielzustand muss auch im Automaten definiert sein.
- Der Startzustand muss existieren.
- Die Endzustände müssen gültige Zustände des Automaten sein.

Wenn einer dieser Punkte fehlt, kann das Programm falsche Ergebnisse liefern oder abbrechen.

---


## Beweis der Eindeutigkeit der Minimierung

### Aussage

Zu jeder regulären Sprache gibt es genau einen minimalen deterministischen endlichen Automaten, wenn man von der Benennung der Zustände absieht.

Anders gesagt:

> Zwei minimale DEAs, die dieselbe Sprache erkennen, unterscheiden sich höchstens durch andere Zustandsnamen.

Man sagt auch:

> Der minimale DEA ist eindeutig bis auf Isomorphie.

---

### Was bedeutet „bis auf Isomorphie“?

Zwei Automaten sind isomorph, wenn sie zwar unterschiedlich aussehen können, aber dieselbe Struktur haben.

Zum Beispiel kann ein Automat Zustände

```text
q0, q1, q2
```

haben und ein anderer Automat Zustände

```text
A, B, C
```

Wenn man die Zustände passend umbenennen kann und danach alle Übergänge, Startzustände und Endzustände übereinstimmen, dann sind die Automaten strukturell gleich.

Es geht also nicht um die Namen der Zustände, sondern um den Aufbau des Automaten.

---

### Warum ist der minimale DEA eindeutig?

Ein Zustand in einem DEA beschreibt im Grunde, welche Möglichkeiten nach dem bisher gelesenen Wort noch offen sind.

Wenn zwei Wörter nach dem Einlesen immer dasselbe zukünftige Verhalten haben, dann müssen sie in einem minimalen Automaten im selben Zustand landen.

Zwei Wörter `u` und `v` haben dasselbe zukünftige Verhalten, wenn für jedes mögliche angehängte Wort `w` gilt:

```text
uw liegt in L genau dann, wenn vw in L liegt.
```

Formal:

```text
uw ∈ L ⇔ vw ∈ L
```

Das bedeutet:

Egal, was man hinten anhängt, beide Wörter führen immer gleichzeitig zu einem Wort aus der Sprache oder gleichzeitig nicht.

Dann sind `u` und `v` für die Sprache nicht unterscheidbar.

---

### Die Rolle der Myhill-Nerode-Klassen

Diese Gruppen von nicht unterscheidbaren Wörtern nennt man Myhill-Nerode-Klassen.

Jede solche Klasse beschreibt eine eigene „Restaufgabe“:

> Was muss ab jetzt noch kommen, damit das ganze Wort akzeptiert wird?

Ein minimaler DEA besitzt genau einen Zustand für jede dieser Restaufgaben.

Deshalb ist die Anzahl der Zustände nicht zufällig. Sie wird allein durch die Sprache bestimmt.

---

### Beweisidee

Angenommen, es gibt zwei minimale DEAs `A` und `B`, die dieselbe Sprache `L` erkennen.

Dann gilt:

```text
L(A) = L(B) = L
```

Nun betrachtet man einen Zustand `q` in Automat `A`.

Da `A` minimal ist, ist jeder Zustand erreichbar. Also gibt es ein Wort `x`, das vom Startzustand aus nach `q` führt:

```text
δ_A(q0, x) = q
```

Dasselbe Wort `x` kann man auch in Automat `B` einlesen. Dort landet man in einem Zustand `p`:

```text
δ_B(p0, x) = p
```

Dann ordnet man dem Zustand `q` aus Automat `A` den Zustand `p` aus Automat `B` zu.

Also:

```text
f(q) = p
```

Diese Zuordnung sagt:

> Der Zustand, den `A` nach dem Wort `x` erreicht, entspricht dem Zustand, den `B` nach demselben Wort `x` erreicht.

---

### Warum ist diese Zuordnung eindeutig?

Ein Zustand kann durch verschiedene Wörter erreicht werden.

Zum Beispiel könnte in `A` gelten:

```text
δ_A(q0, ab) = q
δ_A(q0, baab) = q
```

Dann muss man sicherstellen, dass `ab` und `baab` in `B` ebenfalls im selben Zustand landen.

Warum?

Weil beide Wörter in `A` im selben Zustand landen. Ab diesem Punkt kann der Automat sie nicht mehr unterscheiden. Für jedes angehängte Wort `w` gilt also:

```text
abw ∈ L ⇔ baabw ∈ L
```

Da `B` dieselbe Sprache erkennt, muss `B` dieses Verhalten genauso abbilden. In einem minimalen Automaten dürfen zwei Wörter mit identischem zukünftigem Verhalten nicht in verschiedenen Zuständen liegen, sonst könnte man diese Zustände zusammenfassen.

Also landen `ab` und `baab` auch in `B` im selben Zustand.

Damit ist die Zuordnung `f` wohldefiniert.

---

### Was bleibt erhalten?

Die Abbildung `f` erhält die Struktur des Automaten.

#### Startzustand

Das leere Wort führt in beiden Automaten zum Startzustand.

Daher wird der Startzustand von `A` auf den Startzustand von `B` abgebildet.

```text
f(q0) = p0
```

#### Endzustände

Ein Zustand ist akzeptierend, wenn ein Wort, das dorthin führt, zur Sprache gehört.

Wenn ein Wort `x` in `A` zu einem akzeptierenden Zustand führt, dann gilt:

```text
x ∈ L(A)
```

Da beide Automaten dieselbe Sprache erkennen, gilt auch:

```text
x ∈ L(B)
```

Also führt `x` in `B` ebenfalls zu einem akzeptierenden Zustand.

Damit werden akzeptierende Zustände auf akzeptierende Zustände abgebildet.

#### Übergänge

Wenn in `A` ein Übergang

```text
q --a--> r
```

existiert und `q` durch ein Wort `x` erreicht wird, dann erreicht man `r` durch das Wort `xa`.

In `B` passiert mit demselben Wort `xa` genau der entsprechende Übergang.

Formal:

```text
f(δ_A(q, a)) = δ_B(f(q), a)
```

Die Übergänge bleiben also erhalten.

---

### Ergebnis

Die Abbildung `f` ordnet jedem Zustand von `A` genau einen passenden Zustand von `B` zu.

Dabei bleiben erhalten:

- der Startzustand
- die akzeptierenden Zustände
- alle Übergänge

Damit sind die beiden Automaten isomorph.

---

## Ziel des Repositories

Das Repository soll nach und nach eine Sammlung von Programmen zur Automatentheorie werden.

Dabei geht es nicht nur darum, fertige Skripts abzulegen, sondern auch darum, die Ideen dahinter verständlich zu dokumentieren.
