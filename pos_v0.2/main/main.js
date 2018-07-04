'use strict';

function printReceipt(inputs) {
  //console.log('统计购物车商品的数量');
  let myGoods=countMyCart(inputs);
  //console.log('获取商场商品的信息');
  const allGoods=loadAllItems();
  //console.log('整理购物车中商品的信息');
  myGoods=getMsgOfMyGoods(myGoods,allGoods);
  //console.log('计算购买的每一类商品的总价');
  myGoods=getTotalPriceOfGood(myGoods);
  //console.log('计算订单总价');
  const pay=countTotalPrice(myGoods);
  //console.log('打印收据');
  print(pay,myGoods);

}
//统计购物车中各类商品的数量
function countMyCart(inputs) {
  const myGoods=[];
  for (let i = 0; i < inputs.length; i++) {
    let good={barcode:inputs[i],count:1};
    for (let j = i+1; j < inputs.length; j++) {
      if (inputs[i]===inputs[j]) {
        good.count++;
      }else{
        i=j-1;
        break;
      }
    }
    myGoods.push(good);
  }
  //console.log(myGoods);
  return myGoods;
}
//整理购物车中商品的信息
function getMsgOfMyGoods(myGoods,allGoods) {
  for(let buy of myGoods){
    for (let good of allGoods) {
      if (buy.barcode===good.barcode) {
        buy.name=good.name;
        buy.unit=good.unit;
        buy.price=good.price;
        break;
      }
    }
  }
  return myGoods;
}
//计算购买的每一类商品的总价
function getTotalPriceOfGood(myGoods) {
  for(let buy of myGoods){
    buy.totalPrice=buy.price*buy.count;
  }
  return myGoods;
}
//计算订单总价
function countTotalPrice(myGoods) {
  let pay=0;
  for (let buy of myGoods) {
    pay+=buy.totalPrice;
  }
  return pay;
}
//打印收据
function print(pay,myGoods) {
  let receipt="***<没钱赚商店>收据***\n";
  for (let buy of myGoods){
    receipt+="名称："+buy.name+"，数量："+buy.count+buy.unit+"，单价："+(buy.price).toFixed(2)+"(元)，小计："+(buy.totalPrice).toFixed(2)+"(元)\n";
  }
  receipt+="----------------------\n";
  receipt+="总计："+pay.toFixed(2)+"(元)\n";
  receipt+="**********************";
  console.log(receipt);
}
