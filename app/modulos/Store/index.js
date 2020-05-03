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
}

decorate(Store, {
  shop: observable,
  setShopBadge: action,
  noty: observable,
  setNotyBadge: action,
});

// export class
export default new Store();