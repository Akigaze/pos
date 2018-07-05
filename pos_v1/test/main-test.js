'use strict';

describe('测试条形码集合的格式化', () => {
  it('spiltBarcode函数将“ITEM000003-2.5”形式的条形码格式化为{barcode：ITEM000003，count：2.5}的形式', () => {
    const tag = 'ITEM000003-2.5';
    const barcodeObj=spiltBarcode(tag);
    const exceptObj=JSON.stringify({barcode:"ITEM000003",count:2.5});
    expect(exceptObj).toBe(JSON.stringify(barcodeObj));
  });

  it('formatCartBarcode函数进行格式化后的条形码要满足{barcode：，count：}的形式', () => {
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
    const barcodes=formatCartBarcode(tags);
    const test_index=5;
    const expect_barcode = "ITEM000003";
    const expect_count = 2.5;
    expect(expect_barcode).toBe(barcodes[5].barcode);
    expect(expect_count).toBe(barcodes[5].count);
  });
});

describe('测试统计每种条形码的数量', () => {
  it('countMyCart函数统计每一种条形码的数量，并封装成对象集合', () => {
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
    const barcodeItems=countMyCart(barcodeObjItems);
    const test_index=2;
    const expect_barcode = {barcode: "ITEM000005", count: 3};
    expect(JSON.stringify(expect_barcode)).toBe(JSON.stringify(barcodeItems[test_index]));
  });
});


describe('pos', () => {

  it('should print text', () => {

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
