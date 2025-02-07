import {Order} from "@/types";


export default function OrderItems({order}: {order: Order}) {
  return (
    <li className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
      <div className="flex items-center justify-between p-2 px-4 sm:px-6 lg:px-8 sm:flex-auto">
        <h1 className="text-base font-semibold text-gray-900">
          Order #{order.orderId}
        </h1>
        <p className="text-sm text-gray-700">
          {order.date}
        </p>
      </div>
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th scope="col" className="w-[16ch] py-1 pl-12 pr-3 text-left text-sm font-semibold text-gray-900 max-sm:pl-0">
              ID
            </th>
            <th scope="col" className="py-1 pl-12 pr-3 text-left text-sm font-semibold text-gray-900 max-sm:pl-0">
              Name
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {order.items && order.items.map((item, idx) => (
            <tr key={item.productId}>
              <td className="whitespace-nowrap py-3 pl-12 pr-0 text-sm font-medium text-gray-900 max-sm:pl-0">
                {item.productId}
              </td>
              <td className="whitespace-nowrap py-3 pl-12 pr-0 text-sm font-medium text-gray-900 max-sm:pl-0">
                {item.productName}
              </td>
            </tr>
          ))}

        </tbody>
      </table>
    </li>
  )
}