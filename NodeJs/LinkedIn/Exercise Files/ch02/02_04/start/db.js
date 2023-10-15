const { LocalStorage } = require('node-localstorage')

const db = new LocalStorage('data')

const loadCats = () => JSON.parse(db.getItem("cats") || '[]')

const hasCat = name => loadCats()
    .map(cat => cat.name)
    .includes(name)

module.exports = {

    addCat(newCat) {
        if (!hasCat(newCat.name)) {
            let cats = loadCats()
            cats.push(newCat)
            db.setItem("cats", JSON.stringify(cats, null, 2))
        }
    },

    findCatByName(name) {
        let cats = loadCats()
        return cats.find(cat => cat.name === name)
    },

    findCatsByColor(color) {
        let cats = loadCats()
        return cats.filter(cat => cat.color === color)
    }

}
