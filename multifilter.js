import React, { useEffect, useState } from "react";
import Table from "../shared/Table";
import { RemoveDuplicate } from "../utils/Regex";
import "../App.css";
import { TextField } from "@material-ui/core";
import {useSyncExternalStore} from 'react';
import { store } from "../store/store";
const FilterTable = () => {
  const initial = [
    {
      id: 1,
      name: "foo",
      city: "dallas",
      category: "one",
      type: "A",
      active: "FALSE",
    },
    {
      id: 2,
      name: "bar",
      city: "dallas",
      category: "one",
      type: "B",
      active: "FALSE",
      state: "Gujarat",
    },
    {
      id: 3,
      name: "jim",
      city: "san francisco",
      category: "one",
      type: "B",
      active: "TRUE",
      state: "Gujarat",
    },
    {
      id: 4,
      name: "jane",
      city: "denver",
      category: "two",
      type: "C",
      active: "FALSE",
      state: "Gujarat",
    },
  ];
  const [data, setData] = useState(initial);
  const [filter, setFilter] = useState({});
  const [heading, setHeading] = useState([]);
  const [checked, setChecked] = useState({});
  const [arr, setArr] = useState({});
  const [temp, setTemp] = useState([]);
  const [temp1, setTemp1] = useState(initial);
  const [data2, setData2] = useState(initial);

  const set = () => {
    return RemoveDuplicate(
      initial.map((key) => Object.keys(key)).flat(Infinity)
    );
  };
  const [key, setKey] = useState(set());
  useEffect(() => {
    setKey(set());
  }, []);
  const handleChange = (key, key1) => {
    if (checked[key]) {
      setTemp(key);
      checked[key] = false;
      const check = Object.keys(checked).every((key) => checked[key] === false);
      const index = arr[key1].indexOf(key, 0);
      arr[key1].splice(index, 1);
      if (check === true) {
        setData(initial);
      } else {
        func(arr);
      }
    } else {
      setTemp(key);
      arr[key1].push(key);
      checked[key] = true;
      func(arr);
    }
  };
  useEffect(() => {
    setTemp1(data);
  }, [temp]);
  const func = (arr) => {
    Object.keys(arr).forEach((val) => {
      if (arr[val].length > 0) {
        setData(
          data2.filter((value) =>
            heading.every(
              (ok) => arr[ok].length === 0 || arr[ok].includes(value[ok])
            )
          )
        );
      }
    });
  };
  const Change = React.useCallback((e) => {
    if (e.target.value.length === 0) {
      setData(temp1);
      setData2(temp1);
    } else {
      setData(temp1.filter((key) => key.name.includes(e.target.value)));
      setData2(data);
      console.log(data2);
    }
  });

  useEffect(() => {
    for (let i of key) {
      if (i !== "id" && i !== "name") {
        filter[i] = RemoveDuplicate(initial.map((key) => key[i]));
        arr[i] = [];
      }
    }
    setHeading(Object.keys(filter));
  }, [key]);
  useEffect(() => {
    const array = RemoveDuplicate(
      initial.map((key) => heading.map((key1) => key[key1])).flat(Infinity)
    );
    for (let i = 0; i < array.length; i++) {
      checked[array[i]] = false;
    }
  }, [heading]);

  useEffect(() => {
    setData(initial);
    Object.keys(filter).forEach((key) => {
      filter[key].forEach((key1) => {
        if (key1 === undefined) {
          delete filter[key];
        }
      });
    });
    setHeading(Object.keys(filter));
  }, [filter]);

  return (
    <div>
      Filter table
      <div style={{ marginLeft: "350px", marginTop: "90px" }}>
        <div style={{ display: "flex" }}>
          {heading.length > 0 &&
            heading.map((key1, index) => (
              <div style={{ padding: "50px" }} key={index}>
                <h3>
                  {key1}
                  {filter[key1].map(
                    (key, index) =>
                      key && (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            borderRight: "1px solid black",
                          }}
                        >
                          <label className="switch">
                            <input
                              type="checkbox"
                              //checked={checked[key]}
                              onChange={() => handleChange(key, key1)}
                            />
                            <span className="slider round"></span>
                          </label>
                          <span>{key}</span>
                        </div>
                      )
                  )}
                </h3>
              </div>
            ))}
        </div>
      </div>
      {key.includes("name") ? (
        <TextField name="name" onChange={(e) => Change(e)} placeholder="name" />
      ) : null}
      <Table tableData={data} headingColumns={key} fill={true}></Table>
    </div>
  );
};
export default FilterTable;
