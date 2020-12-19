var numberUtil = {

  /* format number ddd,dddd,ddd.00 */
  formatNumber: function (number){
    return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  },

  getNumber: function(num){
    let numAux = parseInt(num);
    return isNaN(numAux) ? 0 :numAux;
  }
}