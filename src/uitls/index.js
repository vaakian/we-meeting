import MD5 from 'js-md5';
export const enumerateDevices = () => {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        if (devices.length) {
          let audio = devices.filter(device => device.kind === 'audioinput').length > 0;
          let video = devices.filter(device => device.kind === 'videoinput').length > 0;
          console.log(devices);
          resolve({ audio, video });
        } else {
          reject('zero device was found')
        }
      }).catch(err => reject(err))
  })
}


export const randomName = () => {
  const names = [
    '杨幂', '李易峰', '李宇春', '张靓颖', '周笔畅', '韩雪', '范冰冰', '赵薇', '马苏', '李小璐', '刘涛', '林依晨', '陈乔恩', '容祖儿', '林心如', '杨丞琳', '应采儿', '羽泉', '秦岚', '何炅', '谢娜', '张杰', '魏晨', '韩庚', '刘德华', '吴尊', '郑元畅', '林俊杰', '陈浩民', '阮经天', '唐嫣', '刘诗诗', '吴昕', '郑爽', '古力娜扎', '那英', '白百何', '胡歌', '周杰伦', '罗志祥', '陈奕迅', '潘玮柏', '李晨', '李维嘉', '杜海涛', '陈小春', '陈翔', '成龙', '吴奇隆', '汪峰', '钟汉良', '孙怡', '欧阳娜娜', '杨紫', '邓伦', '郑合惠子', '白敬亭', '陈学冬', '钱枫', '大张伟', '汪涵', '王一博', '迪丽热巴', '赵丽颖', '盛一伦', '郑业成', '安悦溪', '王俊凯', '易烊千玺', '王源', '宋小回宝', '张艺兴', '黄渤', '王迅', '王宝强', '王祖蓝', '蔡徐坤', '陈立农', '张大大', '华晨宇', '黄子韬', '王鹤棣', '沈月', '官鸿', '吴希泽', '梁靖康', '武艺', '徐海乔', '马天宇', '江疏影', '井柏然', '杨祐宁', '吴映洁', '陈赫', '黄晓明', '舒淇', '苏有朋', '白举纲', '邓超', '郑恺', '霍建华', '马可答', '冯绍峰', '谭松韵', '熊梓淇', '张丹峰', '薛之谦', '刘宪华', '佟丽娅', '孙红雷', '胡一天', '阚清子', '纪凌尘', '毛晓彤', '关晓彤', '鹿晗', '王传君', '马思超', '马思纯', '王珂', '贾乃亮', '罗晋']
  return names[Math.floor(Math.random() * names.length)];
}

export const getCurrentTime = () => {
  const date = new Date();
  const hour = date.getHours();
  const min = date.getMinutes();
  return `${hour < 10 ? '0' + hour : hour}:${min < 10 ? '0' + min : min}`;
}

/**
 * Created by daizengyu on 2019-09-05.
 */

const toString = Object.prototype.toString;
const nativeIsArray = Array.isArray;

const assert = (condition, msg) => {
  if (!condition)
    throw new Error(`assert failed, ${msg}`);
}

const isString = target => typeof target === 'string';

const isObject = obj => obj && typeof obj === 'object';

const isArray = nativeIsArray || ((obj) => toString.call(obj) === '[object Array]');

const isEmpty = obj => [Array, Object].includes((obj || {}).constructor) && !Object.keys(obj).length;

const debounce = (fn, delay) => {
  let timer = null;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  }
};

const hashColor = str => {
  return '#' + MD5(str).substr(8, 6);
}

export {
  assert,
  isString,
  isObject,
  isArray,
  isEmpty,
  debounce,
  hashColor
};
