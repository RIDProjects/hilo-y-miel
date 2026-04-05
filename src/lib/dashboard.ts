import { prisma } from "./prisma";

export async function getDashboardMetrics() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [todayOrders, weekOrders, monthOrders, pendingOrders, pendingDesigns, outOfStockProducts] = await Promise.all([
    prisma.order.count({
      where: { created_at: { gte: todayStart } },
    }),
    prisma.order.count({
      where: { created_at: { gte: weekStart } },
    }),
    prisma.order.count({
      where: { created_at: { gte: monthStart } },
    }),
    prisma.order.count({
      where: { status: "pending" },
    }),
    prisma.customDesign.count({
      where: { status: "pending" },
    }),
    prisma.product.count({
      where: { is_available: false },
    }),
  ]);

  return {
    ordersToday: todayOrders,
    ordersWeek: weekOrders,
    ordersMonth: monthOrders,
    pendingOrders,
    pendingDesigns,
    outOfStockProducts,
  };
}

export async function getRecentOrders(limit: number = 5) {
  return prisma.order.findMany({
    take: limit,
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      customer_name: true,
      order_type: true,
      created_at: true,
      status: true,
    },
  });
}

export async function getOrdersLast30Days() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);

  const orders = await prisma.order.findMany({
    where: {
      created_at: { gte: thirtyDaysAgo },
    },
    select: {
      created_at: true,
    },
  });

  const ordersByDay: Record<string, number> = {};
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(thirtyDaysAgo);
    date.setDate(date.getDate() + i);
    const key = date.toISOString().split("T")[0];
    ordersByDay[key] = 0;
  }

  orders.forEach((order: { created_at: Date }) => {
    const key = order.created_at.toISOString().split("T")[0];
    if (ordersByDay[key] !== undefined) {
      ordersByDay[key]++;
    }
  });

  return Object.entries(ordersByDay).map(([date, count]) => ({
    date,
    count,
    label: new Date(date).toLocaleDateString("es-AR", { day: "numeric", month: "short" }),
  }));
}
