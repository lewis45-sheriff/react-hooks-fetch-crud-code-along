import React, { useEffect, useState } from "react";
import ItemForm from "./ItemForm";
import Filter from "./Filter";
import Item from "./Item";

function ShoppingList() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetch("http://localhost:4000/items")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }
        return response.json();
      })
      .then((items) => {
        if (isMounted) {
          setItems(items);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setError(error.message);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function handleCategoryChange(category) {
    setSelectedCategory(category);
  }

  function handleAddItem(newItem) {
    setItems((prevItems) => [...prevItems, newItem]);
  }

  function handleUpdateItem(updatedItem) {
    const updatedItems = items.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setItems(updatedItems);
  }

  function handleDeleteItem(deletedItem) {
    const updatedItems = items.filter((item) => item.id !== deletedItem.id);
    setItems(updatedItems);
  }

  const itemsToDisplay = items.filter((item) => {
    if (selectedCategory === "All") return true;
    return item.category === selectedCategory;
  });

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
            <Item
              key={item.id}
              item={item}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
            />
          ))
        ) : (
          <li>No items match the selected category</li>
        )}
      </ul>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default ShoppingList;
