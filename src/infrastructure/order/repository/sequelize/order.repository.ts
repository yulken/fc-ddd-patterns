import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {

    const promises = entity.items.map(async (item) => {
      const updated = await OrderItemModel.update({
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        },
        {
          where: {
            id: item.id
          }
        }
      )

      if (updated[0] < 1){
        OrderItemModel.create({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
          order_id: entity.id
        })
      }
    })

    await Promise.all(promises)

    await OrderModel.update(
      {
        total: entity.total()
      },
      {
        where: {
          id: entity.id,
        }
      }
    );
  }

  async find(id: string): Promise<Order>{
    const orderModel = await OrderModel.findOne({ 
      where: { id } ,
      include: [{ model: OrderItemModel }],
    });
    
    const orderItems = orderModel.items.map((item) => {
      return new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
    })

    return new Order(orderModel.id, orderModel.customer_id, orderItems);
  }

  async findAll(): Promise<Order[]>{
    const orderModels = await OrderModel.findAll({include: {model: OrderItemModel}})

    return orderModels.map((orderModel) => {
      const orderItems = orderModel.items.map((item) => {
        return new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
      })

      return new Order(orderModel.id, orderModel.customer_id, orderItems)
    })
  }
}
