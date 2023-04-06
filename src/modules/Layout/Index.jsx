import React from "react";
import { Layout } from "antd";
import './layout.less'
import PageHeader from "./Header/Header";
import PageSider from "./Sider/Sider";
import PageFooter from "./Footer/Footer";
import PageContent from './Content/Content'

const { Header, Footer, Content, Sider } = Layout

const PageLayout = () => {
  return (
    <Layout className="page-layout">
      <Header className="page-layout-header">
        <PageHeader />
      </Header>
      <Layout>
        <Sider className="page-layout-sider">
          <PageSider />
        </Sider>
        <Layout className="page-layout-main">
          <Content className="page-layout-main-content">
            <PageContent />
          </Content>
          <Footer className="page-layout-main-footer">
            <PageFooter />
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default PageLayout