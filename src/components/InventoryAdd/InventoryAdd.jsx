import { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./InventoryAdd.scss";
import { TextInput, RadioInput, SelectInput } from "../../utils/FormHelper";

const API_URL = import.meta.env.VITE_LOCALHOST;

export default function InventoryAdd() {
  // TODO:
  // const postInventoryItem = async () => {
  //   try {
  //     const warehouseRequest = await axios.post(`${API_URL}/api/inventories`)
  //   } catch (error) {
  //     console.error('Error creating a new inventory item', error)
  //   }
  // };

  const [warehouseList, setWarehouseList] = useState([]);

  const getWarehouseList = async () => {
    try {
      const warehouseRequest = await axios.get(`${API_URL}/api/warehouses`);
      setWarehouseList(warehouseRequest.data);
    } catch (error) {
      console.error("Error retrieving warehouses", error);
    }
  };

  useEffect(() => {
    getWarehouseList();
  }, []);

  const errorMessage = "This field is required";

  return (
    <>
      <Formik
        initialValues={{
          name: "",
          description: "",
          category: "",
          status: "inStock",
          quantity: "",
          warehouse: "",
        }}
        validationSchema={Yup.object({
          name: Yup.string().required(errorMessage),
          description: Yup.string().required(errorMessage),
          category: Yup.string().required(errorMessage),
          status: Yup.string().required(errorMessage),
          quantity: Yup.number().when("status", {
            is: "inStock",
            then: (schema) =>
              schema.required(errorMessage).positive().integer(),
          }),
          warehouse: Yup.number().required(errorMessage),
        })}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ values }) => (
          <Form className="inventory-add">
            <h1 className="inventory-add__title">Add New Inventory Item</h1>

            <div className="inventory-add__left-container">
              <h2 className="inventory-add__subtitle">Item Details</h2>
              <TextInput
                label="Item Name"
                name="name"
                type="text"
                placeholder="Item Name"
                className="inventory-add__input"
                labelClassName="inventory-add__label"
              />

              <TextInput
                label="Description"
                name="description"
                type="text"
                placeholder="Description"
                className="inventory-add__input"
                labelClassName="inventory-add__label"
              />

              <SelectInput
                label="Category"
                name="category"
                className="inventory-add__dropdown-input"
                labelClassName="inventory-add__dropdown-label"
              >
                <option value="">Please select</option>
                <option value="electronics">Electronics</option>
                <option value="gear">Gear</option>
                <option value="apparel">Apparel</option>
                <option value="health">Health</option>
              </SelectInput>
            </div>

            <div className="inventory-add__right-container">
              <h2 className="inventory-add__subtitle">Item Availability</h2>

              <div className="inventory-add__radio-container">
                Status
                <div className="inventory-add__radio-buttons">
                  <RadioInput name="status" value="inStock">
                    In Stock
                  </RadioInput>
                  <RadioInput name="status" value="outOfStock">
                    Out Of Stock
                  </RadioInput>
                </div>
              </div>

              {values.status !== "outOfStock" && (
                <TextInput
                  label="Quantity"
                  name="quantity"
                  type="text"
                  placeholder="0"
                  className="inventory-add__input"
                  labelClassName="inventory-add__label"
                />
              )}

              <SelectInput
                label="Warehouse"
                name="warehouse"
                className="inventory-add__dropdown-input"
                labelClassName="inventory-add__dropdown-label"
              >
                <option value="">Please select</option>
                {warehouseList.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.warehouse_name}
                  </option>
                ))}
              </SelectInput>
            </div>

            <div className="inventory-add__button-container">
              <button type="" className="inventory-add__button-item">
                Cancel
              </button>
              <button type="submit" className="inventory-add__button-item">
                Add Item
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
