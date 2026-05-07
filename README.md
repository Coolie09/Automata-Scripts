# Eindeutigkeit minimaler DEAs

## Aussage

Zu jeder regulären Sprache gibt es genau einen minimalen deterministischen endlichen Automaten, wenn man von der Benennung der Zustände absieht.

Anders gesagt:

> Zwei minimale DEAs, die dieselbe Sprache erkennen, unterscheiden sich höchstens durch andere Zustandsnamen.

Man sagt auch:

> Der minimale DEA ist eindeutig bis auf Isomorphie.

---

## Was bedeutet „bis auf Isomorphie“?

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

## Warum ist der minimale DEA eindeutig?

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

## Die Rolle der Myhill-Nerode-Klassen

Diese Gruppen von nicht unterscheidbaren Wörtern nennt man Myhill-Nerode-Klassen.

Jede solche Klasse beschreibt eine eigene „Restaufgabe“:

> Was muss ab jetzt noch kommen, damit das ganze Wort akzeptiert wird?

Ein minimaler DEA besitzt genau einen Zustand für jede dieser Restaufgaben.

Deshalb ist die Anzahl der Zustände nicht zufällig. Sie wird allein durch die Sprache bestimmt.

---

## Beweisidee

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

## Warum ist diese Zuordnung eindeutig?

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

## Was bleibt erhalten?

Die Abbildung `f` erhält die Struktur des Automaten.

### Startzustand

Das leere Wort führt in beiden Automaten zum Startzustand.

Daher wird der Startzustand von `A` auf den Startzustand von `B` abgebildet.

```text
f(q0) = p0
```

### Endzustände

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

### Übergänge

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

## Ergebnis

Die Abbildung `f` ordnet jedem Zustand von `A` genau einen passenden Zustand von `B` zu.

Dabei bleiben erhalten:

- der Startzustand
- die akzeptierenden Zustände
- alle Übergänge

Damit sind die beiden Automaten isomorph.

---

## Fazit

Ein minimaler DEA ist durch die erkannte Sprache vollständig festgelegt.

Unterschiede können nur noch in der Benennung der Zustände liegen.

Deshalb gilt:

```text
Zwei minimale DEAs, die dieselbe Sprache erkennen, sind isomorph.
```
