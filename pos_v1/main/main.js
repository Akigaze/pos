'use strict';

function printReceipt(cart) {
  //统计商品数量  15'
  let items=countMyCart(cart);
  //获取所有商品的信息  1'
  const goods=loadAllItems();
  //获得购买的商品的信息  4'
  getItemsMsg(items,goods);
  //计算每种商品的总价  1'
  getTotalPrice(items);
  //计算每种商品优惠后的总价  5'
  discount(items,2,1);
  //计算订单优惠前后的总价  3'
  let pay=getPay(items);
  //计算优惠节省的金额  1'
  let save=pay.before-pay.after;
  //打印收据  5'
  print(pay,save,items);
}
  //统计商品数量
  function countMyCart(cart){
    const items=[];
    let diffIndex=cart.length;
    //是否已存在与当前字符不同的字符，默认为false,即默认所有字符都一样
    let diff=false;
    for (let i = 0; i < cart.length; i++) {
      let item={barcode:"",count:0};
      if (cart[i].indexOf('-')!==-1) {
        item=spiltBarcode(cart[i]);
      }else {
        item.barcode=cart[i];
        item.count=1;
      }
      for (let j = i+1; j < cart.length; j++) {
        if (cart[j].indexOf('-')!==-1) {
          let temp=spiltBarcode(cart[j]);
          if (item.barcode===temp.barcode) {
            item.count+=temp.count;
            continue;
          }
        }
        if (cart[j]===item.barcode) {
          item.count++;
          continue;
        }
        if (!diff) {
          diff=true;
          diffIndex=j;
        }
      }
      i=diffIndex-1;
      items.push(item);
      diff=false;
      diffIndex=cart.length;
    }
    return items;
  }
  //切割含有“-”的条形码，获得具体的条形码和数量
  function spiltBarcode(code) {
    let item={barcode:"",count:0};
    let index=code.indexOf('-');
    item.barcode=code.slice(0,index);
    item.count=parseFloat(code.slice(index+1));
    return item;
  }
  //获得购买的商品的信息  4'
  function getItemsMsg(items,goods){
    for (let item of items) {
      for (let good of goods) {
        if (item.barcode===good.barcode) {
          item.name=good.name;
          item.unit=good.unit;
          item.price=good.price;
          break;
        }
      }
    }
    return items;
  }
//计算每种商品的总价
function getTotalPrice(items) {
  for (let item of items) {
    item.totalPrice=item.count*item.price;
  }
}
//计算每种商品优惠后的总价
function discount(items,man,zeng) {
  for (let item of items) {
    item.discount=item.totalPrice;
    if (item.count>=man+zeng) {
      item.discount=(item.count-zeng)*item.price;
    }
  }
}
//计算订单优惠前后的总价
function getPay(items) {
  let aft=0;
  let bef=0;
  for(let item of items){
    bef+=item.totalPrice;
    aft+=item.discount;
  }
  return {before:bef,after:aft};
}
//打印收据
function print(pay,save,myGoods) {
  let receipt="***<没钱赚商店>收据***\n";
  for (let buy of myGoods){
    receipt+="名称："+buy.name+"，数量："+buy.count+buy.unit+"，单价："+(buy.price).toFixed(2)+"(元)，小计："+(buy.discount).toFixed(2)+"(元)\n";
  }
  receipt+="----------------------\n";
  receipt+="总计："+(pay.after).toFixed(2)+"(元)\n";
  receipt+="节省："+save.toFixed(2)+"(元)\n";
  receipt+="**********************";
  console.log(receipt);
}
