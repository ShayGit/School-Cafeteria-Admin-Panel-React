import { Button, Divider, Popconfirm, Space, Upload } from "antd";
import { Input, TreeSelect, message } from "antd";
import React, { useEffect, useState } from "react";
import { firestore, storage } from "../config/firebase";

import { UploadOutlined } from "@ant-design/icons";

const { TreeNode } = TreeSelect;

const Categories = ({ categoryTree, valueMapState, fetchCategories }) => {
  const [newCategory, setNewCategory] = useState();
  const [category, setCategory] = useState();
  const [fileList, setFileList] = useState([]);


  const onChange = (value) => {
    console.log(value);
    setCategory(value);
  };

  const onChangeFile = ({ fileList: newFileList }) => {
    console.log(newFileList);
   //setFileList(newFileList);
  };

  const onPreviewFile = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const getPath = (value) => {
    const path = [];
    let current = valueMapState[value];
    while (current) {
      path.unshift(current.value);
      current = current.parent;
    }
    return path;
  };

  const saveCategory = async () => {
    try {
      let pathString = "";
      let parent = null;
      let categoryTreeTemp = [...categoryTree];
      console.log(fileList.length);
      if (newCategory && fileList.length === 1) {
        if (category) {
          const path = getPath(category);

          for (let i = 0; i < path.length; i++) {
            const item = categoryTreeTemp.find(
              (item) => item.value === path[i]
            );
            pathString += item.title + "/";
            if (i === path.length - 1) parent = item.id;
            categoryTreeTemp = item.children;
          }
        }
        pathString += newCategory + `/${newCategory}.jpg`;

        var storageRef = storage.ref();
        var imageRef = storageRef.child(pathString);
        const uploadSnapshot = await imageRef.put(fileList[0].originFileObj);
        const uploadUrl = await uploadSnapshot.ref.getDownloadURL();

        const categoriesRef = firestore.collection("Categories");

        await categoriesRef.add({
          name: newCategory,
          image: uploadUrl,
          parent: parent,
        });
        await fetchCategories();
        alert("הקטגוריה נוספה בהצלחה !")
      }
      else{
        alert("בחר תמונה ושם עבור הקטגוריה")
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const deleteCategory = async ()=> {
      if(category)
      {
        const {id} = valueMapState[category];
        const productsDB = await firestore
        .collection("products")
        .where("category", "==", id)
        .get();

        const categoriesDB = await firestore
        .collection("Categories")
        .where("parent", "==", id)
        .get();

        if(productsDB.empty && categoriesDB.empty)
        {
          await firestore
        .collection("Categories")
        .doc(id)
        .delete()
        alert('הקטגוריה הוסרה בהצלחה');
        await fetchCategories();
        }
        else{
          alert('לקטגוריה שנבחרה קיימים מוצרים או תתי קטגוריות תחתיה, מחק אותם קודם ולאחר מכן נסה שוב');
        }
      }
      else{
        alert('לא נבחרה קטגוריה');
      }

  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "10px",
        flex: 1,
      }}
    >
      <Divider />
      <div>
        <TreeSelect
          style={{ width: "20%", margin: "10px" }}
          value={category}
          dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
          treeData={categoryTree}
          placeholder="בחר..."
          treeDefaultExpandAll
          onChange={onChange}
        />
        <Button onClick={() => setCategory(undefined)}>
          עלה לראש הקטגוריות
        </Button>
      </div>
      <Divider />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <div>קטגוריה/ תת קטגוריה חדשה:</div>
        <div>
          <Input
            placeholder="שם קטגוריה"
            value={newCategory}
            onChange={(e) => {
              setNewCategory(e.target.value);
            }}
          />
        </div>
        <div>
          <Upload
            listType="picture"
            fileList={fileList}
            name= 'file'
            action= 'https://www.mocky.io/v2/5cc8019d300000980a055e76'
            headers= {{
              authorization: 'authorization-text'
            }}
            onChange={({file: newFile}) => {
              if (newFile.type === "image/png") {
              setFileList([newFile]);
              }
              console.log(newFile);
              if (newFile.type !== "image/png") {
                message.error(`${newFile.name} is not a png file`);
              }
              return newFile.type === "image/png";
            }}
            onRemove={() =>  setFileList([])}
            //onChange={onChangeFile}
            //onPreview={onPreviewFile}
          >
            {fileList.length === 0 && (
              <p>
                <Button icon={<UploadOutlined />} >העלה תמונה  </Button>
              </p>
            )}
          </Upload>
        </div>
        <Popconfirm
          title="בטוח שברצונך לשמור קטגוריה זו"
          okText="כן"
          cancelText="לא"
          onConfirm={() => saveCategory()}
        >
          <Button type="primary">שמור</Button>
        </Popconfirm>
      </div>
      <Divider />
      <div style={{margin: "10px"}}>
        
      <Popconfirm
          title="בטוח שברצונך למחוק קטגוריה זו"
          okText="כן"
          cancelText="לא"
          onConfirm={() => deleteCategory()}
        >
          <Button type="primary" danger>מחק קטגוריה</Button>
        </Popconfirm>
        </div>

    </div>
    
  );
};

export default Categories;
