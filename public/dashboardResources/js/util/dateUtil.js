
var dateUtil = {

  /* returns date from a string dd-MM-yyyy */
  stringToDate: function(dateText){
    return new Date(dateText.substring(0,4), dateUtil.getNumber(dateText.substring(5,7))-1, dateUtil.getNumber(dateText.substring(8,10)));
  },

  /* returns string dd-MM-yyyy of a Date*/
  dateToString: function(date){
    return date.getFullYear() +'-'+ dateUtil.getFormatMonth(date.getMonth()) + "-"+ dateUtil.getFormatDay(date.getDate());
  },

  /* returns name months*/
  getFullNameMonth(index){
    let months =  ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    return months[index];
  },

  /* returns Epoch date*/
  getEpochDate: function(dateText){
    return Date.parse(dateText) / 1000.0;
  },

  /* returns endDate */
  setEndDay: function (dateText){
    return Date.parse(dateText + " 23:59:59") / 1000.0;
  },

  /* returns string month */
  getFormatMonth: function(month) {
    let _mont = month+1;
    return (_mont<10)? "0"+_mont:_mont;
  },

  /* returns string day */
  getFormatDay: function(day) {
    return (day<10)? "0"+day:day;
  },

  /* returns date short  dd MM */
  getShortDate: function(epochDate){
    let date = new Date(epochDate*1000);
    return date.getUTCDate() + " " + dateUtil.getFullNameMonth(date.getUTCMonth());
  },

  getNumber: function(num){
    let numAux = parseInt(num);
    return isNaN(numAux) ? 0 :numAux;
  }
}


