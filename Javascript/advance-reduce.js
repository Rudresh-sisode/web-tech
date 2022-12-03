let abcObj =[{groupId: 'b7fc4956-6660-11ed-9e39-a3a30a9dd4a6', groupName: 'Apna Group', groupMemberId: '11964b56-6661-11ed-b739-af9a06b29817', userId: '118d29d6-6661-11ed-b738-4f05ba9abf78', userName: 'deepak Kshirsagar'},
{groupId: '481fadd4-6661-11ed-bc29-03c87008c02a', groupName: 'Deepak ka group', groupMemberId: '482354c0-6661-11ed-8ca8-3b9a00bbb2ec', userId: '118d29d6-6661-11ed-b738-4f05ba9abf78', userName: 'deepak Kshirsagar'},
{groupId: 'b7fc4956-6660-11ed-9e39-a3a30a9dd4a6', groupName: 'Apna Group', groupMemberId: 'f274243c-6660-11ed-b737-9368dcf349ae', userId: 'f26a9728-6660-11ed-b736-f3009cc6a002', userName: 'rudresh sisodiya'},
{groupId: 'b7fc4956-6660-11ed-9e39-a3a30a9dd4a6', groupName: 'Apna Group', groupMemberId: 'c32739e8-6af3-11ed-9029-6b9d93689eb6', userId: 'c307421e-6af3-11ed-9028-73d68031898f', userName: 'Umakant'},
{groupId: '481fadd4-6661-11ed-bc29-03c87008c02a', groupName: 'Deepak ka group', groupMemberId: '27f24d56-6afc-11ed-8284-ef586e93e156', userId: 'c307421e-6af3-11ed-9028-73d68031898f', userName: 'Umakant'}]

// let bca = abcObj.reduce(
//     (entryMap, e) => entryMap.set(e.groupId, [...entryMap.get(e.groupId)||[], e]),
//     new Map()
// );

let result = abcObj.reduce(function (r, a) {
        r[a.groupId] = r[a.groupId] || [];
  console.log('in reducre 1',r[a.groupId].length,a.groupId,r)
        r[a.groupId].push(a);
    console.log('in reducre 2',r[a.groupId].length,a.groupId,r)
        return r;
    }, Object.create(null));
    //you can use {} only here instead
console.log('your result ',Object.values(result).flat(Infinity));

// console.log(Array.from(bca.entries()))