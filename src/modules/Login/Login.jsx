import React, { useEffect, useRef } from "react";
import lottie from 'lottie-web';
import LoginBgJson from './login-bg.json'
import './login.less'

const Login = () => {

  const container = useRef(null)

  useEffect(() => {
    lottie.loadAnimation({
      container: container.current, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: LoginBgJson // the path to the animation json
    });
  }, [])

  return (
    <div className="page-login" >
      <div className="page-login-form">
        这里是 Login
      </div>
      <div ref={container} className="page-login-bg"></div>
    </div>
  )
}

export default Login