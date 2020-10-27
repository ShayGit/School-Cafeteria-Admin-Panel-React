import { format, parse, parseISO } from "date-fns";

import _ from "lodash/lang"
import createDataContext from "./createDataContext";
import {firestore} from '../config/firebase';
import { utcToZonedTime } from 'date-fns-tz';

const ordersReducer = (state, action) => {
  switch (action.type) {
    case "reset": {
      return {
        orders: {
          details: [],
          products: [],
        },
        isLoading: false,
      };
    }
    case "update_orders": {
      const ordersTemp = [...state.orders];

      const querySnapshot = action.payload;
      querySnapshot.docChanges().forEach((change) => {
       
        const order = change.doc.data();
        const index = ordersTemp.findIndex(
          (order) => order.key === change.doc.id
        );

        if(order.orderStatus !== 'הסתיימה')
      {
       
            const productsMap = order.products.map((product,index)=> {
              let customIngredientsMap
              if(product.customIngredients)
              {
               customIngredientsMap = product.customIngredients.flatMap((ci) => 
                ci.isChecked ? [ci.name] : []
              )
              }
              else{
                customIngredientsMap= ['אין'];
              }
              return {key:order.id,name:product.name, price:product.price,customIngredients: customIngredientsMap, note: order.note }
              });


        const orderObj = {
          key: change.doc.id,
          orderStatus: order.orderStatus,
          price: order.price,
          clientDetails: [
            `${order.user.firstName} ${order.user.lastName}`,
            order.user.isStuff,
            order.user.phoneNumber,
          ],
          //createdAt: format(order.createdAt.toDate(), "dd/MM/yyy HH:mm"),
          timeToMake:
            order.timeToMake === "עכשיו"
              ? order.timeToMake
              : format(utcToZonedTime(order.timeToMake.toDate(), 'UTC'), "HH:mm"),
          paymentDetails: [
            order.paymentMethod,
            order.paymentStatus,
            order.confirmationNumber,
          ],
          products: [...productsMap]
        };

        if (change.type === "added") {
          console.log("added");
          if (index === -1 ) {
            ordersTemp.push(orderObj);
            ordersTemp.sort((a, b) =>{
              const time1 = a.timeToMake;
              const time2 =b.timeToMake;
              if(time1===time2 && time1==='עכשיו') return 0;
            if(time1==='עכשיו' && time2!==time1) return -1;
            if(time2==='עכשיו' && time1!==time2) return 1;
            if(time2!=='עכשיו' && time1!=='עכשיו') 
            {
              return time1.localeCompare(time2);
            }
              else return 0;
            })
           
           
          } else {
           // if (deepDiffer(ordersTemp[index], orderObj)) {
            if(!_.isEqual(ordersTemp[index],orderObj))
            {
              ordersTemp[index] = orderObj;
            }
          }
        }
        if (change.type === "modified") {
          console.log("modified");
            
          if (index !== -1) {
            ordersTemp[index] = orderObj;
          }
        }
      }
      else{
        if (change.type === "modified") {
          console.log("modified");
            
          if (index !== -1) {
            ordersTemp.splice(index, 1); 
          }
          return {
            ...state,
            orders: [...ordersTemp],
          };
        }
        return state;
      }
      });
      return {
        ...state,
        orders: [...ordersTemp],
      };
    }
    default:
      return state;
  }
};

const updateOrders = (dispatch) => async (querySnapshot) => {
  dispatch({ type: "update_orders", payload: querySnapshot });
};

const confirmPayment = (dispatch) => async (orderId) => {
  try{
    const orderRef = firestore.collection("orders").doc(orderId);

   await orderRef.set(
      {
        paymentStatus: "שולם",
      },
      { merge: true }
    );
  }
  catch (err) {
    console.log(err);
    alert(err.message);
  }
};

const endOrder = (dispatch) => async (orderId) => {
  try{
    const orderRef = firestore.collection("orders").doc(orderId);

   await orderRef.set(
      {
        orderStatus: "הסתיימה",
      },
      { merge: true }
    );
  }
  catch (err) {
    console.log(err);
    alert(err.message);
  }
};

const orderReady = (dispatch) => async (orderId) => {
  try{
    const orderRef = firestore.collection("orders").doc(orderId);

   await orderRef.set(
      {
        orderStatus: "מוכנה",
      },
      { merge: true }
    );
  }
  catch (err) {
    console.log(err);
    alert(err.message);
  }
};

const reset = (dispatch) => async () => {
  dispatch({ type: "reset" });
};

const setLoading = (dispatch) => (isLoading) => {
  dispatch({ type: "set_loading", payload: isLoading });
};

export const { Provider, Context } = createDataContext(
  ordersReducer,
  {
    setLoading,
    updateOrders,
    reset,
    endOrder,
    orderReady,
    confirmPayment
  },
  {
    orders: [],
    isLoading: false,
  }
);
