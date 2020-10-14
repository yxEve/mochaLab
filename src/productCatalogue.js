class Catalogue {
  constructor(title) {
    this.title = title;
    this.products = [];
  }

  findProductById(id) {
    const match = this.products.find((product) => id === product.id);
    return match;
  }

  addProduct(product) {
    if (!this.findProductById(product.id)) {
      this.products.push(product);
      return true;
    }
    return false;
  }
  
  batchAddProducts(batch) {
    const productIDClash = batch.products.some(
      (product) => this.findProductById(product.id) !== undefined
    );
    if (productIDClash) {
      throw new Error("Bad Batch");
    }
    const noProductsAdded = batch.products
      .filter((product) => product.quantityInStock > 0 )
      .filter((p) => {
        this.addProduct(p);
        return true;
      })
      .reduce((acc, p) => acc + 1, 0);
    return noProductsAdded;
  }

  removeProductById(id) {
    const removedProduct = this.findProductById(id);
    if (removedProduct) {
      this.products = this.products.filter(
        (product) => product.id !== id 
      );
    }
    return removedProduct;
  }
  checkReorders() {
    const result = { type: "Reorder", productIds: [] };
    result.productIds = this.products
      .filter((p) => p.quantityInStock <= p.reorderLevel)
      .map((p) => p.id);
    return result;
  }

  search(criteria){
    if(Object.keys(criteria) == 'price'){
      const result = this.products
      .filter((p) => p.price <= Object.values(criteria)).map((p) => p.id);
      return result.length;
    }
    else if(Object.keys(criteria) == 'keyword'){
      const result = this.products
      .filter((p) => p.name.search(Object.values(criteria)) !== -1).map((p) => p.id);
      return result.length;
    }   
    else if(Object.keys(criteria) !== 'price' || 'keyword'){
      throw new Error("Bad Search");
      }
  }

};
module.exports = Catalogue;
