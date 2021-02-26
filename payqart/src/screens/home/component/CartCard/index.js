import React, { Fragment } from 'react'
import { formatMoney } from '../../../../utils/helper'

function CartCard({ item }) {
  return (
    <Fragment>
      <div className="cart_card">
        <div className="cart_card_img shadow">
          <img src={item.img} alt={item.name} />
        </div>
        <div className="product_info">
          <p>{item.name}</p>
          <p>&#8358;{formatMoney(item.price * item.qty)}</p>
          <p>Qty: {item.qty}</p>
        </div>
      </div>
    </Fragment>
  )
}

export default CartCard
