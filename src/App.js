import React, { useCallback, useEffect, useState } from 'react';
import { createClient } from 'contentful';
import useRazorPay from 'react-razorpay';

const App = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [total, setTotal] = useState(0);
  const RazorPay = useRazorPay();
  const razorPayDisplay = useCallback(async (total) => {
    const options = {
      key: 'rzp_test_nL1pV1YUCxXcT0',
      amount: total,
      currency: "INR",
      name: "Game-store",
      description: "Gaming transaction",
      handler: (res) => {
        console.log(res);
      },
      prefill: {
        name: "sai krishna",
        email: "saikrishna@gmail.com",
        contACT: "9999999999"
      },
      notes: {
        address: "GAME STORE",
      },
      theme: {
        color: "#3399cc",
      },

    }
    const rzp1 = new RazorPay(options);
    rzp1.open();
  }, [RazorPay])
  const handleAddToCart = (game) => {
    setCartItems((prevCartItems) => [...prevCartItems, game])
    setTotal((prev) => prev + parseInt(products[game - 1].fields.price))
  };

  const handleRemoveFromCart = (game) => {
    setCartItems((prevCartItems) =>
      prevCartItems.filter((item) => item !== game)
    );
    setTotal((prev) => prev - parseInt(products[game - 1].fields.price))
  };
  const handleToggleCart = () => {
    setShowCart((prevState) => !prevState);
  };
  useEffect(() => {
    const client = createClient({
      space: 'anil9g2pmuoc',
      environment: 'master', // defaults to 'master' if not set
      accessToken: 'lgZlE9POulKBo4pdhxEwyXgTd4_PMtOHcBIDkEZd5y4'
    })

    client.getEntries()
      .then((response) => {
        console.log(response.items);
        setProducts(response.items);
      })
      .catch(console.error)
  }, []);

  return (
    <div>
      <h1 onClick={() => setShowCart(false)} style={{ cursor: "pointer" }}>Game Store</h1>
      {!showCart && <button onClick={handleToggleCart}>Check your cart here</button>}
      {showCart && (
        <div>
          <h2>Cart</h2>
          <button onClick={handleToggleCart}>add more items to cart</button>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul>
              {cartItems.map((item) => (
                <li key={item}>
                  {products[item - 1].fields.title}   ₹{products[item - 1].fields.price}
                  <button onClick={() => handleRemoveFromCart(item)}>Remove</button>
                </li>
              ))}
            </ul>
          )}
          {cartItems.length > 0 && (
            <div>
              <p>Total:  ₹{total}</p>
              <button onClick={() => razorPayDisplay(total * 100)}>Checkout</button>
            </div>

          )}
          <p style={{ color: "red" }}> click on game store or add more items to cart or back button to go back to home page.</p>

        </div>)}
      {!showCart && (<div>
        <ul>
          {products.map((product, index) => (
            <li >
              <h2>{product.fields.title}</h2>
              <p>{product.fields.description}</p>
              <p>Price:  ₹{product.fields.price}</p>
              <img
                src={product.fields.image.fields.file.url}
                alt={product.fields.title}
                style={{ width: '200px' }}
              />
              <div></div>
              {cartItems.includes(index + 1) && <button onClick={() => handleRemoveFromCart(index + 1)}>remove from Cart</button>}
              {!cartItems.includes(index + 1) && <button onClick={() => handleAddToCart(index + 1)}>Add to Cart</button>}
            </li>
          ))}
        </ul>
      </div>)}
    </div>
  );
};

export default App;
