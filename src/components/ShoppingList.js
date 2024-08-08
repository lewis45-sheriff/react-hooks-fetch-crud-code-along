import React, { useEffect, useState } from "react";
import ItemForm from "./ItemForm";
import Filter from "./Filter";
import Item from "./Item";

function ShoppingList() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/items")
      .then((r) => {
        if (!r.ok) {
          throw new Error("Failed to fetch items");
        }
        return r.json();
      })
      .then((items) => setItems(items))
      .catch((error) => setError(error.message));
  }, []);

  function handleCategoryChange(category) {
    setSelectedCategory(category);
  }

  const itemsToDisplay = items.filter((item) => {
    if (selectedCategory === "All") return true;

    return item.category === selectedCategory;
  });

  function handleAddItem(newItem) {
    setItems([...items, newItem]);
  }

  return (
    <div className="ShoppingList">
      <ItemForm onAddItem={handleAddItem} />
      <Filter
        category={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      <ul className="Items">
        {itemsToDisplay.length > 0 ? (
          itemsToDisplay.map((item) => (
            <Item key={item.id} item={item} />
          ))
        ) : (
        
        )}
      </ul>
      
    </div>
  );
}

export default ShoppingList;
