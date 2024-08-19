import "whatwg-fetch";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { resetData } from "../mocks/handlers";
import { server } from "../mocks/server";
import ShoppingList from "../components/ShoppingList";

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  resetData();
});
afterAll(() => server.close());

test("displays all the items from the server after the initial render", async () => {
  render(<ShoppingList />);

  const yogurt = await screen.findByText(/Yogurt/);
  expect(yogurt).toBeInTheDocument();

  const pomegranate = await screen.findByText(/Pomegranate/);
  expect(pomegranate).toBeInTheDocument();

  const lettuce = await screen.findByText(/Lettuce/);
  expect(lettuce).toBeInTheDocument();
});

test("adds a new item to the list when the ItemForm is submitted", async () => {
  render(<ShoppingList />);

  fireEvent.change(screen.getByLabelText(/Name/), {
    target: { value: "Ice Cream" },
  });

  fireEvent.change(screen.getByLabelText(/Category/), {
    target: { value: "Dessert" },
  });

  fireEvent.click(screen.getByRole('button', { name: /Add Item to List/i }));

  const iceCream = await screen.findByText(/Ice Cream/);
  expect(iceCream).toBeInTheDocument();

  const desserts = await screen.findAllByText(/Dessert/);
  expect(desserts.length).toBeGreaterThan(0);
});

test("updates the isInCart status of an item when the Add/Remove from Cart button is clicked", async () => {
  render(<ShoppingList />);

  const addButtons = await screen.findAllByText(/Add to Cart/);
  expect(addButtons.length).toBeGreaterThan(0);

  fireEvent.click(addButtons[0]);

  const removeButton = await screen.findByText(/Remove From Cart/);
  expect(removeButton).toBeInTheDocument();

  const rerenderedAddButtons = screen.queryAllByText(/Add to Cart/);
  expect(rerenderedAddButtons.length).toBe(addButtons.length - 1);
});

test("removes an item from the list when the delete button is clicked", async () => {
  render(<ShoppingList />);

  const yogurt = await screen.findByText(/Yogurt/);
  expect(yogurt).toBeInTheDocument();

  const deleteButtons = await screen.findAllByText(/Delete/);
  fireEvent.click(deleteButtons[0]);

  await waitForElementToBeRemoved(() => screen.queryByText(/Yogurt/));

  expect(screen.queryByText(/Yogurt/)).not.toBeInTheDocument();
});
