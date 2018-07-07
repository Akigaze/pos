'use strict';
const {calTotalAndSaved,calSubtotal,getReceiptItemMsg,spiltBarcode,countBarcodeNum,formatCartBarcodeList,printReceipt}=require("../main/main");
describe('测试条形码集合的格式化', () => {
  it('spiltBarcode函数将“ITEM000003-2.5”形式的条形码格式化为{barcode：ITEM000003，count：2.5}的形式', () => {
    const tag = 'ITEM000003-2.5';
    const barcodeObj=spiltBarcode(tag);
    const exceptObj=JSON.stringify({barcode:"ITEM000003",count:2.5});
    expect(exceptObj).toBe(JSON.stringify(barcodeObj));
  });

  it('formatCartBarcodeList函数进行格式化后的条形码要满足{barcode：，count：}的形式', () => {
    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];
    const barcodes=formatCartBarcodeList(tags);
    const test_index=5;
    const expect_barcode = "ITEM000003";
    const expect_count = 2.5;
    expect(expect_barcode).toBe(barcodes[5].barcode);
    expect(expect_count).toBe(barcodes[5].count);
  });
});

describe('测试统计每种条形码的数量', () => {
  it('countBarcodeNum函数统计每一种条形码的数量，并封装成对象集合', () => {
    const barcodeObjItems = [
      {barcode:"ITEM000001",count:1},
      {barcode:"ITEM000001",count:1},
      {barcode:"ITEM000001",count:1},
      {barcode:"ITEM000001",count:1},
      {barcode:"ITEM000001",count:1},
      {barcode:"ITEM000003",count:2.5},
      {barcode:"ITEM000005",count:1},
      {barcode:"ITEM000005",count:2}
    ];
    const barcodeItems=countBarcodeNum(barcodeObjItems);
    const test_index=2;
    const expect_barcode = {barcode: "ITEM000005", count: 3};
    expect(JSON.stringify(barcodeItems[test_index])).toBe(JSON.stringify(expect_barcode));
  });
});

describe('测试丰富清单中每一种商品的信息的函数', () => {
  it('getReceiptItemMsg函数根据所有商品的信息，完善清单中每一个商品的基本信息', () => {
    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];
    const barcodeObjList=formatCartBarcodeList(tags);
    const receiptItems=countBarcodeNum(barcodeObjList);
    getReceiptItemMsg(receiptItems);
    const test_index=2;
    const expect_receipt_item = {barcode: "ITEM000005", count: 3, name: "方便面", unit: "袋", price: 4.5};
    expect(JSON.stringify(expect_receipt_item)).toBe(JSON.stringify(receiptItems[test_index]));
  });
});

describe('测试计算每种商品优惠后的小计', () => {
  it('calTotalAndSaved函数先判断商品是否满足优惠条件，再计算优惠后的小计', () => {
    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];
    const barcodeObjList=formatCartBarcodeList(tags);
    const receiptItems=countBarcodeNum(barcodeObjList);
    getReceiptItemMsg(receiptItems);
    const receipt=calSubtotal(receiptItems);
    const test_index=2;
    const expect_subtotal = '9';
    expect(JSON.stringify(receipt.items[test_index].subtotal)).toBe(expect_subtotal);
  });
});

describe('测试计算订单总价和节省金额', () => {
  it('discount函数先判断商品是否满足优惠条件，再计算优惠后的总价', () => {
    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];
    const barcodeObjList=formatCartBarcodeList(tags);
    const receiptItems=countBarcodeNum(barcodeObjList);
    getReceiptItemMsg(receiptItems);
    const receipt=calSubtotal(receiptItems);
    calTotalAndSaved(receipt);
    const expect_tatal= 58.50;
    const expect_saved= 7.50;
    expect(receipt.total).toBe(expect_tatal);
    expect(receipt.saved).toBe(expect_saved);

  });
});

describe('pos', () => {

  it('should print text收据内容', () => {

    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];

    spyOn(console, 'log');

    printReceipt(tags);

    const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：58.50(元)
节省：7.50(元)
**********************`;

    expect(console.log).toHaveBeenCalledWith(expectText);
  });
});
