import { Badge, Space, Table } from "antd";
import {
  CheckOutlined,
  DeleteOutlined,
  DollarCircleOutlined
} from "@ant-design/icons";
import React, { useContext, useEffect } from "react";

import { Context as OrdersContext } from "../context/OrdersContext";

const { Column } = Table;

const Orders = () => {
  const {
    state: { orders },
    confirmPayment,
    orderReady,
    endOrder
  } = useContext(OrdersContext);

  const expandedRowRender = (row) => {
    
    let inTable = orders.find(order => order.key === row.key);

    const columns = [
      {
        title: "שם מוצר",
        dataIndex: "name",
        key: "name",
        align: "center",
      },
      {
        title: "מרכיבים שנבחרו",
        dataIndex: "customIngredients",
        key: "customIngredients",
        align: "center",
        render: (customIngredients) => (
          <span>
            {customIngredients && customIngredients.map((ci) => {
              return <>{ci}<br/></>;
            })}
          </span>
        ),
      },

      {
        title: "מחיר מוצר",
        dataIndex: "price",
        key: "price",
        align: "center",
      },
      {
        title: "הערות",
        dataIndex: "note",
        key: "note",
        align: "center",
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if(index===0)
            obj.props.rowSpan = inTable.products.length 
            else{
              obj.props.rowSpan = 0;
            }
        
          
          return obj;
        },
       
      },
    ];

    
    return (
      <Table
        columns={columns}
        dataSource={inTable.products}
        pagination={false}
      />
    );
  };

 

  return (
    <div style={{flex: 1}}>
      <Table
        className="components-table-demo-nested"
        dataSource={orders}
        expandable={{expandedRowRender}}
        scroll={{x:true}}
      >
        <Column title="מס' הזמנה" dataIndex="key" key="key" align="center" />

        <Column
          title="מתי להכין?"
          dataIndex="timeToMake"
          key="timeToMake"
          align="center"
        
        />
        <Column
          title="פרטי לקוח"
          dataIndex="clientDetails"
          key="clientDetails"
          align="center"
          render={(clientDetails) => (
            <span>
              {`שם: ${clientDetails[0]}`}
              <br />
              {`עובד צוות: ${clientDetails[1] ? "כן" : "לא"}`} <br />
              {`מס' נייד: ${clientDetails[2]}`}
            </span>
          )}
        />
       
        <Column
          title="פרטי תשלום"
          dataIndex="paymentDetails"
          key="paymentDetails"
          align="center"
          render={(paymentDetails) => {
            return (
            <span>
              {`אמצעי תשלום: ${paymentDetails[0]}`}
              <br />
              {`סטטוס תשלום: ${paymentDetails[1]} `}
              <Badge
                status={paymentDetails[1] === "שולם" ? "success" : "error"}
              />
              <br />
              {paymentDetails[0] === ("bit" || "pepper") &&
                `מספר אישור: ${paymentDetails[2]}`}
            </span>
          )}}
        />

        <Column
          title="סטטוס הזמנה"
          dataIndex="orderStatus"
          key="orderStatus"
          align="center"
          render={(orderStatus) => (
            <span>
              <Badge status={orderStatus === "מוכנה" ? "success" : "error"} />
              <br />
              {orderStatus}
            </span>
          )}
        />

        <Column title="מחיר" dataIndex="price" key="price" align="center" />

        <Column
          title="פעולות"
          dataIndex="actions"
          key="actions"
          align="center"
          render={(text,record) => 
            {
            return(
            <Space size="large">
               {record.paymentDetails[1] ==='ממתין' &&
             
              <a onClick={()=>confirmPayment(record.key)}>   <DollarCircleOutlined /> אישור תשלום</a>
            }
              {record.orderStatus ==='בהמתנה' &&
              <a onClick={()=>orderReady(record.key)}> <CheckOutlined /> הזמנה מוכנה</a>
            }
            {record.orderStatus ==='מוכנה' && record.paymentDetails[1] ==='שולם' &&
              <a onClick={()=>endOrder(record.key)}> <DeleteOutlined /> סיום הזמנה</a>
          }
            </Space>
            )}}
        />
      </Table>
    </div>
  );
};

export default Orders;
