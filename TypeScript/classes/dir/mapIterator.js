"use strict";
const MapExmp = new Map();
MapExmp.set({}, 34);
MapExmp.set([], 44);
const matItr = MapExmp[Symbol.iterator]();
console.log(matItr.next().value);
