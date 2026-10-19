import { AdminOrderListItem } from "@/services/admin-orders-service"

export function exportOrdersToCsv(orders: AdminOrderListItem[]) {
  const csvContent =
    "data:text/csv;charset=utf-8," +
    ["Order Code,Customer,Seller,Amount,Delivery Status,Payment Method,Payment Status,Tracking Code,Date"]
      .concat(
        orders.map(
          (o) =>
            `"${o.code}","${o.customerName}","${o.sellerName}",${o.grandTotal},"${o.deliveryStatus}","${o.paymentType}","${o.paymentStatus}","${o.trackingCode || ""}","${o.date}"`
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
