import React, { useEffect, useState } from 'react';

import Categories from './Categories'
import Products from './Products'
import { Select } from 'antd';
import { firestore } from "../config/firebase";

const { Option } = Select;
const Catalog =() =>{
   const [isCategories, setIsCategories] = useState(true);
   const [categoryTree, setCategoryTree] = useState();
   const [valueMapState, setValueMapState] = useState({});
   const [categoriesList, setCategoriesList] = useState([]);
   const [products,setProducts] = useState([]);

   let valueMap = {};

  function handleChange(value) {
     setIsCategories(value=== 'קטגוריות');
}

const fetchCategories = async () => {
  let allCategories= [];
  let subCategories = [];
  let categoryTreeTemp = [];
  let index = 0;
  const categories = await firestore.collection("Categories").get();
  categories.forEach((category) => {
    const categoryData = category.data();
    const showItem = {
      id: category.id,
      title: categoryData.name,
      parentId: categoryData.parent,
    };
    allCategories.push(showItem);
   

    if (categoryData.parent == null) {
      categoryTreeTemp.push({
        id: category.id,
        title: categoryData.name,
        parentId: null,
        value: `0-${index}`,
      });
      index++;
    } else {
      subCategories.push(showItem);
    }
  });
  setCategoriesList(allCategories);
  
  function searchTree(list, subCategory) {
    let isFound = false;
    list.some((item) => {
      if (item.id === subCategory.parentId) {
        if (item.children) {
          item.children.push({
            id: subCategory.id,
            title: subCategory.title,
            parentId: subCategory.parentId,
            value: `${item.value}-${item.children.length + 1}`,
          });
        } else {
          item.children = [
            {
              id: subCategory.id,
              title: subCategory.title,
              parentId: subCategory.parentId,
              value: `${item.value}-1`,
            },
          ];
        }
        isFound = true;
      } else {
        if (item.children) {
          if (searchTree(item.children, subCategory)) isFound = true;
        }
      }
      return isFound;
    });
    return isFound;
  }

  while (subCategories.length !== 0) {
    subCategories.forEach((item, index, object) => {
      console.log(item, index, object);

      if (searchTree(categoryTreeTemp, item)) {
        object.splice(index, 1);
      }
    });
  }
  setCategoryTree([...categoryTreeTemp]);
};

function loops(list, parent) {
  return (list || []).map(({ children, value, title,id }) => {
    const node = (valueMap[value] = {
      parent,
      value,
      title,
      id
    });
    node.children = loops(children, node);
    return node;
  });
}

useEffect(() => {
  async function fetch() {
    await fetchCategories();
    // loops(categoryTree);
  }
  if (categoryTree === undefined) {
    fetch();
    console.log("useEffect", categoryTree);
  }
}, []);

useEffect(() => {
  loops(categoryTree);
  setValueMapState(valueMap);
}, [categoryTree]);

  return (
   <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
     <div className="select">
        <Select defaultValue="קטגוריות" style={{ width: 120 }} onChange={handleChange}>
      <Option value="קטגוריות">קטגוריות</Option>
      <Option value="מוצרים">מוצרים</Option>
    </Select>
    </div>
    <div className="content" style={{display: 'flex', flex: 1}}>
      {isCategories? 
      <Categories 
      categoryTree={categoryTree}
       valueMapState={valueMapState}
       fetchCategories={fetchCategories} /> 
      : <Products categoriesList={categoriesList}
      categoryTree={categoryTree}
      valueMapState={valueMapState}
      products={products} 
      setProducts={setProducts}/>}
    </div>
   </div>
  );
}

export default Catalog;
