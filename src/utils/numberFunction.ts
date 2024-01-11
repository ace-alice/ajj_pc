export function toFixed2(num: string | number, isNum = true) {
  const str = Number(num);
  if (str >= 100000000) {
    return (isNum ? Number((str / 100000000).toFixed(2)) : (str / 100000000).toFixed(2)) + '亿';
  } else if (str >= 10000) {
    return (isNum ? Number((str / 10000).toFixed(2)) : (str / 10000).toFixed(2)) + '万';
  } else {
    return str || str === 0 ? str.toFixed(2) : num;
  }
}

export function priceToFixed(price: string | number) {
  const str = Number(price);
  return str || str === 0 ? str.toFixed(2) : price;
}

/**
 * 处理银行卡号
 */
export function dealWithCardNumber(row: string | number) {
  const str = String(row);
  const str1 = str.substring(0, 4);
  const str2 = str.substring(str.length - 4, str.length);
  return str1 + ' **** **** ' + str2;
}

/**
 * 手机号处理
 */
export function phoneHandling(row: string | number) {
  let str = String(row);
  str = str.substring(0, 3) + '****' + str.substring(str.length - 4, str.length);
  return str;
}
