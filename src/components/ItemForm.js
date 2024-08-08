import React, { useState } from "react";

function ItemForm() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Produce");

  function handleSubmit(e) {
    e.preventDefault();
    const itemData = {
      name: name,
      category: category,
      isInCart: false,
    };

    fetch("http://localhost:4000/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    })
      .then((r) => {
        if (!r.ok) {
          throw new Error("Network response was not ok");
        }
        return r.json();
      })
      .then((newItem) => {
        console.log("Item added:", newItem);
        // Optionally, clear the form after successful submission
        setName("");
        setCategory("Produce");
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  return (
    <form className="NewItem" onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label>
        Category:
        <select
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Produce">Produce</option>
          <option value="Dairy">Dairy</option>
          <option value="Dessert">Dessert</option>
        </select>
      </label>

      <button type="submit">Add Item to List</button>
    </form>
  );
}

export default ItemForm;
