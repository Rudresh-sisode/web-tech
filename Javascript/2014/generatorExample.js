function* gexEx(bc) {
  yield bc;
  yield bc++;
  yield bc;
}

const g = gexEx(90);

console.log(g.next());
console.log(g.next());
console.log(g.next());

