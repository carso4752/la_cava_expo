import { decorate, observable, action } from "mobx";

class Store {
  shop = 0;
  setShop = (shop) => {
    this.shop = shop;
  }

  noty = 0;
  setNoty = (noty) => {
    this.noty = noty;
  }
}

decorate(Store, {
  shop: observable,
  setShop: action,
  noty: observable,
  setNoty: action,
});

// export class
export default new Store();