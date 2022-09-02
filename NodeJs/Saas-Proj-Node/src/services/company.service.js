exports.sortInactiveCompanyData = (data)=> {

    const mData = [];
    for(let i =0; i < data.length; i++){
        let obj = {};
        obj.cmpId = data[i]._id;
        obj.companyName = data[i].cmp_name;
        obj.companyEmail = data[i].cmp_email;
        obj.address1 = data[i].cmp_address;
        obj.city = data[i].city;
        obj.zipCode = data[i].zipcode;
        obj.stateKey = data[i].state_key;
        obj.officeNumber = data[i].office_number;
        obj.isActive = data[i].is_active;
        obj.isDeleted = data[i].is_deleted;
        obj.createdAt = data[i].createdAt;
        obj.createdBy = data[i].createdBy;
        mData.push(obj);
        obj = {}
    }

    return mData;
}