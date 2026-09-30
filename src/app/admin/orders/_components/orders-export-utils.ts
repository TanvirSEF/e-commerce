import { AdminOrderListItem } from "@/services/admin-orders-service"

export function exportOrdersToCsv(orders: AdminOrderListItem[]) {
  const csvContent =
    "data:text/csv;charset=utf-8," +
    ["Order Code,Customer,Amount,Delivery Status,Payment Status,Date"]
      .concat(
        orders.map(
          (o) =>
            `"${o.code}","${o.customerName}",${o.grandTotal},"${o.deliveryStatus}","${o.paymentStatus}","${o.date}"`
        )
      )
      .join("\n")

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `orders_export_${Date.now()}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
