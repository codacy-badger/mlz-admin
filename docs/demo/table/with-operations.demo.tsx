/**
 * title: 操作栏
 * desc: 通过传入 `operations` 组件数组，来展示对应的操作栏。它与tools api最直观的区别就是它位于Table的左侧，而后者在右侧。
 */
import React from 'react';
import { Table, Button, Icon, message } from '@mlz/admin';
import axios from 'axios';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    searchable: 6,
    primary: true,
  },
  {
    title: 'Id',
    dataIndex: 'id',
    type: 'number',
    searchable: 5,
    width: 60,
  },
  {
    title: 'Desc',
    dataIndex: 'desc',
    ellipsis: true,
    width: 220,
  },
  {
    title: 'Cost',
    dataIndex: 'money',
    type: 'price',
    searchable: 4,
  },
  {
    title: 'Forwards',
    dataIndex: 'status',
    type: 'tag',
    searchable: 2,
    enums: {
      all: { text: '全部', color: 'magenta' },
      close: { text: '售罄', color: 'red' },
      running: { text: '补货中', color: 'volcano', desc: 'testDesc' },
      online: { text: '正在销售', color: 'orange' },
      error: { text: '库存不足', color: 'gold' },
    },
  },
  {
    title: '操作',
    render: () => [
      <a key={1} style={{ marginRight: 6 }}>
        检查
      </a>,
      <a key={2}>关闭</a>,
    ],
  },
];

class App extends React.PureComponent {
  state = {
    data: [],
    loading: true,
    searchParams: {
      current: 1,
      pageSize: 10,
    },
    selectionType: 'checkbox',
    selected: [],
  };

  componentDidMount() {
    this.fetchData(this.state.searchParams);
  }

  fetchData = async (params?: { current?: number; pageSize?: number; [key: string]: any }) => {
    this.setState({ loading: true });
    const { data } = await axios.get('http://rap2.taobao.org:38080/app/mock/252468/admini/table-demo', {
      method: 'get',
      params,
    });
    this.setState({
      data: data.items,
      loading: false,
    });
  };

  rowSelection = {
    onChange: (selectedRowKeys, it) => {
      this.setState({
        selected: selectedRowKeys?.length ? Array.from(new Set(this.state.selected.concat(selectedRowKeys))) : [],
      });
    },
  };

  render() {
    return (
      <Table
        columns={columns}
        dataSource={this.state.data}
        loading={this.state.loading}
        pagination={{ total: 50, showSizeChanger: true, showQuickJumper: true }}
        onChange={(png) => {
          this.setState(
            {
              searchParams: { ...png, ...this.state.searchParams },
            },
            () => this.fetchData(this.state.searchParams),
          );
        }}
        onSearch={(e) => {
          this.setState(
            {
              searchParams: { ...e, ...this.state.searchParams },
            },
            () => this.fetchData(this.state.searchParams),
          );
        }}
        onReset={() => {
          this.setState(
            {
              searchParams: {
                current: 1,
                pageSize: 10,
              },
            },
            () => this.fetchData(this.state.searchParams),
          );
        }}
        tools={[
          <a key={1}>上传</a>,
          <Button type="primary" key={2}>
            同步
          </Button>,
        ]}
        operations={[
          <Button disabled={!this.state.selected.length} type="primary" key={2} onClick={() => message.success(`选中了：${this.state.selected.join(' 和 ')}`)}>
            批量通知
          </Button>,
        ]}
        rowSelection={{
          type: this.state.selectionType,
          ...this.rowSelection,
        }}
      />
    );
  }
}

export default App;
