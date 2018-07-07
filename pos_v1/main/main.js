'use strict';

function printReceipt(cart) {
  //console.log('hello');
  //格式化条形码的字符串集合,转化为{barcode：，count：}
  const cartBarcodes=formatCartBarcode(cart);
  console.info(JSON.stringify(cartBarcodes));
  //统计商品数量  15'
  let receiptItems=countMyCart(cartBarcodes);
  console.info(receiptItems);
  //获取所有商品的信息  1'
  const allGoods=loadAllItems();
  //获得购买的商品的信息  4'
  getReceiptItemMsg(receiptItems,allGoods);
  //计算每种商品优惠后的小计  5'
  const receipt=discount(receiptItems);
  //计算订单总价和节省金额  3'
  calTotalAndSaved(receipt);
  //生成收据内容字符串  5'
  const receiptString=generateReceiptString(receipt);
  //打印收据
  console.log(receiptString);
}
//格式化条形码的字符串集合,转化为{barcode：，count：}
function formatCartBarcode(barcodeList){
  const barcodeObjList=[];
  for (let barcode of barcodeList) {
    barcodes.push(formatBarcode(barcode));
  }
  return barcodes;
}
//对一个购物车中的条形码进行格式化为对象
function formatBarcode(code) {
  let barcodeObj={barcode:code,count:1};
  //如果存在“-”，则需要切割
  if (code.indexOf('-')!==-1) {
    barcodeObj=spiltBarcode(item)
  }
  return barcodeObj;
}
//切割含有“-”的条形码，获得具体的条形码和数量
function spiltBarcode(code) {
  let index=code.indexOf('-');
  let barcode=code.slice(0,index);
  let count=parseFloat(code.slice(index+1));
  return {barcode,count};
}
//统计商品数量
function countMyCart(cartBarcodes){
  const receiptItems=[];
  for (let barcodeObj of cartBarcodes) {
    let tempBarcode=null;
    for (let receiptItem of receiptItems) {
      if (receiptItem.barcode===barcodeObj.barcode) {
        receiptItem.count+=barcodeObj.count;
        tempBarcode=receiptItem;
        break;
      }
    }
    if (tempBarcode===null) {
      receiptItems.push(barcodeObj);
    }
  }
  return receiptItems;
}
//获得购买的商品的信息  4'
function getReceiptItemMsg(items,goods){
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
  console.info(items);
  return items;
}
//计算每种商品优惠后的总价
function discount(items) {
  for (let item of items) {
    const promotions=loadPromotions();
    for (let promotion of promotions) {
      if(promotion.type!=="BUY_TWO_GET_ONE_FREE"){
        continue;
      }
      item.discount=item.count*item.price;
      if (isPromote(promotion,item)) {
        item.discount=(item.count-Math.floor(item.count/3))*item.price;
      }
    }
  }
  const receipt={items}
  console.info(JSON.stringify(receipt.items));
  return receipt;
}
//判断商品是否参与优惠活动
function isPromote(promotion,item){
  let promote=false;
  for (let barcode of promotion.barcodes) {
    if (item.barcode===barcode&&item.count>=3) {
      promote=true;
      break;
    }
  }
  return promote;
}
//计算订单总价和节省金额
function calTotalAndSaved(receipt) {
  let after=0;
  let before=0;
  for(let item of receipt.items){
    before+=item.count*item.price;
    after+=item.discount;
  }
  receipt.total=after;
  receipt.saved=before-after;
  console.info({saved:before-after,after});
}
//生成收据内容字符串
function generateReceiptString(receipt) {
  let receiptString="***<没钱赚商店>收据***\n";
  for (let item of receipt.items){
    receiptString+="名称："+item.name+"，数量："+item.count+item.unit+"，单价："+(item.price).toFixed(2)+"(元)，小计："+(item.discount).toFixed(2)+"(元)\n";
  }
  receiptString+="----------------------\n";
  receiptString+="总计："+(receipt.total).toFixed(2)+"(元)\n";
  receiptString+="节省："+(receipt.saved).toFixed(2)+"(元)\n";
  receiptString+="**********************";
  console.info(receiptString);
  return receiptString;
}
