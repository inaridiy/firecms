export const parseOrders = (ordersStr: string) => {
  const orders = ordersStr.split(",").map((order) => {
    const [field, direction] = order.split(":");

    return { field, direction: direction === "desc" ? "desc" : "asc" };
  });
  return orders as { field: string; direction: "asc" | "desc" }[];
};
