import { Button, Divider, Image, Input, InputNumber, Popconfirm, Space, Table, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { Select, message } from "antd";
import { firestore, storage } from "../config/firebase";

import { UploadOutlined } from "@ant-design/icons";
import _ from "lodash/lang";

const { Option } = Select;

const { Column } = Table;

const Products = ({ categoriesList, valueMapState, products, setProducts }) => {
  const [productEdit, setProductEdit] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [imageFile, setImageFile] = useState([]);
  const [editCIValue, setEditCIValue] = useState("");
  const [newProduct, setNewProduct] = useState({});
  const [newProductImage, setNewProductImage] = useState([]);
  const [newCIValue, setNewCIValue] = useState("");


  const [productParentCategories, setProductParentCategories] = useState([]);

  const fetchProducts = async () => {
    let productsTemp = [];
    try {
      const productsRef = await firestore.collection("products").get();
      productsRef.forEach((product) => {
        const productData = product.data();
        const productObj = {
          key: product.id,
          price: productData.price,
          description: productData.description || null,
          image: productData.image || null,
          name: productData.name,
          categoryId: productData.category,
          customIngredients: productData.customIngredients || null,
        };
        productsTemp.push(productObj);
      });
      console.log(productsTemp);
      setProducts(productsTemp);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    async function fetch() {
      await fetchProducts();
    }
    fetch();
  }, []);

  useEffect(() => {
    let ppc = [];
    Object.keys(valueMapState).forEach(function (key) {
      const category = valueMapState[key];
      if (!category.children.length) {
        ppc.push({ id: category.id, title: category.title });
      }
    });
    setProductParentCategories(ppc);
  }, [valueMapState]);

  const saveProduct = async (product) => {
    let imgUrl = product.image;
    try {
      if(productEdit.categoryId && productEdit.name !== '' && productEdit.price)
    {
      if (
        !_.isEqual(product, productEdit) ||
        (imageFile[0] && imageFile[0].originFileObj) ||
        (!imageFile[0] && imgUrl)
      ) {
        if (imageFile[0]) {
          if (imageFile[0].originFileObj) {
            var storageRef = storage.ref();
            var imageRef = storageRef.child(
              `products/${imageFile[0].originFileObj.name}`
            );
            const uploadSnapshot = await imageRef.put(
              imageFile[0].originFileObj
            );
            imgUrl = await uploadSnapshot.ref.getDownloadURL();
          }
        } else if (imgUrl) {
          imgUrl = "";
        }

        const productRef = firestore.collection("products").doc(product.key);

        const updateRes = await productRef.set(
          {
            category: productEdit.categoryId,
            customIngredients: productEdit.customIngredients,
            description: productEdit.description,
            image: imgUrl ? imgUrl : "",
            name: productEdit.name,
            price: productEdit.price,
          },
          { merge: true }
        );

        await fetchProducts();
      }
      setIsEdit(false);
      setProductEdit({});
      setNewProductImage([]);
      alert("השינויים נשמרו בהצלחה");
    } 
    else{
      alert("חובה לציין שם, קטגוריה ומחיר למוצר");
    }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const saveNewProduct = async () => {
    let imgUrl = "";
    try {
      if(("category" in newProduct) && ("name" in newProduct) && ("price" in newProduct) )
      {
        if (newProductImage[0] && newProductImage[0].originFileObj) {
            var storageRef = storage.ref();
            var imageRef = storageRef.child(
              `products/${newProductImage[0].originFileObj.name}`
            );
            const uploadSnapshot = await imageRef.put(
              newProductImage[0].originFileObj
            );
            imgUrl = await uploadSnapshot.ref.getDownloadURL();
        } 

        const productRef = await firestore.collection("products").add(
          {
            ...newProduct,
            imgUrl: imgUrl
            // category: newProduct.category,
            // customIngredients: newProduct.customIngredients? newProduct.customIngredients : null,
            // description: newProduct.description,
            // image: imgUrl ,
            // name: newProduct.name,
            // price: newProduct.price,
          },
        )

        await fetchProducts();
        
        setNewProduct({});
        setImageFile([]);
      alert("!המוצר נוסף בהצלחה");
        } else{
          alert("חובה לציין שם, קטגוריה ומחיר למוצר");
        }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const deleteProduct =async (id)=> {
    try{
    await firestore
    .collection("products")
    .doc(id)
    .delete()
    alert('המוצר הוסר בהצלחה');
    await fetchProducts();
    }
  catch(error)
  {
    console.log(error)
    alert(error.message)
  }
  }
  return (
    <div style={{ flex: 1 }}>
      <Divider />
      <div>
        <Table dataSource={[newProduct]} scroll={{ x: true }}>
          <Column
            title="שם המוצר ותיאור"
            dataIndex="name"
            key="name"
            align="center"
            render={(text, record) => {
              return (
                <>
                  <Input
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                  />
                  <br />
                  <Input
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                  />
                </>
              )
            }}
          />
          <Column
            title="קטגוריה"
            dataIndex="categoryId"
            key="categoryId"
            align="center"
            render={(text, record) => {
              return (
                <Select style={{ width: 120 }} onChange={(value) =>setNewProduct({...newProduct, category: value})}>
                  {productParentCategories &&
                    productParentCategories.map((pc) => {
                      return <Option value={pc.id} >{pc.title}</Option>;
                    })}
                </Select>
              ) 
            }}
          />

          <Column
            title="תמונה"
            dataIndex="image"
            key="image"
            align="center"
            render={(image, record) => {
              return  (
                <Upload
                  name="file"
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  headers={{
                    authorization: "authorization-text",
                  }}
                  listType="picture"
                  fileList={[...newProductImage]}
                  onChange={({ file: newFile }) => {
                    if (newFile.type === "image/png") {
                      setNewProductImage([newFile]);
                    }
                    console.log(newFile);
                    if (newFile.type !== "image/png") {
                      message.error(`${newFile.name} is not a png file`);
                    }
                    return newFile.type === "image/png";
                  }}
                  onRemove={() => setNewProductImage([])}
                >
                  {newProductImage.length === 0 && (
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  )}
                </Upload>
              ) 
            }}
          />

          <Column
            title="רכיבים לבחירה"
            dataIndex="customIngredients"
            key="customIngredients"
            align="center"
            render={(customIngredients, record) => {
              return  (
                <span>
                  <Select style={{ width: 120 }}>
                    {newProduct.customIngredients &&
                      newProduct.customIngredients.map((ci) => {
                        return <Option value={ci}>{ci}</Option>;
                      })}
                  </Select>
                  <br />
                  <Space>
                    <Input
                      style={{ width: 120 }}
                      value={newCIValue}
                      onChange={(e) => setNewCIValue(e.target.value)}
                      placeholder="מרכיב נוסף"
                    />
                    <Button
                      onClick={() =>
                        setNewProduct({
                          ...newProduct,
                          customIngredients: [
                            ...(newProduct.customIngredients || []),
                            newCIValue,
                          ],
                        })
                      }
                    >
                      הוסף
                    </Button>
                    <Button
                      onClick={() =>
                        setNewProduct({
                          ...newProduct,
                          customIngredients: [],
                        })
                      }
                    >
                      איפוס
                    </Button>
                  </Space>
                </span>
              ) 
            }}
          />

          <Column
            title="מחיר"
            dataIndex="price"
            key="price"
            align="center"
            render={(price, record) => {
              return (
                <InputNumber
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e })
                  }
                />
              ) 
            }}
          />

          <Column
            title="פעולות"
            dataIndex="actions"
            key="actions"
            align="center"
            render={(text, record) => {
              return (
                  <Button
                    onClick={() => {
                      saveNewProduct();
                    }}
                  >
                    הוסף מוצר
                  </Button>
              )}}
          />
        </Table>
      </div>
      <Divider />
      <Table dataSource={products} scroll={{ x: true }}>
        <Column
          title="שם המוצר ותיאור"
          dataIndex="name"
          key="name"
          align="center"
          render={(text, record) => {
            return productEdit.key === record.key && isEdit ? (
              <>
                <Input
                  value={productEdit.name}
                  onChange={(e) =>
                    setProductEdit({ ...productEdit, name: e.target.value })
                  }
                />
                <br />
                <Input
                  value={productEdit.description}
                  onChange={(e) =>
                    setProductEdit({
                      ...productEdit,
                      description: e.target.value,
                    })
                  }
                />
              </>
            ) : (
              <span>
                {text}
                <br />
                {record.description}
              </span>
            );
          }}
        />
        <Column
          title="קטגוריה"
          dataIndex="categoryId"
          key="categoryId"
          align="center"
          render={(text, record) => {
            const category = categoriesList.find(
              (category) => category.id === text
            );
            return productEdit.key === record.key && isEdit ? (
              <Select defaultValue={category.id} style={{ width: 120 }} onChange={(value) =>setProductEdit({...productEdit, categoryId: value})}>
                {productParentCategories &&
                  productParentCategories.map((pc) => {
                    return <Option value={pc.id}>{pc.title}</Option>;
                  })}
              </Select>
            ) : (
              <span>{category.title}</span>
            );
          }}
        />

        <Column
          title="תמונה"
          dataIndex="image"
          key="image"
          align="center"
          render={(image, record) => {
            return productEdit.key === record.key && isEdit ? (
              <Upload
                name="file"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                headers={{
                  authorization: "authorization-text",
                }}
                listType="picture"
                fileList={[...imageFile]}
                // beforeUpload={(file) => {
                //   if (file.type === "image/png") {
                //   setImageFile([file]);
                //   }
                //   console.log(file);
                //   if (file.type !== "image/png") {
                //     message.error(`${file.name} is not a png file`);
                //   }
                //   return file.type === "image/png";
                // }}
                onChange={({ file: newFile }) => {
                  if (newFile.type === "image/png") {
                    setImageFile([newFile]);
                  }
                  console.log(newFile);
                  if (newFile.type !== "image/png") {
                    message.error(`${newFile.name} is not a png file`);
                  }
                  return newFile.type === "image/png";
                }}
                onRemove={() => setImageFile([])}
                //onChange={onChangeFile}
                //onPreview={onPreviewFile}
              >
                {imageFile.length === 0 && (
                  <Button icon={<UploadOutlined />}>Upload</Button>
                )}
              </Upload>
            ) : (
              <Image width={100} src={image} />
            );
          }}
        />

        <Column
          title="רכיבים לבחירה"
          dataIndex="customIngredients"
          key="customIngredients"
          align="center"
          render={(customIngredients, record) => {
            return productEdit.key === record.key && isEdit ? (
              <span>
                <Select style={{ width: 120 }}>
                  {productEdit.customIngredients &&
                    productEdit.customIngredients.map((ci) => {
                      return <Option value={ci}>{ci}</Option>;
                    })}
                </Select>
                <br />
                <Space>
                  <Input
                    style={{ width: 120 }}
                    value={editCIValue}
                    onChange={(e) => setEditCIValue(e.target.value)}
                    placeholder="מרכיב נוסף"
                  />
                  <Button
                    onClick={() =>
                      setProductEdit({
                        ...productEdit,
                        customIngredients: [
                          ...(productEdit.customIngredients || []),
                          editCIValue,
                        ],
                      })
                    }
                  >
                    הוסף
                  </Button>
                  <Button
                      onClick={() =>
                        setProductEdit({
                          ...productEdit,
                          customIngredients: null
                        })
                      }
                    >
                      איפוס
                    </Button>
                </Space>
              </span>
            ) : (
              <span>
                {customIngredients && (
                  <Select style={{ width: 120 }}>
                    {customIngredients.map((ci) => {
                      return <Option value={ci}>{ci}</Option>;
                    })}
                  </Select>
                )}
              </span>
            );
          }}
        />

        <Column
          title="מחיר"
          dataIndex="price"
          key="price"
          align="center"
          render={(price, record) => {
            return productEdit.key === record.key && isEdit ? (
              <InputNumber
                value={productEdit.price}
                onChange={(e) =>
                  setProductEdit({ ...productEdit, price: e})
                }
              />
            ) : (
              price
            );
          }}
        />

        <Column
          title="פעולות"
          dataIndex="actions"
          key="actions"
          align="center"
          render={(text, record) => {
            return productEdit.key === record.key && isEdit ? (
              <Space size="large">
                <Button
                  onClick={() => {
                    saveProduct(record);
                  }}
                >
                  שמור
                </Button>
                <Button
                  onClick={() => {
                    setIsEdit(false);
                    setProductEdit({});
                    setImageFile([]);
                  }}
                >
                  ביטול
                </Button>
              </Space>
            ) : (
              <Space size="large">
                <Button
                  onClick={() => {
                    setIsEdit(true);
                    setProductEdit(record);
                    setEditCIValue("");
                    record.image
                      ? setImageFile([
                          {
                            uid: "-1",
                            name: `${record.name}.png`,
                            status: "done",
                            url: record.image,
                            thumbUrl: record.image,
                          },
                        ])
                      : setImageFile([]);
                  }}
                >
                  ערוך
                </Button>
                <Popconfirm
          title="בטוח שברצונך לשמור מוצר זה"
          okText="כן"
          cancelText="לא"
          onConfirm={() => deleteProduct(record.key)}
        >
                <Button >מחק</Button>
                </Popconfirm>
              </Space>
            );
          }}
        />
      </Table>
    </div>
  );
};

export default Products;
