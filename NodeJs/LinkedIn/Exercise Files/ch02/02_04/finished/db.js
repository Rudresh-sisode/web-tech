const { LocalStorage } = require('node-localstorage')

const dbA = new LocalStorage('data-a-m')
const dbB = new LocalStorage('data-m-z')

const whichDB = name => name.match(/^[A-M]|^[a-m]/) ?
  dbA : dbB

const loadCats = db => JSON.parse(db.getItem("cats") || '[]')

const hasCat = name => loadCats(whichDB(name))
    .map(cat => cat.name)
    .includes(name)

module.exports = {

    addCat(newCat) {
        if (!hasCat(newCat.name)) {
            let db = whichDB(newCat.name)
            let cats = loadCats(db)
            cats.push(newCat)
            db.setItem("cats", JSON.stringify(cats, null, 2))
        }
    },

    findCatByName(name) {
        let db = whichDB(name)
        let cats = loadCats(db)
        return cats.find(cat => cat.name === name)
    },

    findCatsByColor(color) {
        return [
          ...loadCats(dbA).filter(cat => cat.color === color),
          ...loadCats(dbB).filter(cat => cat.color === color),
        ]
    }

}
