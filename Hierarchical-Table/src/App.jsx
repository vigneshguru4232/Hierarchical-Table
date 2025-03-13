import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';

const initialData = [
  {
    id: "electronics",
    label: "Electronics",
    // "value": 1400, //this need to be calculated from the children values (300+700)
    children: [
      { id: "phones", label: "Phones", value: 800, originalValue: 800, variance: 0 },
      { id: "laptops", label: "Laptops", value: 700, originalValue: 700, variance: 0 }
    ]
  },
  {
    id: "furniture",
    label: "Furniture",
    // "value": 1000, //this need to be calculated from the children values (300+700)
    children: [
      { id: "tables", label: "Tables", value: 300, originalValue: 300, variance: 0 },
      { id: "chairs", label: "Chairs", value: 700, originalValue: 700, variance: 0 }
    ]
  }
];

const calculateTotalsVaue = (data) => {
  return data.map((item) => {
    if (item.children) {
      const childTotal = item.children.reduce((sum, child) => sum + child.value, 0);
      const originalTotal = item.children.reduce((sum, child) => sum + child.originalValue, 0);
      item.value = childTotal;
      item.variance = ((childTotal - originalTotal) / originalTotal) * 100;
      item.children = item.children.map((child) => ({
        ...child,
        variance: ((child.value - child.originalValue) / child.originalValue) * 100
      }));
    }
    return item;
  });
};

const TableRow = ({ row, updateValue }) => {
  const [inputValue, setInputValue] = useState("");
  
  const handlePercentageVal = () => {
    const percentage = parseFloat(inputValue);
    if (!isNaN(percentage)) {
      const newValue = row.value + (row.originalValue * percentage) / 100;
      updateValue(row.id, newValue);
    }
    setInputValue("");
  };

  const handleDirectValue = () => {
    const newValue = parseFloat(inputValue);
    if (!isNaN(newValue)) {
      updateValue(row.id, newValue, true);
    }
    setInputValue("");
  };

  console.log("row.children",row.children)

  return (
    <>
      <tr>
        <td>{row.label}</td>
        <td>{row.value.toFixed(2)}</td>
        <td>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={handlePercentageVal}>Allo %</button>
          <button onClick={handleDirectValue}>Alloc Val</button>
        </td>
        <td>{row.variance.toFixed(2)}%</td>
      </tr>
      {row.children &&
        row.children.map((child) => (
          <TableRow key={child.id} row={child} updateValue={updateValue} />
        ))}
    </>
  );
};

const Table = () => {
  const [data, setData] = useState(calculateTotalsVaue(initialData));

  const updateValueData = (id, newValue, isTotalUpdate = false) => {
    const updateData = (items) => {
      return items.map((item) => {
        if (item.id === id) {
          if (isTotalUpdate && item.children) {
            const childTotal = item.children.reduce((sum, child) => sum + child.value, 0);
            item.value = newValue;
            item.variance = ((newValue - childTotal) / childTotal) * 100;
            item.children = item.children.map((child) => {
              const quantity = child.value / childTotal;
              const updatedChildValue = newValue * quantity;
              return {
                ...child,
                value: parseFloat(updatedChildValue.toFixed(2)),
                variance: ((updatedChildValue - child.originalValue) / child.originalValue) * 100
              };
            });
            return item;
          } else {
            return { ...item, value: newValue, variance: ((newValue - item.originalValue) / item.originalValue) * 100 };
          }
        }
        if (item.children) {
          return { ...item, children: updateData(item.children) };
        }
        return item;
      });
    };
    setData(calculateTotalsVaue(updateData(data)));
  };

  return (
    <table border="1">
      <thead>
        <tr>
          <th>Label</th>
          <th>Value</th>
          <th>Actions</th>
          <th>Variance</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <TableRow key={row.id} row={row} updateValue={updateValueData} />
        ))}
      </tbody>
    </table>
  );
};

const App = () => {
  return (
    <div>
      <h1>Hierarchical Table</h1>
      <Table />
    </div>
  );
};

export default App;
