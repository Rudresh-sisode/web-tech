// next day prototype;

Date.prototype.nextDate = function(){

    //initiate the variable with time
    let nextDay = new Date(this.getTime());

    //set the next date time
    nextDay.setDate(this.getDate()+1);

    let year = nextDay.getFullYear();
    let month = (nextDay.getMonth() + 1).toString().padStart(2,'0');
    let date = nextDay.getDate().toString().padStart(2,'0');

    return `${year}-${month}-${date}`;

    
}