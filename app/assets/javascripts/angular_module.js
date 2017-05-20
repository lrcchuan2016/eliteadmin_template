angular.module('MainModule', [])
.factory('Cart', function ($location) {
        var myCart = new ShoppingCart('MyShop');
        return {
            cart: myCart
        };
})
.directive('checklistModel', ['$parse', '$compile', function($parse, $compile) {
  // contains
  function contains(arr, item, comparator) {
    if (angular.isArray(arr)) {
      for (var i = arr.length; i--;) {
        if (comparator(arr[i], item)) {
          return true;
        }
      }
    }
    return false;
  }

  // add
  function add(arr, item, comparator) {
    arr = angular.isArray(arr) ? arr : [];
      if(!contains(arr, item, comparator)) {
          arr.push(item);
      }
    return arr;
  }  

  // remove
  function remove(arr, item, comparator) {
    if (angular.isArray(arr)) {
      for (var i = arr.length; i--;) {
        if (comparator(arr[i], item)) {
          arr.splice(i, 1);
          break;
        }
      }
    }
    return arr;
  }

  // http://stackoverflow.com/a/19228302/1458162
  function postLinkFn(scope, elem, attrs) {
     // exclude recursion, but still keep the model
    var checklistModel = attrs.checklistModel;
    attrs.$set("checklistModel", null);
    // compile with `ng-model` pointing to `checked`
    $compile(elem)(scope);
    attrs.$set("checklistModel", checklistModel);

    // getter / setter for original model
    var getter = $parse(checklistModel);
    var setter = getter.assign;
    var checklistChange = $parse(attrs.checklistChange);

    // value added to list
    var value = attrs.checklistValue ? $parse(attrs.checklistValue)(scope.$parent) : attrs.value;


    var comparator = angular.equals;

    if (attrs.hasOwnProperty('checklistComparator')){
      if (attrs.checklistComparator[0] == '.') {
        var comparatorExpression = attrs.checklistComparator.substring(1);
        comparator = function (a, b) {
          return a[comparatorExpression] === b[comparatorExpression];
        }
        
      } else {
        comparator = $parse(attrs.checklistComparator)(scope.$parent);
      }
    }

    // watch UI checked change
    scope.$watch(attrs.ngModel, function(newValue, oldValue) {
      if (newValue === oldValue) { 
        return;
      } 
      var current = getter(scope.$parent);
      if (angular.isFunction(setter)) {
        if (newValue === true) {
          setter(scope.$parent, add(current, value, comparator));
        } else {
          setter(scope.$parent, remove(current, value, comparator));
        }
      }

      if (checklistChange) {
        checklistChange(scope);
      }
    });
    
    // declare one function to be used for both $watch functions
    function setChecked(newArr, oldArr) {
        scope[attrs.ngModel] = contains(newArr, value, comparator);
    }

    // watch original model change
    // use the faster $watchCollection method if it's available
    if (angular.isFunction(scope.$parent.$watchCollection)) {
        scope.$parent.$watchCollection(checklistModel, setChecked);
    } else {
        scope.$parent.$watch(checklistModel, setChecked, true);
    }
  }

  return {
    restrict: 'A',
    priority: 1000,
    terminal: true,
    scope: true,
    compile: function(tElement, tAttrs) {
      if ((tElement[0].tagName !== 'INPUT' || tAttrs.type !== 'checkbox')
          && (tElement[0].tagName !== 'MD-CHECKBOX')
          && (!tAttrs.btnCheckbox)) {
        throw 'checklist-model should be applied to `input[type="checkbox"]` or `md-checkbox`.';
      }

      if (!tAttrs.checklistValue && !tAttrs.value) {
        throw 'You should provide `value` or `checklist-value`.';
      }

      // by default ngModel is 'checked', so we set it if not specified
      if (!tAttrs.ngModel) {
        // local scope var storing individual checkbox model
        tAttrs.$set("ngModel", "checked");
      }

      return postLinkFn;
    }
  };
}]);


/*Prototype for Cart service*/
function ShoppingCart(cartName) {
    this.cartName = cartName;
    this.clearCart = false;
    this.checkoutParameters = {};
    this.items = [];
    this.skuArray = [];
    this.totalWeight = 0;
    // load items from local storage when initializing
    this.loadItems();
}

//----------------------------------------------------------------
// items in the cart
function CartItem(sku, name, slug, mrp, price, quantity, image, category, size, weight) {
    // console.log(size);
    this.sku = sku;
    this.name = name;
    this.slug = slug;
    this.image = image;
    this.category = category;
    this.size = size;
    this.mrp = mrp;
    this.price = price * 1;
    this.quantity = quantity * 1;
    this.weight = weight * 1;
    this.status = 0;
}

// load items from local storage
ShoppingCart.prototype.loadItems = function () {
    var items = localStorage !== null ? localStorage[this.cartName + '_items'] : null;
    if (items !== null && JSON !== null) {
        try {
            items = JSON.parse(items);
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.sku !== null && item.name !== null && item.price !== null) {
                    item = new CartItem(item.sku, item.name, item.slug, item.mrp, item.price, item.quantity, item.image, item.category, item.size, item.weight, item.status);
                    this.items.push(item);
                    this.skuArray.push(item.sku);
                    // this.totalWeight = item.weight;
                }
            }

        } catch (err) {
            // ignore errors while loading...
        }
    }
};
// save items to local storage
ShoppingCart.prototype.saveItems = function () {
    if (localStorage !== null && JSON !== null) {
        localStorage[this.cartName + '_items'] = JSON.stringify(this.items);
    }
};

// adds an item to the cart
ShoppingCart.prototype.addItem = function (product, quantity) {
    // sku, name, slug, mrp, price, quantity, image, category, size, weight
    quantity = this.toNumber(quantity);
    if (quantity !== 0) {
        // update quantity for existing item
        var found = false;
        for (var i = 0; i < this.items.length && !found; i++) {
            var item = this.items[i];
            if (item.sku === product.sku) {
                found = true;
                item.quantity = this.toNumber(this.toNumber(item.quantity) + quantity);
                if (item.weight == null) {
                    item.weight = 0;
                }
                // console.log(quantity,item.weight);
                // this.totalWeight += this.toNumber(quantity * this.toNumber(item.weight));
                if (item.quantity <= 0) {
                    this.items.splice(i, 1);
                    this.skuArray.splice(i, 1);
                }
            }
        }

        // new item, add now
        if (!found) {
            var itm = new CartItem(product.sku, product.name, product.slug, product.mrp, product.price, product.quantity, product.image, product.category, product.size, product.weight, 0);
            this.items.push(itm);
            this.skuArray.push(itm.sku);
        }

        // save changes
        this.saveItems();
    }
};
// get the total price for all items currently in the cart
ShoppingCart.prototype.getTotalCount = function (sku) {
    
    var count = 0;
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (sku === undefined || item.sku === sku) {
            count += this.toNumber(item.quantity);
        }
    }
    return count;
};
// get the total price for all items currently in the cart
ShoppingCart.prototype.getTotalPrice = function (sku) {
  var total = 0;
  for (var i = 0; i < this.items.length; i++) {
    var item = this.items[i];
    if (sku === undefined || item.sku === sku) {
      total += this.toNumber(item.quantity * item.price);
    }
  }
  return total;
};
// clear the cart
ShoppingCart.prototype.clearItems = function () {
    this.items = [];
    this.skuArray = [];
    this.saveItems();
};

ShoppingCart.prototype.toNumber = function (value) {
    value = value * 1;
    return isNaN(value) ? 0 : value;
};