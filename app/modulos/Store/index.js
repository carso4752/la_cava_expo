import { decorate, observable, action } from "mobx";

class Store {
  shop = 0;
  setShopBadge = (shop) => {
    this.shop = shop;
  }

  noty = 0;
  setNotyBadge = (noty) => {
    this.noty = noty;
  }

  pedidos = null;
  setPedidos = pedidos => {
    this.pedidos = pedidos;
  }
  
}

decorate(Store, {
  shop: observable,
  setShopBadge: action,
  noty: observable,
  setNotyBadge: action,
  pedidos: observable,
  setPedidos: action,
});

// export class
export default new Store();