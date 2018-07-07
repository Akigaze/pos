'use strict';

function printReceipt(cart) {
  //格式化条形码的字符串集合,转化为{barcode：，count：}
  const barcodeObjList=formatCartBarcodeList(cart);
  //统计商品数量  15'
  let receiptItems=countBarcodeNum(barcodeObjList);
  //获得购买的商品的信息  4'
  getReceiptItemMsg(receiptItems);
  //计算每种商品优惠后的小计，并生成收据对象
  const receipt=calSubtotal(receiptItems);
  //计算订单总价和节省金额  3'
  calTotalAndSaved(receipt);
  //生成收据内容字符串  5'
  const receiptString=generateReceiptString(receipt);
  //打印收据
  console.log(receiptString);
}
//格式化条形码的字符串集合,转化为{barcode：，count：}
function formatCartBarcodeList(barcodeList){
  const barcodeObjList=[];
  for (let barcode of barcodeList) {
    barcodeObjList.push(formatBarcode(barcode));
  }
  return barcodeObjList;
}
//对一个购物车中的条形码进行格式化为对象
function formatBarcode(code) {
  let barcodeObj={barcode:code,count:1};
  //如果存在“-”，则需要切割
  if (code.indexOf('-')!==-1)
    barcodeObj=spiltBarcode(code);
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
function countBarcodeNum(barcodeObjList){
  const receiptItems=[];
  for (let barcodeObj of barcodeObjList) {
    let item=findItemByBarcode(barcodeObj,receiptItems,obj=>obj.barcode)
    if(item!==null)
      item.count+=barcodeObj.count;
    else
      receiptItems.push(barcodeObj);
  }
  //console.info("--------------------\n");
  //console.info(receiptItems);
  return receiptItems;
}
//判断清单商品列表中是否已经存在某个条形码
function findItemByBarcode(barcodeObj,receiptItems,getAttr){
  for (let item of receiptItems) {
    if (getAttr(barcodeObj)===getAttr(item))
      return item;
  }
  return null;
}
//获得购买的商品的信息  4'
function getReceiptItemMsg(items){
  const allGoods=loadAllItems();
  for (let item of items) {
    let good=findItemByBarcode(item,allGoods,obj=>obj.barcode)
    if (good!==null) {
      item.name=good.name;
      item.unit=good.unit;
      item.price=good.price;
    }
  }
  console.info(items);
}


//计算每种商品优惠后的小计，并生成收据对象
function calSubtotal(items) {
  for (let item of items) {
    const promotions=loadPromotions();
    item.subtotal=item.count*item.price;
    if (isPromote(promotions,item)) {
      item.subtotal=(item.count-Math.floor(item.count/3))*item.price;
    }
  }
  const receipt={items};
  return receipt;
}
//判断商品是否参与优惠活动
function isPromote(promotions,item){
  let promote=false;
  for (let promotion of promotions) {
    if(promotion.type!=="BUY_TWO_GET_ONE_FREE"){
      continue;
    }
    for (let barcode of promotion.barcodes) {
      if (item.barcode===barcode&&item.count>=3) {
        promote=true;
        break;
      }
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
    after+=item.subtotal;
  }
  receipt.total=after;
  receipt.saved=before-after;
}
//生成收据内容字符串
function generateReceiptString(receipt) {
  let receiptString="***<没钱赚商店>收据***\n";
  for (let item of receipt.items){
    receiptString+="名称："+item.name+"，数量："+item.count+item.unit+"，单价："+(item.price).toFixed(2)+"(元)，小计："+(item.subtotal).toFixed(2)+"(元)\n";
  }
  receiptString+="----------------------\n";
  receiptString+="总计："+(receipt.total).toFixed(2)+"(元)\n";
  receiptString+="节省："+(receipt.saved).toFixed(2)+"(元)\n";
  receiptString+="**********************";
  return receiptString;
}
