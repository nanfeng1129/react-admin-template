import axios from "axios";
import qs from "qs";
import { message } from 'antd'
// import router from '@/router'
// import store from '@/store'
import { RESP_CODE } from '../constants/common';
import { type } from "@testing-library/user-event/dist/type";
// const sm4 = require('sm-crypto').sm4

//判断省份是否正确
function checkProv(val) {
  let pattern = /^[1-9][0-9]/;
  let provs = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门"};
  if(pattern.test(val)) {
    if(provs[val]) {
      return true;
    }
  }
  return false;
}

//判断出生年月是否正确
function checkDate(val) {
  let pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/;
  if(pattern.test(val)) {
    let year = val.substring(0, 4);
    let month = val.substring(4, 6);
    let date = val.substring(6, 8);
    let date2 = new Date(year+"-"+month+"-"+date);
    if(date2 && date2.getMonth() == (parseInt(month) - 1)) {
      return true;
    }
  }
  return false;
}

//判断校验码是否正确
function checkCode(val) {
    let p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    let factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
    let parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
    let code = val.substring(17);
    if(p.test(val)) {
        let sum = 0;
        for(let i=0;i<17;i++) {
            sum += val[i]*factor[i];
        }
        if(parity[sum % 11] == code.toUpperCase()) {
            return true;
        }
    }
    return false;
}
function getCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]);
    return null;
}

axios.defaults.withCredentials = true;
const CancelToken = axios.CancelToken;
const source = CancelToken.source();


