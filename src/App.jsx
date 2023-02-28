import React, { useState } from "react";
import axios from 'axios';

function FileList() {
  const [fileContent, setFileContent] = useState("");
  const [itemsArray, setItemsArray] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const linkAPI = "https://gruporojemac.api.flexy.com.br/platform/api/products";
  const tokenLyor = "qxrh3r6tvldz0v62zfprk";
  const referenceCodeStore = "lyor";

  const linkAPIput = "https://gruporojemac.api.flexy.com.br/platform/api/products"

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setFileContent(event.target.result);
      const items = event.target.result.split("\n").map((item) => item.trim());
      setItemsArray(items);
    };
    reader.readAsText(file);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setItemsArray(fileContent.split("\n"));
    const promisses = itemsArray.map(async (item) => {
      debugger
      const response = await axios.get(`${linkAPI}/${item}?token=${tokenLyor}&referenceCodeStore=${referenceCodeStore}`);
      const data = response.data;
      console.log("Aqui é o DATA =>", data)

      const body = {
          product: {
          name: data[0].name,
          stockControl: true,
          referenceCode: data[0].referenceCode,
          categories: [data[0].categories],
          shoppingCategories: ["dia-das-maes-lyor"]  
          },
          variants: [{
              referenceCode: data[0].referenceCode,
              master: true,
              presentation: data[0].masterVariant.presentation,
              price: data[0].masterVariant.price,
              stock: {
              quantity: data[0].masterVariant.stock.quantity
              }
            }]
          };
          console.log("Aqui é o body =>", body)

      const bodyString = JSON.stringify(body);
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
          // "Authorization": "Bearer qxrh3r6tvldz0v62zfprk"
        },
        body: bodyString
      };
      await axios.put(`${linkAPIput}/?token=${tokenLyor}&referenceCodeStore=${referenceCodeStore}`, requestOptions);
    });

    const produtos = await Promise.all(promisses);
    setProdutos(produtos);
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Submit</button>
      </form>
      {produtos.length > 0 && (
        <ul>
          {produtos.map((produto, index) => (
            <li key={index}>{produto.nome}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FileList;
