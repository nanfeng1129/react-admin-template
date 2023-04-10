/**
 * @description header部分，tabs打算写在这个文件里
 */
import React from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import Avatar from "./Avatar";
import PageSearch from "./Search";
import HeaderMenu from "./HeaderMenu";
import HeaderTabs from "./HeaderTabs";

const Header = (props) => {


  return (
    <div className="page-header">
      <div className="page-header-left">
        <div data-aspm-expo="true" data-aspm="ca26615" className="page-header-left-logo">
          <a data-aspm-expo="true" data-aspm-click="ca26615.da12243" href="https://b.alipay.com/page/home">
            <img
              src="https://gw.alipayobjects.com/mdn/rms_50301b/afts/img/A*xx7OR4Uc9HsAAAAAAAAAAAAAARQnAQ" 
              alt="支付宝"
              style={{height: '28px', verticalAlign: 'middle', border: '0px', marginRight: '10px'}}
            />
            
            <span>商家平台</span>
          </a>
        </div>
        <HeaderTabs />
      </div>
      <div className="page-header-right">
        {/* <PageSearch /> */}
        <Avatar />
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  // orderSubtradeType: state.yunstAccountReducer.orderSubtradeType,
});
const mapDispatchToProps = dispatch => ({
  // queryCommonDicts: (api) => dispatch(queryCommonDicts(api)),
});

export default withRouter(connect(null, null)(Header))