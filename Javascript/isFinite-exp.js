isFinite(Infinity);  // false
isFinite(NaN);       // false
isFinite(-Infinity); // false

isFinite(0);         // true
isFinite(2e64);      // true
isFinite(910);       // true

isFinite(null);      // true, would've been false with the
                     // more robust Number.isFinite(null)

isFinite('0');       // true, would've been false with the
                     // more robust Number.isFinite("0")
