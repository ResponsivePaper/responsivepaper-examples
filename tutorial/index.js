function ViewModel() {
  this.init = async function () {
    let response = await fetch("data.json");
    let data = await response.json();
    //assign products to categories
    this.categories = data.categories
      .map(c => {
        c.products = data.products.filter(p => p.categoryID == c.categoryID)
        //demo purposes, adding more data to Category 1
        if (c.categoryID === 1) {
          c.products = c.products.concat(c.products).concat(c.products).concat(c.products)
        }
        return c
      })
  }

}

var vm = new ViewModel()
vm.init().then(() => {
  var app = new Vue({
    el: '#rpReport',
    data: {
      categories: vm.categories
    }
  })
  window.RESPONSIVE_PAPER_READY_TO_RENDER = true
})