const Noloading = (config) => {
    const noLoadingParmas = [
      {
        path:[ "/data/dashboard", "/cust/custAddCust", '/cust/addCust' ],//path内所有路由里,url所有接口都不加入loading
        url:['/cus/queryCityForCus','/dict/querypartnerinfo','/cus/queryexpuserinfo',]
      }
    ]
    const dealLoading=()=>{
      let newLoading = true
      noLoadingParmas.forEach(item=>{
        let pathLoading = true;
        let urlLoading = true;
        let noUrlLoading = false;
        if(item.path&&item.path.length>0){
            pathLoading = false
            item.path.forEach(pathItem=> pathLoading = pathLoading||window.location.pathname.includes(pathItem))
        }
        if(item.url&&item.url.length>0&&config&&config.url){
            urlLoading = false
            item.url.forEach(urlItem=> urlLoading = urlLoading||config.url.includes(urlItem) )
        }
        if(item.noUrl&&item.noUrl.length>0&&config&&config.url){
            noUrlLoading = true
            item.noUrl.forEach(noUrlItem=> noUrlLoading = noUrlLoading||config.url.includes(noUrlItem) )
        }
        if(pathLoading&&urlLoading&&!noUrlLoading){
            newLoading =  false
        }
      })
      return newLoading
    }
    if(config.openIsLoading){//开发平台接口新加去掉弹框
        return false;
    } else if(config&&config.data) return config.data._close_loading_?false:dealLoading()
    else if(config&&config.params) return config.params._close_loading_?false:dealLoading()
    else return false
}
axios.interceptors.request.use(
  config => {
    let mad = sessionStorage.getItem('setMicroAppData') && JSON.parse(sessionStorage.getItem('setMicroAppData')).token ? JSON.parse(sessionStorage.getItem('setMicroAppData')) : { token: '', key: '' };
    config.headers = {
        ...config.headers,
        'Authorization': mad.token,
    };
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  response => {
    if (
      response.data && (
        (response.data.code === RESP_CODE.SUCCESS) ||
        (response.data.code === '000000') ||
        // (response.request.responseType === 'blob') ||
        (response.request.responseType === 'arraybuffer') ||
        (response.config && response.config.url && response.config.url.includes('/agent/editAgentStat'))
      )
    ) {
      return response;
    }
    if (response.request.responseType === 'blob') {
      let typeCount = {
          type: 'application/octet-stream',
      }
      let blob = new Blob([response.data], typeCount)
      const fileReader = new FileReader()
      fileReader.readAsText(blob, 'utf-8')
      fileReader.onload = function () {
        try {
          let result = JSON.parse(fileReader.result) //正常文件流的话JSON.parse会抛异常到catch
          if (typeof result == 'object' && result) {
            if (RESP_CODE.NO_LOGIN === result.code) {
              //认证失败或登录信息失效，请退出重新登录
              setTimeout(() => {
                message.error('未登录或未认证')
              }, 500)
            } else if(RESP_CODE.SUCCESS !== result.code){//当返回code为未成功时方才弹窗
              let msg = result.subMsg ? result.subMsg : result.msg
              message.error(msg)
            }
          }
        } catch (e) { }
      }
      return response
    }
    if (response.data && RESP_CODE.SUCCESS !== response.data.code) {
      // console.log('有误')
      if (RESP_CODE.ERROR_403 === response.data.code) {
        //没有权限进行此操作
        setTimeout(() => {
          message.error(response.data.message)
        }, 500)
      } else if (RESP_CODE.NO_LOGIN === response.data.code) {
        //认证失败或登录信息失效，请退出重新登录
        setTimeout(() => {
          message.error(response.data.msg || response.data.message)
          // let microAppData = store.getters['common-store/microAppData'];
          // microAppData.logout();
        }, 500)
      } else {
        response.data.message && message.error(response.data.message)
      }
    }
    return response;
  },
  error => {
    const { response: { status } } = error

    if (status === 502 || status === 500) {
      let { data } = error.response;
      let tid = data.tid ? data.tid : '';
      let text = `${data.msg ? data.msg : '后台超时...请过会儿再试！'}${tid ? `错误编码：${tid}` : ''}`;
      message.error(text);
    }
    if (status === 504) {
      message.error('请求超时...已提交管理员!');
    }
    if (status === 401) {
      //alert('登录已过期')
      console.log('401登录已过期');
      let tips = '登录已过期';
      if (error.response.data.error === RESP_CODE.ERROR_PWD_WORING) {
        tips = '用户名或密码错误';
      } else if (error.response.data.error === RESP_CODE.ERROR_TOKEN_INVALID) {
        tips = '登录已过期';
      }
    }
    if (status === 404) {
      setTimeout(() => {
        message.error('404资源不存在！');
      }, 100)
    }
    if (status === 400) {
      message.error(error.response.data.message);
    }
    return error.response;
  }
)

export default {
    //判断是否是数值型
    isNumber(val) {
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if (regPos.test(val) || regNeg.test(val)) {
            return true;
        } else {
            return false;
        }
    },
    /*  code转换名称 */
    codeToName(list, code) {
        // console.log(code)
        if(this.isValidate(code)&&list&&list.length>0){
            let arr = list.filter(item =>
                item.val === code
                ||(code.text&&item.val === code.text)
                ||item.value === code
                ||item.VAL === code
            );
            if (arr.length === 0) {
                return '---'
            } else {
                return this.isValidate(arr[0].title)?arr[0].title:arr[0].TEXT||arr[0].label;
            }
        }else{
            return '---';
        }
    },
    //字符串转数值型
    toNumber(str) {
        return this.isNumber(str) ? Number(str) : 0;
    },
    //判断非空
    isValidate(obj) {
        return obj !== null && obj !== "" && obj !== undefined;
    },

    //判断数组
    isValidateArr(arr) {
        return arr !== null && arr !== undefined && arr.length > 0&& arr !== [];
    },
    //将url里的参数解析成json对象
    convertUrlToJSON(urlData) {
        let field = urlData.split('&');

        let res = {};
        for (let i = 0, len = field.length; i < len; i++) {
            let temp = field[i].split('=');
            res[temp[0]] = temp[1];
        }
        return res;
    },

    // 发送get请求
    axiosGet(url, params, project = '',_close_loading_ = false) {
        let loginuser = this.getLoginUser();
        return axios.get(`/${project}${url}`, { params: { ...params, loginuser,_close_loading_} });
    },
    //发送post非json请求（如二进制文件等）
    axiosPostFile(url, data, project = '') {
        axios.create({ headers: { 'content-type': 'application/x-www-form-urlencoded' } });
        return axios.post(`/${project}${url}`, data);
    },
    //发送post请求
    axiosPost(url, data, project = '',_close_loading_ = false) {
        let loginuser = this.getLoginUser();
        axios.create({ headers: { 'content-Type': 'application/json;charset=UTF-8' } });
        return axios.post(`/${project}${url}`, { cancelToken: source.token, ...data, loginuser,_close_loading_});
    },
    //发送post请求
    axiosPostQS(url, data, project = '') {
        axios.create({ headers: { 'content-type': 'application/x-www-form-urlencoded' } });
        data = qs.stringify(data, { arrayFormat: 'indices', allowDots: true });
        return axios.post(`/${project}${url}`, data);
    },
    //发送post请求
    axiosPostORG(url, data, project = '') {
        axios.create({ headers: { 'content-type': 'application/x-www-form-urlencoded' } });
        data = qs.stringify(data);
        return axios.post(`/${project}${url}`, data);
    },
    // 发送put请求
    axiosPut(url, data, project = '') {
        axios.create({ headers: { 'content-Type': 'application/json;charset=UTF-8' } });
        return axios.put(`/${project}${url}`, data);
    },
    // 发送delete请求
    axiosDelete(url, project = '') {
        return axios.delete(`/${project}${url}`);
    },
    //发送post请求,下载文件，后台以文件流形式返回时，调用这个方法
    axiosPostDown(url, data, project = '') {
        let loginuser = this.getLoginUser();
        axios.create({ headers: { 'content-Type': 'application/json;charset=UTF-8' } });
        return axios({
            url: `/${project}${url}`,
            method: "POST",
            data:{
                cancelToken: source.token,
                ...data,
                loginuser
            },
            responseType:'blob',
        })
    },
    axiosGetDown(url, data, project = '') {
        let loginuser = this.getLoginUser();
        axios.create({ headers: { 'content-Type': 'application/json;charset=UTF-8' } });
        return axios({
            url: `/${project}${url}`,
            method: "GET",
            params:{
                cancelToken: source.token,
                ...data,
                loginuser
            },
            responseType:'blob',
        })
    },
    //上传文件
    axiosPostFilePC(url, data, project = '') {
        axios.create({ headers: { 'Content-Type': 'multipart/form-data' } });
        return axios.post(`/${project}${url}`, data);
    },

    //身份证校验
    checkIdCard(val) {
        if(checkCode(val)) {
            let date = val.substring(6,14);
            if(checkDate(date)) {
                if(checkProv(val.substring(0,2))) {
                    return true;
                }
            }
        }
        return false;
    },

    //校验手机号
    checkIsMobile(phoneNum) {
        //let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[3-8]{1})|(18[0-9]{1})|(19[0-9]{1})|(14[5-7]{1}))+\d{8})$/;
        let reg = /^1[345789]\d{9}$/;
        if (reg.test(phoneNum) === false) {
            return false;
        }
        return true;
    },

    isUrl(rule, value, callback) {
        //console.log(value)
        if (value == null || value.length === 0) {
            callback();
        } else {
            let strRegex = new RegExp();
            strRegex.compile('^(([\\w-]+\\.)+[\\w-]+(\\/[\\w-./?%&=]*)?$)');
            let strRegex2 = new RegExp();
            strRegex2.compile('^((https|http|ftp|rtsp|mms)?://)');
            if (strRegex.test(value) || strRegex2.test(value)) {
                callback();
            } else {
                callback("网址格式不正确,请重新输入");
            }
        }

    },

    isUrlWithoutHttp(rule, value, callback) {
        //console.log(value)
        if (value == null || value.length === 0) {
            callback();
        } else {
            let strRegex = new RegExp();
            // { pattern: /(http|https):\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/, message: '网址格式不正确！' }

            strRegex.compile('^(([\\w-]+\\.)+[\\w-]+(\\/[\\w-./?%&=]*)?$)');
            let strRegex1 = new RegExp();
            strRegex1.compile('^((http|https):\\/\\/([\\w-]+\\.)+[\\w-]+(\\/[\\w-./?%&=]*)?$)');

            if (strRegex.test(value) || strRegex1.test(value)) {
                callback();
            } else {
                callback("网址格式不正确，请重新输入");
            }
        }

    },

    //验证身份证号
    isIDCardNo(rule, value, callback) {
        // console.log('value' + value);
        if (!value) {
            return callback();
            // return callback(new Error('输入不可以为空'));
        }
        //15位身份证号码的基本格式校验
        var check = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test(value);

        //18位身份证号码的基本格式校验
        var check2 = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/.test(value);
        if ((!check) && (!check2)) {
            return callback(new Error('输入的身份证号错误'))
        }
        return callback()
    },

    //银行卡号校验
    checkBankId(bankId) {
        //console.log('bankId' + bankId);
        var reg = /^[0-9]+$/;
        var back = reg.test(bankId);
        if ((bankId.length < 16) || (bankId.length > 25) || !back) {
            return false;
        }
        return true;
    },
    isPwd(rule, value, callback) {
        if (value == null || value.length === 0) {
            callback();
            // callback("密码不能为空");
        } else {
            let str = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,}$/;
            let space = /\s/g;
            if (value.length < 8 || value.length > 16) {
                callback('密码长度为8-16个字符')
            } else if (str.test(value) && !space.test(value)) {
                callback();
            } else {
                callback("至少包含字母、数字及符号两种组合，不能使用空格");
            }
        }
    },

    //验证银行卡号
    isBankCardNo(rule, value, callback) {
        //console.log('value' + value);

        if (!value) {
            return callback(new Error('输入不可以为空'));
        }
        var reg = /^[0-9]+$/;
        var back = reg.test(value);
        if ((value.length < 16) || (value.length > 25) || !back) {
            return callback(new Error('输入的银行卡号错误'))

        }
        return callback()
    },
    getUrlParams(name, str) {
        const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
        const r = str.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]); return null;
    },

    //验证手机号
    isPhone(rule, value, callback) {
        if (!value) {
            // return callback(new Error('输入不可以为空'));
            return callback();
        }
        var pattern = /^1[0123456789]\d{9}$/;
        if (pattern.test(value)) {
            return callback()
        }
        return callback(new Error('输入的手机号错误'))
    },
    //金额按千位逗号分隔
    formatMoney(str, flag) {
        if (/[^0-9.]/.test(str)) return "0.00";
        if (str === null || str === "null" || str === "") return "0.00";
        str = str.toString().replace(/^(\d*)$/, "$1.");
        str = (str + "00").replace(/(\d*\.\d\d)\d*/, "$1");
        str = str.replace(".", ",");
        var re = /(\d)(\d{3},)/;
        while (re.test(str))
            str = str.replace(re, "$1,$2");
        str = str.replace(/,(\d\d)$/, ".$1");
        if (!flag) {
            var a = str.split(".");
            if (a[1] === "00") {
                str = a[0];
            }
        }
        return str;
    },
    //判断是否有权限
    hasPower(userPower, permissionUrl) {
        let cp = false;
        if (userPower && userPower.length > 0) {
            userPower.forEach(item => {
                if (permissionUrl === item.key) {
                    cp = true;
                }
            });
        }
        return cp;
    },
    judgeIsJsonStr(str){
        try {
            JSON.parse(str);
            return true
        } catch {
            return false
        }
    },
    modalAddMoveEvent(){
        //let headerArr = document.querySelector("#jiedian").querySelectorAll(".ant-modal-header");
        let contentArr = document.querySelector("#jiedian").querySelectorAll('.ant-modal-content');
        // for(let i = 0; i < contentArr.length; i++){
        //     contentArr[i].style.left = 0;
        //     contentArr[i].style.top = 0;
        // }
        for(let i = 0; i < contentArr.length; i++){
            let header = contentArr[i].querySelector('.ant-modal-header')
            header.addEventListener('mousedown', function (e) {
                let x = e.pageX;
                let y = e.pageY;
                let offsetLeft = contentArr[i].offsetLeft
                let offsetTop = contentArr[i].offsetTop
                let body = document.body;
                body.classList.add('body-select');
                //去除拖拽过程中的全选
                header.setCapture && header.setCapture();
                let cHeight = document.documentElement.clientHeight;
                // (2) 鼠标移到时，把鼠标在页面中的坐标减去鼠标在盒子内的坐标，就是模态框的left和top值
                document.addEventListener('mousemove', move)
                function move(e) {
                    contentArr[i].style.left = e.pageX - x + offsetLeft + 'px';
                    contentArr[i].style.top = ((e.pageY - y + offsetTop) <= -80 ? -80 :
                        e.pageY >= (cHeight - 40) ? ((cHeight - 40) - y + offsetTop) :
                            (e.pageY - y + offsetTop)) +'px';
                }
                // (3)鼠标弹起就让鼠标移到事件移除
                document.addEventListener('mouseup', function () {
                    document.removeEventListener('mousemove', move);
                    header.releaseCapture && header.releaseCapture();
                    body.classList.remove('body-select');
                    document.onmouseup = null;
                })
            })
        }
    },
    fileToBase64(file){
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    },
    getItem(label, key, icon, children, type){
      return {
        label,
        key,
        icon,
        children,
        type,
      };
    },
    deepClone(obj){
      let new_obj = Array.isArray(obj) ? [] : {}
      for(let i in obj) {
        new_obj[i] = typeof obj[i] == 'object' ? this.deepClone(obj[i]) : obj[i]
      }
      return new_obj
    }
};


